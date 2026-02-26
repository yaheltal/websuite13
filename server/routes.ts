import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendOnboardingEmail, sendContactEmail } from "./email";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|svg|pdf|ai|psd|webp)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error("סוג קובץ לא נתמך"));
    }
  },
});

function getOnboardingSystemPrompt(service: string, questionnaireData: Record<string, any>) {
  const serviceNames: Record<string, string> = {
    "landing-page": "דף נחיתה",
    "digital-card": "כרטיס ביקור דיגיטלי",
    "ecommerce": "חנות אונליין / E-commerce",
  };

  const serviceName = serviceNames[service] || service;

  const qaText = Object.entries(questionnaireData)
    .filter(([_, v]) => v && String(v).trim())
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  return `אתה סוכן מכירות ושירות של WEB13. התפקיד שלך הוא לאסוף פרטים מהלקוח כדי לבנות לו אתר/פתרון דיגיטלי.
המטרה שלך: זרימה חלקה של איסוף מידע.

הלקוח בחר בשירות: ${serviceName}

המידע שהלקוח כבר סיפק בשאלון:
${qaText}

כללי סגנון דיבור:
- קצר ולעניין. משפטים קצרים. אל תכתוב פסקאות ארוכות.
- שאל שאלה אחת בכל פעם בלבד.
- היה ידידותי, מקצועי וחם.
- השיחה חייבת להיות בעברית בלבד.
- אסור בשום מצב להציג קוד, JSON, בלוקים טכניים, או פרומפטים בצ'אט.

טיפול בקלט לא תקין (חשוב!):
- אם הלקוח שולח טקסט חסר משמעות (כמו "כגג", "adsf", "rthtrht"), אל תתייחס אליו כאל תשובה אמיתית.
- בקש ממנו בנימוס לנסח מחדש: "לא הצלחתי להבין. תוכל בבקשה לנסח שוב את [הפרט הנדרש] כדי שנמשיך?"
- לעולם אל תמשיך הלאה עם נתונים לא הגיוניים. ודא שקיבלת מידע ברור לפני שאתה עובר לשאלה הבאה.

אישור קבלת נתונים:
- לפני שאתה עובר לשאלה הבאה, אשר שקיבלת את הנתון: "מעולה, תודה! עכשיו לגבי..."

נושאים שחשוב לכסות (אם לא כוסו בשאלון):
- חזון העיצוב ותחושת המותג (צבעים, סגנון, השראות)
- פיצ'רים ספציפיים שנדרשים
- תוכן — מי יספק טקסטים ותמונות
- קהל יעד
- אינטגרציות (CRM, תשלומים, רשתות חברתיות)
- דדליין ותקציב (אם לא צוינו)

חשיבות ויזואלית:
- ציין ללקוח שהעלאת הלוגו והתמונות היא צעד קריטי כדי שהתוצאה תהיה מקצועית.
- הזכר את זה בשיחה כשמתאים.

לוגיקת סיום שיחה:
- כשיש לך מספיק מידע (אחרי 4-8 הודעות), סיים את השיחה.
- שלח הודעת סיכום שירותית: "תודה רבה על הפרטים! הנתונים התקבלו בהצלחה. הצוות שלנו יעבור על הכל ונחזור אליך בהקדם לתיאום המשך עבודה."
- חובה: כשאתה מסיים את השיחה, הוסף בסוף ההודעה שלך (בשורה נפרדת) את הטקסט הבא בדיוק: <<COLLECTION_COMPLETE>>
- הטקסט <<COLLECTION_COMPLETE>> לא יוצג ללקוח, הוא רק סימון פנימי למערכת.

אם הלקוח שואל שאלות טכניות, ענה בקצרה והחזר אותו למסלול איסוף הפרטים.`;
}

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

      try {
        await sendContactEmail({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          service: data.service || "",
          message: data.message || "",
        });
        console.log(`Contact email sent for: ${data.name}`);
      } catch (emailErr) {
        console.error("Contact email error:", emailErr);
      }

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
        return res.status(400).json({ message: "הודעה חסרה" });
      }

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `אתה סוכן מכירות ושירות של WEB13 — סוכנות בוטיק לבניית אתרים.
אתה עוזר ללקוחות פוטנציאליים להבין מה הם צריכים ומעודד אותם להתחיל את תהליך ההרשמה.

כללים:
- דבר בעברית בלבד. קצר ולעניין.
- שאל שאלה אחת בכל פעם.
- היה ידידותי ומקצועי.
- אסור להציג קוד, JSON, או בלוקים טכניים.
- אם הלקוח שולח טקסט חסר משמעות, בקש ממנו לנסח מחדש בנימוס.
- אם הלקוח מתעניין, הפנה אותו ל"תהליך ההרשמה" בכפתור "בואו נתחיל" בעמוד הראשי.

השירותים של WEB13:
1. דפי נחיתה — עמוד יחיד ממוקד המרות
2. כרטיסי ביקור דיגיטליים — נוכחות דיגיטלית מקצועית
3. חנויות אונליין — פתרון E-commerce מלא`,
      });

      const sid = sessionId || `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      let session = chatSessions.get(sid);

      if (!session) {
        session = { history: [], lastAccess: Date.now() };
        if (chatSessions.size >= MAX_SESSIONS) {
          let oldest: string | null = null;
          let oldestTime = Infinity;
          for (const [id, s] of chatSessions) {
            if (s.lastAccess < oldestTime) { oldest = id; oldestTime = s.lastAccess; }
          }
          if (oldest) chatSessions.delete(oldest);
        }
        chatSessions.set(sid, session);
      }

      session.lastAccess = Date.now();

      const historyForChat = session.history.map(h => ({
        role: h.role as "user" | "model",
        parts: h.parts,
      }));

      const chat = model.startChat({ history: historyForChat });
      const result = await chat.sendMessage(message);
      const reply = result.response.text();

      const cleanReply = reply
        .replace(/<<COLLECTION_COMPLETE>>/g, "")
        .replace(/\[THOUGHT\][\s\S]*?\[\/THOUGHT\]/gi, "")
        .trim();

      session.history.push({ role: "user", parts: [{ text: message }] });
      session.history.push({ role: "model", parts: [{ text: cleanReply }] });

      if (session.history.length > MAX_HISTORY_LENGTH) {
        session.history = session.history.slice(-MAX_HISTORY_LENGTH);
      }

      res.json({ reply: cleanReply, sessionId: sid });
    } catch (error: any) {
      console.error("Homepage chat error:", error);
      if (error?.status === 429) {
        res.status(429).json({ message: "שירות ה-AI עמוס כרגע. אנא נסה שוב בעוד כמה דקות." });
      } else {
        res.status(500).json({ message: "שגיאה בשירות ה-AI" });
      }
    }
  });

  app.post("/api/onboarding/start", async (req, res) => {
    try {
      const validationSchema = z.object({
        name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
        email: z.string().email("אנא הזן כתובת אימייל תקינה"),
        phone: z.string().nullable().optional(),
        service: z.enum(["landing-page", "digital-card", "ecommerce"]),
        questionnaireData: z.record(z.any()),
      });

      const parsed = validationSchema.parse(req.body);

      const onboarding = await storage.createOnboarding({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone || null,
        service: parsed.service,
        questionnaireData: parsed.questionnaireData,
        chatHistory: null,
        generatedPrompt: null,
        uploadedFiles: null,
      });

      res.status(201).json({ id: onboarding.id });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Onboarding start error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.post("/api/onboarding/chat", async (req, res) => {
    try {
      const { message, sessionId, onboardingId, service, questionnaireData } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "AI service not configured" });
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const systemPrompt = getOnboardingSystemPrompt(service || "landing-page", questionnaireData || {});

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: systemPrompt,
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

      const chat = model.startChat({ history: historyForChat });

      let reply = "";
      const MAX_RETRIES = 2;
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const result = await chat.sendMessage(message);
          reply = result.response.text();
          break;
        } catch (retryErr: any) {
          if (retryErr?.status === 429 && attempt < MAX_RETRIES) {
            const retryMatch = retryErr?.message?.match(/retry in (\d+)/i);
            const waitSec = retryMatch ? Math.min(parseInt(retryMatch[1]), 40) : 10;
            await new Promise(r => setTimeout(r, (waitSec + 2) * 1000));
            continue;
          }
          throw retryErr;
        }
      }

      reply = reply.replace(/THOUGHT[\s\S]*?(?=\n[^\n])/g, "").trim();

      session.history.push(
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [{ text: reply }] }
      );

      if (session.history.length > MAX_HISTORY_LENGTH + 10) {
        session.history = session.history.slice(-MAX_HISTORY_LENGTH);
      }

      const isComplete = reply.includes("<<COLLECTION_COMPLETE>>");
      const cleanReply = reply.replace(/<<COLLECTION_COMPLETE>>/g, "").trim();

      if (isComplete && onboardingId) {
        const chatSummary = session.history
          .map(h => `${h.role === "user" ? "לקוח" : "סוכן"}: ${h.parts.map(p => p.text).join(" ")}`)
          .join("\n");

        await storage.updateOnboarding(onboardingId, {
          generatedPrompt: chatSummary,
          chatHistory: session.history as any,
        });

        const onboarding = await storage.getOnboarding(onboardingId);
        if (onboarding) {
          try {
            await sendOnboardingEmail({
              clientName: onboarding.name,
              clientEmail: onboarding.email,
              clientPhone: onboarding.phone || "",
              service: onboarding.service,
              questionnaireData: onboarding.questionnaireData as Record<string, any> || {},
              chatSummary,
              uploadedFiles: onboarding.uploadedFiles as string[] || [],
            });
          } catch (emailErr) {
            console.error("Auto email error:", emailErr);
          }
        }
      }

      res.json({ reply: cleanReply, sessionId: sid, isComplete });
    } catch (error: any) {
      console.error("Chat error:", error);
      if (error?.status === 429) {
        res.status(429).json({ message: "שירות ה-AI עמוס כרגע. אנא נסה שוב בעוד כמה דקות." });
      } else {
        res.status(500).json({ message: "שגיאה בשירות ה-AI, נסה שוב" });
      }
    }
  });

  app.post("/api/onboarding/upload", upload.array("files", 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const onboardingId = parseInt(req.body.onboardingId);

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      if (!onboardingId) {
        return res.status(400).json({ message: "Onboarding ID required" });
      }

      const filePaths = files.map((f) => f.filename);

      const existing = await storage.getOnboarding(onboardingId);
      const allFiles = [...(existing?.uploadedFiles || []), ...filePaths];

      await storage.updateOnboarding(onboardingId, { uploadedFiles: allFiles });

      res.json({ files: filePaths });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "שגיאה בהעלאת קבצים" });
    }
  });

  app.post("/api/onboarding/complete", async (req, res) => {
    try {
      const { onboardingId } = req.body;

      if (!onboardingId) {
        return res.status(400).json({ message: "Onboarding ID required" });
      }

      const onboarding = await storage.getOnboarding(onboardingId);
      if (!onboarding) {
        return res.status(404).json({ message: "Onboarding not found" });
      }

      let chatSummary = "";
      if (onboarding.chatHistory) {
        chatSummary = (onboarding.chatHistory as Array<{ role: string; parts: Array<{ text: string }> }>)
          .map(h => `${h.role === "user" ? "לקוח" : "סוכן"}: ${h.parts.map(p => p.text).join(" ")}`)
          .join("\n");
      }

      try {
        await sendOnboardingEmail({
          clientName: onboarding.name,
          clientEmail: onboarding.email,
          clientPhone: onboarding.phone || "",
          service: onboarding.service,
          questionnaireData: onboarding.questionnaireData as Record<string, any> || {},
          chatSummary,
          uploadedFiles: onboarding.uploadedFiles as string[] || [],
        });
        console.log(`Onboarding complete email sent for: ${onboarding.name}`);
      } catch (emailErr) {
        console.error("Complete email error:", emailErr);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Complete error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.use("/uploads", (req, res, next) => {
    const ext = path.extname(req.path).toLowerCase();
    const allowed = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".pdf", ".webp"];
    if (allowed.includes(ext)) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  });

  return httpServer;
}
