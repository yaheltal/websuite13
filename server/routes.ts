import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { sendOnboardingEmail, sendContactEmail, sendLeadNotifyEmail, getOnboardingEmailContent, sendAdminAlert } from "./email";
import { requireAdmin } from "./auth";
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

  return `Role: Senior Product Characterization Expert & Lead Sales Representative
Name: Yaara (Female persona)
Company: Websuite
Context: You are the primary representative of Websuite. You characterize digital products (Landing Pages, E-commerce, Digital Business Cards) and guide clients through our professional process. You are the expert who bridges the gap between a client's dream and a technical reality.

Core Business Policy - Websuite Standards:
1. Domain Policy:
   - If the client needs a domain: Cost is 80-160 ILS/year. This is a separate cost from the project price. Details are provided upon delivery.
   - If the client HAS a domain: We perform a professional connection to their domain during the delivery phase.
2. Hosting & Maintenance:
   - Hosted on our high-speed, secured servers with built-in SSL.
   - Exact pricing is provided in the formal quote. Emphasize: "It's all managed under our roof for your peace of mind."
3. Management Panel (The Dashboard):
   - EVERY site includes a custom panel to change photos, update prices/text, and view traffic analytics.
4. Development & Technology:
   - Our stack: Custom Code + AI integration + Human Touch.
   - We don't use 100% automated AI like the rest of the market. We use AI for efficiency but prioritize human precision for the small details.
5. Delivery Timelines:
   - Landing Pages & Digital Business Cards: 5-9 business days.
   - E-commerce Sites: 14-21 business days.
6. Ownership: The client maintains 100% ownership of the site and the domain. Websuite acts as the builder and manager.
7. Content Responsibility: The client provides text and images. Professional copywriting or stock images are available as a paid add-on.
8. Accessibility (Nagishut): All sites are built with an accessibility-ready infrastructure (Level AA) as per Israeli law.
9. Mobile-First: Every project is optimized for mobile performance before desktop.
10. SEO Foundation: Every site includes "Technical SEO" (Site speed, clean code, meta-tags).

Operational Directives:
- Confidence: You ARE Websuite. Use "We", "Our", and "At Websuite...". Never refer the user to external providers or say "check with your provider."
- Handling Price Objections: Focus on value. We build high-converting, custom assets, not generic templates.
- Redundancy Check: Analyze the user's questionnaire data below first. Do not ask questions they already answered.

Selected service: ${serviceName}

Questionnaire data (already answered — do not re-ask):
${qaText || "(none)"}

Conversation Flow:
1. Analysis: Summarize their needs based on the questionnaire.
2. Characterization: Ask about design vibes, specific functionality, and reference links.
3. Policy Explanation: Use the "Websuite Standards" above with 100% certainty.
4. Call to Action (The Close): Once all info is gathered, tell them: "I have everything I need. Our team will review the characterization and send a formal price quote to your email within 24 hours."
5. Closing (client-facing only): Do NOT output any Master Prompt, code block, or technical document to the client. Output only a short, friendly closing message in the user's language, e.g. in Hebrew: "תודה רבה, קיבלנו את כל הפרטים. הצוות שלנו יעבור על האפיון וישלח לך הצעת מחיר רשמית לאימייל תוך 24 שעות." Then on a new line write exactly: <<COLLECTION_COMPLETE>>

Rules:
- NEVER show the client any code block, JSON, Master Prompt, or technical specification. The conversation ends with the closing message above followed by <<COLLECTION_COMPLETE>>.
- If the user sends meaningless text, ask politely to rephrase.
- Remind the user that uploading logo and images is important for a professional result when relevant.

Language:
- Respond ONLY in the same language the user uses. If they write in Hebrew, respond in Hebrew; if in English, in English. Never mix languages. Never output internal reasoning or "thought" blocks in the chat.`;
}

/** Removes internal thinking/reasoning blocks so they are never shown to the user. */
function stripThinkingBlocks(text: string): string {
  let out = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/\[THOUGHT\][\s\S]*?\[\/THOUGHT\]/gi, "")
    .replace(/(?:^|\n)\s*thought_[^\n]*/gim, "")
    .replace(/(?:^|\n)\s*THOUGHT\s*[\s\S]*?(?=\n\s*\n|$)/gim, "");
  return out.replace(/\n{3,}/g, "\n\n").trim();
}

const MAX_SESSIONS = 500;
const MAX_HISTORY_LENGTH = 40;
const SESSION_TTL_MS = 30 * 60 * 1000;

const GEMINI_REST_MODEL = "gemini-2.0-flash";
const GEMINI_REST_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const OPENAI_CHAT_MODEL = "gpt-4o-mini";

/** Fallback when Gemini is unavailable: OpenAI chat completion */
async function openaiChat(
  systemPrompt: string,
  history: Array<{ role: string; parts: Array<{ text: string }> }>,
  userMessage: string
): Promise<string> {
  const openaiKey = (process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
  if (!openaiKey) throw new Error("OPENAI_API_KEY not set");
  const client = new OpenAI({ apiKey: openaiKey });
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
    ...history.map((h) => ({
      role: (h.role === "user" ? "user" : "assistant") as "user" | "assistant",
      content: h.parts.map((p) => p.text).join(" "),
    })),
    { role: "user", content: userMessage },
  ];
  const comp = await client.chat.completions.create({
    model: OPENAI_CHAT_MODEL,
    messages,
    max_tokens: 1024,
  });
  const text = comp.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("OpenAI: no content");
  return text;
}

/** Fallback: call Gemini via REST; מפתח ב-header (מומלץ) או ב-query */
async function geminiRestGenerate(
  apiKey: string,
  systemInstruction: string,
  contents: Array<{ role?: string; parts: Array<{ text: string }> }>,
  model = GEMINI_REST_MODEL
): Promise<string> {
  const formatted = contents.map((c, i) => ({
    role: (c.role === "user" || c.role === "model" ? c.role : i % 2 === 0 ? "user" : "model") as "user" | "model",
    parts: c.parts,
  }));
  const url = `${GEMINI_REST_BASE}/${model}:generateContent`;
  const body = JSON.stringify({ systemInstruction: { parts: [{ text: systemInstruction }] }, contents: formatted });
  const res = await fetch(`${url}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini REST ${res.status}: ${errText}`);
  }
  type GeminiCandidates = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const data = (await res.json()) as GeminiCandidates;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (text == null) throw new Error("Gemini REST: no text in response");
  return text;
}

const AI_SUMMARY_SYSTEM = `You are an assistant. Given a transcript of a client briefing conversation (agent questions and client answers in Hebrew), write a short professional summary in Hebrew for the management team and the developer. Include: project type, main goals, style/brand preferences, and any technical or content requirements. Write 2-4 clear paragraphs. Do not include budget or deadline. Output only the summary, no preamble.`;

/** Generates a professional summary of the chat transcript for the lead email. Returns empty string on failure. */
async function generateConversationSummary(chatTranscript: string): Promise<string> {
  const trimmed = (chatTranscript || "").trim();
  if (!trimmed) return "";

  const geminiRaw = (process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
  const openaiKey = (process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();

  if (geminiRaw) {
    try {
      const modelIds = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];
      for (const modelId of modelIds) {
        try {
          const text = await geminiRestGenerate(geminiRaw, AI_SUMMARY_SYSTEM, [{ parts: [{ text: trimmed }] }], modelId);
          if (text && text.length > 20) return text.trim();
        } catch {
          continue;
        }
      }
    } catch {
      // fall through to OpenAI
    }
  }

  if (openaiKey) {
    try {
      return await openaiChat(AI_SUMMARY_SYSTEM, [], trimmed);
    } catch {
      // ignore
    }
  }

  return "";
}

const chatSessions = new Map<string, { history: Array<{ role: string; parts: Array<{ text: string }> }>; lastAccess: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [id, session] of Array.from(chatSessions.entries())) {
    if (now - session.lastAccess > SESSION_TTL_MS) {
      chatSessions.delete(id);
    }
  }
}, 5 * 60 * 1000);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Preview of questionnaire-completion email (תצוגה מקדימה של מייל סיום שאלון)
  app.get("/api/dev/email-preview/onboarding", (_req, res) => {
    const { html } = getOnboardingEmailContent({
      clientName: "דוגמה לקוח",
      clientEmail: "client@example.com",
      clientPhone: "050-1234567",
      service: "landing-page",
      questionnaireData: {
        businessName: "חנות הפרחים",
        businessField: "מכירת פרחים ומתנות",
        targetAudience: "חתונות ואירועים",
        mainGoal: "לידים והזמנות אונליין",
        brandColors: "#e91e63, #2d2d2d",
      },
      chatSummary: "",
      uploadedFiles: [],
    });
    res.type("html").send(html);
  });

  // Send a real test email (מייל ניסיון) to RECIPIENT_EMAIL — requires GMAIL_APP_PASSWORD in .env
  app.post("/api/dev/send-test-email", async (_req, res) => {
    const testData = {
      clientName: "מייל ניסיון / Test",
      clientEmail: "test@example.com",
      clientPhone: "050-0000000",
      service: "landing-page",
      questionnaireData: {
        businessName: "עסק לדוגמה",
        businessField: "שירותים",
        targetAudience: "לקוחות פרטיים",
        mainGoal: "לידים",
        brandColors: "#3b82f6",
      },
      chatSummary: "",
      uploadedFiles: [],
    };
    try {
      const result = await sendOnboardingEmail(testData);
      if (result.success) {
        res.json({ ok: true, message: "מייל הניסיון נשלח בהצלחה ל-" + "WEBSUITE153@GMAIL.COM" });
      } else {
        res.status(500).json({ ok: false, message: "שליחת המייל נכשלה אחרי " + result.attempts + " ניסיונות" });
      }
    } catch (err: any) {
      console.error("Test email error:", err);
      res.status(500).json({ ok: false, message: err?.message || "שגיאה בשליחת מייל ניסיון" });
    }
  });

  // --- Case 1: Contact form (צור קשר) ---
  app.post("/api/contact", async (req, res) => {
    let data: z.infer<typeof insertContactSchema>;
    try {
      data = insertContactSchema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      throw error;
    }

    let contact: { id: number; name: string; email: string; phone: string | null; service: string; message: string; createdAt: Date } | null = null;
    try {
      contact = await storage.createContact(data);
    } catch (dbError) {
      console.error("Contact DB save failed (will still try to send email):", dbError);
    }

    let emailResult: { success: boolean; attempts: number } = { success: false, attempts: 0 };
    try {
      emailResult = await sendContactEmail({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        service: data.service || "",
        message: data.message || "",
      });
    } catch (emailError) {
      console.error("Contact email threw an exception:", emailError);
    }

    if (emailResult.success) {
      console.log(`Contact email dispatched for: ${data.name} (attempt ${emailResult.attempts})`);
      return res.status(201).json({ ...(contact || {}), emailSent: true, fallback: false });
    }
    console.error(`Contact email failed for: ${data.name}.${contact ? " Data saved to DB." : " DB was unavailable."}`);
    return res.status(201).json({ ...(contact || {}), emailSent: false, fallback: true });
  });

  // רשימת פניות (contacts) ו-onboardings — רק דרך /api/admin/* עם requireAdmin. אין endpoint ציבורי שמחזיר מידע על לידים.

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "הודעה חסרה" });
      }

      const geminiRaw = process.env.GEMINI_API_KEY ?? "";
      const genAI = new GoogleGenerativeAI(geminiRaw.replace(/^["']|["']$/g, "").trim() || "");
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
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
          for (const [id, s] of Array.from(chatSessions.entries())) {
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

      const cleanReply = stripThinkingBlocks(reply).replace(/<<COLLECTION_COMPLETE>>/g, "").trim();

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

  // --- Case 3: End of questionnaire (סוף השאלון) — full details + Replit & Cursor prompts ---
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

      // מייל תוצאות שאלון + שיחת AI נשלח רק בסיום התהליך (ב־complete), לא כאן
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

  // --- Case 2: Start of questionnaire (התראה על תחילת מילוי שאלון) ---
  app.post("/api/onboarding/lead-notify", async (req, res) => {
    try {
      const schema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional().default(""),
        service: z.string().optional().default(""),
      });
      const parsed = schema.parse(req.body);

      const result = await sendLeadNotifyEmail(parsed);
      if (result.success) {
        console.log(`Early lead notification sent for: ${parsed.name}`);
      } else {
        console.error(`Early lead notification failed for: ${parsed.name}`);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Lead notify error:", error);
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // בדיקה: האם יש מפתח ל־AI (Gemini או OpenAI)
  app.get("/api/onboarding/chat-status", (_req, res) => {
    const gemini = !!((process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY) ?? "").replace(/^["']|["']$/g, "").trim();
    const openai = !!(process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
    res.json({ ok: true, geminiConfigured: gemini, openaiConfigured: openai, chatAvailable: gemini || openai });
  });

  // אבחון: קורא ל-Gemini או OpenAI עם משפט אחד
  app.get("/api/onboarding/chat-test", async (_req, res) => {
    const raw = (process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY) ?? "";
    const apiKey = raw.replace(/^["']|["']$/g, "").trim();
    const openaiKey = (process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
    if (!apiKey && !openaiKey) {
      return res.json({
        ok: false,
        error: "No API key",
        message_he: "הוסף ב-.env: GEMINI_API_KEY=... או OPENAI_API_KEY=... (מפתח מ־platform.openai.com)",
        steps: ["אופציה א: Google AI Studio → aistudio.google.com/apikey → GEMINI_API_KEY=...", "אופציה ב: OpenAI → platform.openai.com → API keys → OPENAI_API_KEY=..."],
      });
    }
    const testPrompt = "אמור רק: שלום";
    if (!apiKey && openaiKey) {
      try {
        const text = await openaiChat("ענה בקצרה בעברית.", [], testPrompt);
        return res.json({ ok: true, reply: text, provider: "openai" });
      } catch (e: any) {
        return res.json({ ok: false, error: e?.message || String(e), message_he: "OpenAI נכשל. וודא ש־OPENAI_API_KEY תקף ב־platform.openai.com" });
      }
    }
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(testPrompt);
      const text = result.response.text();
      return res.json({ ok: true, reply: text });
    } catch (sdkErr: any) {
      try {
        const text = await geminiRestGenerate(apiKey, "ענה בקצרה בעברית.", [{ parts: [{ text: testPrompt }] }]);
        return res.json({ ok: true, reply: text });
      } catch (restErr: any) {
        const openaiKey = (process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
        if (openaiKey) {
          try {
            const text = await openaiChat("ענה בקצרה בעברית.", [], testPrompt);
            return res.json({ ok: true, reply: text, provider: "openai" });
          } catch {
            // fall through to error response
          }
        }
        const msg = (restErr?.message || sdkErr?.message || String(sdkErr)) as string;
        const status = (restErr?.status ?? sdkErr?.status ?? restErr?.statusCode ?? sdkErr?.statusCode) as number | undefined;
        const isInvalidKey = /API key not valid|API_KEY_INVALID|invalid.*key/i.test(msg);
        return res.json({
          ok: false,
          error: msg,
          status,
          message_he: isInvalidKey
            ? "גוגל דוחה את המפתח. הוסף OPENAI_API_KEY ב-.env כדי שהצ'אט יעבוד עם OpenAI, או הפעילי Billing ב־AI Studio."
            : undefined,
          steps: isInvalidKey
            ? ["אופציה א: הוסף ב-.env: OPENAI_API_KEY=מפתח_מ_openai.com — הצ'אט יעבוד עם OpenAI", "אופציה ב: הפעילי Billing ב־https://aistudio.google.com/app/plan_information וצרי מפתח חדש ב־aistudio.google.com/apikey"]
            : undefined,
        });
      }
    }
  });

  app.post("/api/onboarding/chat", async (req, res) => {
    try {
      const { message, sessionId, onboardingId, service, questionnaireData } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Message is required" });
      }

      const raw = (process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY) ?? "";
      const apiKey = raw.replace(/^["']|["']$/g, "").trim();
      const openaiKey = (process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
      const GENERIC_CHAT_ERROR = "שגיאה זמנית בשירות. נסה שוב בעוד רגע.";
      if (!apiKey && !openaiKey) {
        const detail = "GEMINI_API_KEY or OPENAI_API_KEY missing. Add one to .env (or Vercel → Environment Variables).";
        console.error("[chat]", detail);
        sendAdminAlert("AI Chat: No API key", detail);
        return res.status(500).json({ message: GENERIC_CHAT_ERROR });
      }

      const systemPrompt = getOnboardingSystemPrompt(service || "landing-page", questionnaireData || {});
      const sid = sessionId || crypto.randomUUID();
      let session = chatSessions.get(sid);

      if (!session) {
        if (chatSessions.size >= MAX_SESSIONS) {
          let oldest: string | null = null;
          let oldestTime = Infinity;
          for (const [id, s] of Array.from(chatSessions.entries())) {
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

      let reply = "";
      const MAX_RETRIES = 1;

      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelIds = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
        for (const modelId of modelIds) {
          try {
            const model = genAI.getGenerativeModel({
              model: modelId,
              systemInstruction: systemPrompt,
            });
            const chat = model.startChat({ history: historyForChat });
            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
              try {
                const result = await chat.sendMessage(message);
                reply = result.response.text();
                break;
              } catch (retryErr: any) {
                console.error(`[chat] Gemini ${modelId} attempt ${attempt} failed:`, retryErr?.message || retryErr);
                if (retryErr?.status === 429 && attempt < MAX_RETRIES) {
                  await new Promise(r => setTimeout(r, 2000));
                  continue;
                }
                break;
              }
            }
            if (reply) break;
          } catch (modelErr: any) {
            console.error(`[chat] Gemini model ${modelId} init failed:`, modelErr?.message || modelErr);
          }
        }
        if (!reply) {
          try {
            const restContents = [
              ...historyForChat.map((h) => ({ role: h.role, parts: h.parts })),
              { role: "user" as const, parts: [{ text: message }] },
            ];
            reply = await geminiRestGenerate(apiKey, systemPrompt, restContents);
          } catch (restErr: any) {
            console.error("[chat] Gemini REST fallback failed:", restErr?.message || restErr);
          }
        }
      }

      if (!reply && openaiKey) {
        try {
          reply = await openaiChat(systemPrompt, historyForChat, message);
        } catch (openaiErr) {
          console.error("[chat] OpenAI fallback failed:", openaiErr);
        }
      }

      if (!reply) {
        throw new Error(apiKey
          ? "Gemini API failed for all models and REST; OpenAI fallback not configured or failed."
          : "No GEMINI_API_KEY or OPENAI_API_KEY configured.");
      }

      reply = stripThinkingBlocks(reply);

      session.history.push(
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [{ text: reply }] }
      );

      if (session.history.length > MAX_HISTORY_LENGTH + 10) {
        session.history = session.history.slice(-MAX_HISTORY_LENGTH);
      }

      const isComplete = reply.includes("<<COLLECTION_COMPLETE>>");
      let cleanReply = reply.replace(/<<COLLECTION_COMPLETE>>/g, "").trim();
      // Never show the client code blocks or project summary (safety if model misbehaves)
      cleanReply = cleanReply.replace(/\s*```[\s\S]*?```\s*/g, " ").replace(/\n{3,}/g, "\n\n").trim();

      if (isComplete && onboardingId) {
        const chatSummary = session.history
          .map(h => `${h.role === "user" ? "לקוח" : "סוכן"}: ${h.parts.map(p => p.text).join(" ")}`)
          .join("\n");

        await storage.updateOnboarding(onboardingId, {
          generatedPrompt: chatSummary,
          chatHistory: session.history as any,
        });
        // Email is sent only in 3 cases: (1) contact form, (2) lead-notify, (3) end of questionnaire. No email here.
      }

      res.json({ reply: cleanReply, sessionId: sid, isComplete });
    } catch (error: any) {
      const detail = error?.message || String(error);
      console.error("Chat error (full):", detail);
      if (error?.status || error?.statusCode) console.error("Chat error status:", error.status || error.statusCode);
      sendAdminAlert("AI Chat error", detail);
      if (error?.status === 429) {
        res.status(429).json({ message: "שירות ה-AI עמוס כרגע. אנא נסה שוב בעוד כמה דקות." });
      } else {
        res.status(500).json({ message: "שגיאה זמנית בשירות. נסה שוב בעוד רגע." });
      }
    }
  });

  app.post("/api/onboarding/upload", (req, res, next) => {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    upload.array("files", 10)(req, res, (err: any) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "קובץ גדול מדי. מקסימום 10MB לקובץ." });
        }
        if (err.message?.includes("סוג קובץ")) {
          return res.status(400).json({ message: "סוג קובץ לא נתמך. השתמש ב-JPG, PNG, SVG, PDF, AI, PSD, WEBP." });
        }
        console.error("Upload multer error:", err);
        return res.status(500).json({ message: "שגיאה בהעלאת קבצים" });
      }
      next();
    });
  }, async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files?.length) {
        return res.status(400).json({ message: "לא נבחרו קבצים. בחר קבצים ולחץ שוב." });
      }

      const onboardingId = req.body?.onboardingId != null ? parseInt(String(req.body.onboardingId), 10) : NaN;
      const filePaths = files.map((f) => f.filename);

      if (!Number.isNaN(onboardingId) && onboardingId > 0) {
        try {
          const existing = await storage.getOnboarding(onboardingId);
          const allFiles = [...(Array.isArray(existing?.uploadedFiles) ? existing.uploadedFiles : []), ...filePaths];
          await storage.updateOnboarding(onboardingId, { uploadedFiles: allFiles });
        } catch {
          // Onboarding not found — client still gets file list and sends it in complete
        }
      }

      return res.json({ files: filePaths });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ message: "שגיאה בהעלאת קבצים" });
    }
  });

  app.post("/api/onboarding/complete", async (req, res) => {
    try {
      const {
        onboardingId,
        name,
        email,
        phone,
        service,
        questionnaireData: bodyQuestionnaire,
        chatSummary: bodyChatSummary,
        uploadedFiles: bodyUploadedFiles,
      } = req.body || {};

      const id = onboardingId != null ? Number(onboardingId) : NaN;
      const onboarding = !Number.isNaN(id) && id > 0 ? await storage.getOnboarding(id) : undefined;

      const questionnaireData = (onboarding?.questionnaireData ?? bodyQuestionnaire ?? {}) as Record<string, any>;
      const uploadedFiles = Array.isArray(onboarding?.uploadedFiles)
        ? onboarding.uploadedFiles
        : Array.isArray(bodyUploadedFiles)
          ? bodyUploadedFiles
          : [];
      const chatSummary = (onboarding?.generatedPrompt ?? bodyChatSummary ?? "").trim();

      const clientName = (onboarding?.name ?? name ?? "").toString().trim();
      const clientEmail = (onboarding?.email ?? email ?? "").toString().trim();
      const clientPhone = (onboarding?.phone ?? phone ?? "").toString().trim();
      const serviceType = onboarding?.service ?? service ?? "landing-page";

      if (!clientName || !clientEmail) {
        return res.status(400).json({ message: "Name and email are required" });
      }

      let aiSummary = "";
      if (chatSummary) {
        try {
          aiSummary = await generateConversationSummary(chatSummary);
        } catch (err) {
          console.error("AI summary generation failed:", err);
        }
      }

      const emailResult = await sendOnboardingEmail({
        clientName,
        clientEmail,
        clientPhone,
        service: serviceType,
        questionnaireData: questionnaireData || {},
        chatSummary,
        aiSummary: aiSummary || undefined,
        uploadedFiles,
      });
      if (emailResult.success) {
        console.log(`Onboarding complete email sent for: ${clientName}`);
      } else {
        console.error(`Onboarding complete email failed for: ${clientName}`);
      }
      res.json({ success: emailResult.success });
    } catch (error) {
      console.error("Complete error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Protected admin data endpoints
  app.get("/api/admin/contacts", requireAdmin, async (_req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Admin contacts error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/onboardings", requireAdmin, async (_req, res) => {
    try {
      const onboardings = await storage.getOnboardings();
      res.json(onboardings);
    } catch (error) {
      console.error("Admin onboardings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.use("/uploads", (req, res, next) => {
    const ext = path.extname(req.path).toLowerCase();
    const allowed = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".pdf", ".webp", ".ai", ".psd"];
    if (allowed.includes(ext)) {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  }, express.static(uploadDir));

  return httpServer;
}
