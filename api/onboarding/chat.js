import OpenAI from "openai";
import crypto from "crypto";
import nodemailer from "nodemailer";

const ALERT_EMAIL_TO = (process.env.RECIPIENT_EMAIL || "WEBSUITE153@GMAIL.COM").trim();
const GENERIC_CHAT_ERROR = "שגיאה זמנית בשירות. נסה שוב בעוד רגע.";
const REQUEST_TIMEOUT = 8000; // 8s – leaves headroom within Vercel's 10s Hobby limit

async function sendAdminAlert(subject, detail) {
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();
  if (!pass) return;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: ALERT_EMAIL_TO, pass },
    });
    await transporter.sendMail({
      from: `"WEB13" <${ALERT_EMAIL_TO}>`,
      to: ALERT_EMAIL_TO,
      subject: `[WebSuite Alert] ${subject}`,
      text: `${subject}\n\n${detail}`,
      html: `<h2>WebSuite – Admin Alert</h2><p><strong>${subject}</strong></p><pre>${detail.replace(/</g, "&lt;")}</pre>`,
    });
  } catch (e) {
    console.error("Admin alert email failed:", e);
  }
}

const MAX_HISTORY_LENGTH = 40;

function getOnboardingSystemPrompt(service, questionnaireData) {
  const serviceNames = {
    "landing-page": "דף נחיתה",
    "digital-card": "כרטיס ביקור דיגיטלי",
    "ecommerce": "חנות אונליין / E-commerce",
  };
  const serviceName = serviceNames[service] || service;
  const qaText = Object.entries(questionnaireData || {})
    .filter(([, v]) => v && String(v).trim())
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

/** Convert client history [{ role: "user"|"bot", content }] to Gemini REST format */
function toGeminiContents(history) {
  if (!Array.isArray(history) || history.length === 0) return [];
  const out = history
    .filter((h) => h && (h.role === "user" || h.role === "bot") && h.content)
    .map((h) => ({
      role: h.role === "bot" ? "model" : "user",
      parts: [{ text: String(h.content).trim() }],
    }));
  return out.length > MAX_HISTORY_LENGTH ? out.slice(-MAX_HISTORY_LENGTH) : out;
}

/** Call Gemini via REST with AbortController timeout – most reliable on Vercel */
async function geminiRest(apiKey, systemInstruction, contents, model, timeoutMs = REQUEST_TIMEOUT) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: contents.map((c, i) => ({
          role: c.role === "user" || c.role === "model" ? c.role : i % 2 === 0 ? "user" : "model",
          parts: c.parts,
        })),
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Gemini REST ${model} ${res.status}: ${body.slice(0, 300)}`);
    }
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text == null) throw new Error(`Gemini REST ${model}: no text in response`);
    return text;
  } finally {
    clearTimeout(timer);
  }
}

/** OpenAI fallback with timeout */
async function openaiChat(systemPrompt, contents, userMessage, timeoutMs = REQUEST_TIMEOUT) {
  const key = (process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
  if (!key) throw new Error("OPENAI_API_KEY not set");
  const client = new OpenAI({ apiKey: key, timeout: timeoutMs });
  const messages = [
    { role: "system", content: systemPrompt },
    ...contents.map((h) => ({
      role: h.role === "user" ? "user" : "assistant",
      content: h.parts.map((p) => p.text).join(" "),
    })),
    { role: "user", content: userMessage },
  ];
  const r = await client.chat.completions.create({ model: "gpt-4o-mini", messages, max_tokens: 1024 });
  const t = r.choices?.[0]?.message?.content?.trim();
  if (!t) throw new Error("OpenAI: no content");
  return t;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message, sessionId, service, questionnaireData, history } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    const raw = (process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY) ?? "";
    const apiKey = raw.replace(/^["']|["']$/g, "").trim();
    const openaiKey = (process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();

    if (!apiKey && !openaiKey) {
      console.error("AI Chat: No API key configured");
      sendAdminAlert("AI Chat: No API key", "Add GEMINI_API_KEY or OPENAI_API_KEY in Vercel → Settings → Environment Variables.");
      return res.status(500).json({ message: GENERIC_CHAT_ERROR });
    }

    const systemPrompt = getOnboardingSystemPrompt(service || "landing-page", questionnaireData || {});
    const sid = sessionId || crypto.randomUUID();
    const historyContents = toGeminiContents(history);
    const contents = [...historyContents, { role: "user", parts: [{ text: message }] }];

    let reply = "";
    const errors = [];

    // Strategy: REST API directly (fast, no SDK overhead) → OpenAI fallback
    if (apiKey) {
      // Try gemini-2.0-flash first (fastest, most stable)
      for (const model of ["gemini-2.0-flash", "gemini-1.5-flash"]) {
        try {
          reply = await geminiRest(apiKey, systemPrompt, contents, model);
          break;
        } catch (err) {
          const msg = err?.name === "AbortError" ? `${model}: timeout (${REQUEST_TIMEOUT}ms)` : err?.message || String(err);
          console.error(`Gemini ${model} failed:`, msg);
          errors.push(msg);
        }
      }
    }

    if (!reply && openaiKey) {
      try {
        reply = await openaiChat(systemPrompt, historyContents, message);
      } catch (e) {
        console.error("OpenAI fallback failed:", e?.message || e);
        errors.push(`OpenAI: ${e?.message || e}`);
      }
    }

    if (!reply) {
      const detail = errors.join(" | ") || "No API keys configured";
      console.error("All AI providers failed:", detail);
      sendAdminAlert("AI Chat: all providers failed", detail);
      return res.status(500).json({ message: GENERIC_CHAT_ERROR });
    }

    reply = reply.replace(/THOUGHT[\s\S]*?(?=\n[^\n])/g, "").trim();
    const isComplete = reply.includes("<<COLLECTION_COMPLETE>>");
    const cleanReply = reply.replace(/<<COLLECTION_COMPLETE>>/g, "").trim();

    return res.status(200).json({ reply: cleanReply, sessionId: sid, isComplete });
  } catch (error) {
    const detail = error?.message || String(error);
    console.error("Chat handler error:", error);
    sendAdminAlert("AI Chat error", detail);
    if (error?.status === 429) {
      return res.status(429).json({ message: "שירות ה-AI עמוס כרגע. אנא נסה שוב בעוד כמה דקות." });
    }
    return res.status(500).json({ message: GENERIC_CHAT_ERROR });
  }
}
