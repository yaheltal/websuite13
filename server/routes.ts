import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `אתה סוכן AI של WebCraft Studio — סטודיו בוטיק לבניית אתרים פרימיום.
התפקיד שלך: לשוחח עם לקוחות פוטנציאליים, לשאול שאלות חכמות על העסק שלהם, ולאסוף מידע שיעזור לבנות להם אתר מושלם.

כללי שיחה:
- דבר בעברית טבעית, חמה ומקצועית
- הצג את עצמך בהודעה הראשונה כסוכן AI של WebCraft Studio
- שאל שאלה אחת עד שתיים בכל תשובה, לא יותר
- היה ידידותי וסבלני
- התאם את השאלות לפי התשובות שקיבלת

שאלות שעליך לאסוף מידע עליהן (לא חייב בסדר הזה):
1. שם העסק ותחום הפעילות
2. מה סוג האתר שהלקוח צריך (דף נחיתה / כרטיס ביקור דיגיטלי / חנות אונליין / אתר תדמית)
3. מי קהל היעד
4. מה המטרה העיקרית של האתר (מכירות, לידים, תדמית, מידע)
5. האם יש מיתוג קיים (לוגו, צבעים, פונט)
6. האם יש אתר קיים שצריך שדרוג
7. פיצ'רים מיוחדים שהלקוח רוצה (טופס יצירת קשר, גלריה, בלוג, חנות, הזמנות)
8. תקציב משוער
9. לוח זמנים רצוי
10. השראות — אתרים שהלקוח אוהב

כשאספת מספיק מידע (לפחות 5-6 מהנושאים למעלה), הודע ללקוח שיש לך מספיק מידע ותן לו סיכום.
לאחר מכן, צור בלוק קוד עם פרומפט מפורט ומדויק ל-Replit Agent (סוכן AI) שיוכל לבנות את האתר.

הפרומפט צריך להיות בפורמט הבא:
\`\`\`prompt
בנה אתר [סוג האתר] עבור [שם העסק] — [תחום הפעילות].

תיאור העסק: [תיאור מפורט]

קהל יעד: [פירוט]

מטרות האתר: [פירוט]

עיצוב:
- סגנון: [מודרני/קלאסי/מינימליסטי וכו']
- צבעים: [צבעי המיתוג או הצעות]
- פונט: [אם יש]
- השראות: [אתרים לדוגמה]

דפים נדרשים:
- [רשימת דפים]

פיצ'רים:
- [רשימת פיצ'רים]

דגשים טכניים:
- RTL מלא בעברית
- רספונסיבי לנייד
- [דגשים נוספים]
\`\`\`

חשוב: אל תציג את הפרומפט עד שאספת מספיק מידע!`;

const MAX_SESSIONS = 500;
const MAX_HISTORY_LENGTH = 40;
const SESSION_TTL_MS = 30 * 60 * 1000;

const chatSessions = new Map<string, { history: Array<{ role: string; parts: Array<{ text: string }> }>; lastAccess: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [id, session] of chatSessions) {
    if (now - session.lastAccess > SESSION_TTL_MS) {
      chatSessions.delete(id);
    }
  }
}, 5 * 60 * 1000);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(data);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error creating contact:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/contacts", async (_req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "AI service not configured" });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_PROMPT,
      });

      const sid = sessionId || crypto.randomUUID();
      let session = chatSessions.get(sid);

      if (!session) {
        if (chatSessions.size >= MAX_SESSIONS) {
          let oldest: string | null = null;
          let oldestTime = Infinity;
          for (const [id, s] of chatSessions) {
            if (s.lastAccess < oldestTime) {
              oldestTime = s.lastAccess;
              oldest = id;
            }
          }
          if (oldest) chatSessions.delete(oldest);
        }
        session = { history: [], lastAccess: Date.now() };
        chatSessions.set(sid, session);
      }

      session.lastAccess = Date.now();

      const historyForChat = session.history.length > MAX_HISTORY_LENGTH
        ? session.history.slice(-MAX_HISTORY_LENGTH)
        : session.history;

      const chat = model.startChat({
        history: historyForChat,
      });

      const result = await chat.sendMessage(message);
      const reply = result.response.text();

      session.history.push(
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [{ text: reply }] }
      );

      if (session.history.length > MAX_HISTORY_LENGTH + 10) {
        session.history = session.history.slice(-MAX_HISTORY_LENGTH);
      }

      res.json({ reply, sessionId: sid });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "שגיאה בשירות ה-AI, נסה שוב" });
    }
  });

  return httpServer;
}
