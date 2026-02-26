import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendPromptEmail } from "./email";
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

  return `אתה סוכן AI מקצועי של WebCraft Studio — סטודיו בוטיק לבניית אתרים פרימיום.

הלקוח מילא שאלון ראשוני ובחר בשירות: ${serviceName}

המידע שהלקוח סיפק בשאלון:
${qaText}

התפקיד שלך:
1. לעבור על המידע שהלקוח כבר סיפק ולשאול שאלות העמקה חכמות
2. לחפור לעומק בנושאים שחסרים או לא ברורים
3. לשאול שאלה אחת עד שתיים בכל תשובה
4. להיות ידידותי, מקצועי וחם

נושאים שחשוב לכסות (אם לא כוסו בשאלון):
- חזון העיצוב ותחושת המותג
- פיצ'רים ספציפיים שנדרשים
- תוכן — מי יספק טקסטים ותמונות
- SEO ושיווק דיגיטלי
- אינטגרציות (CRM, תשלומים, רשתות חברתיות)
- העדפות טכניות
- דדליין ותקציב (אם לא צוינו)

כשאתה מרגיש שיש לך מספיק מידע (אחרי 4-8 הודעות), הודע ללקוח שסיימת לאסוף מידע.
ואז צור פרומפט מפורט ומדויק ל-Replit Agent בפורמט הבא:

\`\`\`prompt
Build a [type] website for [business name] — [industry/field].

Business Description: [detailed description in English]

Target Audience: [details]

Website Goals: [details]

Design:
- Style: [modern/classic/minimalist etc.]
- Colors: [brand colors or suggestions]
- Font: [if specified]
- Inspirations: [reference sites]
- Direction: RTL (Hebrew)

Pages Required:
- [list of pages with descriptions]

Features:
- [detailed feature list]

Technical Requirements:
- Full RTL Hebrew support
- Mobile responsive
- [additional requirements]

Content Sections:
- [detailed content structure]
\`\`\`

חשוב מאוד:
- הפרומפט הסופי חייב להיות באנגלית כדי שסוכן ה-AI של Replit יבין אותו הכי טוב
- אבל השיחה עם הלקוח חייבת להיות בעברית
- אל תציג את הפרומפט עד שאספת מספיק מידע!
- כשאתה מוכן להציג את הפרומפט, תתחיל את ההודעה עם הטקסט: "✅ סיימתי לאסוף את כל המידע!"`;
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

      const result = await chat.sendMessage(message);
      const reply = result.response.text();

      session.history.push(
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [{ text: reply }] }
      );

      if (session.history.length > MAX_HISTORY_LENGTH + 10) {
        session.history = session.history.slice(-MAX_HISTORY_LENGTH);
      }

      const hasPrompt = reply.includes("```prompt") || reply.includes("```\nprompt") || (reply.includes("✅") && reply.includes("```"));

      if (hasPrompt && onboardingId) {
        const promptMatch = reply.match(/```(?:prompt)?\n?([\s\S]*?)```/);
        const prompt = promptMatch ? promptMatch[1].trim() : "";
        if (prompt) {
          await storage.updateOnboarding(onboardingId, {
            generatedPrompt: prompt,
            chatHistory: session.history as any,
          });
        }
      }

      res.json({ reply, sessionId: sid, hasPrompt });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "שגיאה בשירות ה-AI, נסה שוב" });
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

      if (!onboarding.generatedPrompt) {
        return res.status(400).json({ message: "No prompt generated yet" });
      }

      try {
        await sendPromptEmail({
          clientName: onboarding.name,
          clientEmail: onboarding.email,
          service: onboarding.service,
          prompt: onboarding.generatedPrompt,
        });
        res.json({ success: true, emailSent: true });
      } catch (emailError) {
        console.error("Email send error:", emailError);
        res.json({ success: true, emailSent: false, emailError: "Failed to send email" });
      }
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
