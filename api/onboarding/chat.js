import { GoogleGenerativeAI } from "@google/generative-ai";
import crypto from "crypto";
import nodemailer from "nodemailer";

const ALERT_EMAIL_TO = (process.env.RECIPIENT_EMAIL || "WEBSUITE153@GMAIL.COM").trim();
const GENERIC_CHAT_ERROR = "שגיאה זמנית בשירות. נסה שוב בעוד רגע.";

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
const MAX_RETRIES = 2;

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

/** Convert client history [{ role: "user"|"bot", content }] to Gemini format */
function toGeminiHistory(history) {
  if (!Array.isArray(history) || history.length === 0) return [];
  const out = history
    .filter((h) => h && (h.role === "user" || h.role === "bot") && h.content)
    .map((h) => ({
      role: h.role === "bot" ? "model" : "user",
      parts: [{ text: String(h.content).trim() }],
    }));
  return out.length > MAX_HISTORY_LENGTH ? out.slice(-MAX_HISTORY_LENGTH) : out;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { message, sessionId, onboardingId, service, questionnaireData, history } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "Message is required" });
    }

    const raw = process.env.GEMINI_API_KEY ?? "";
    const apiKey = raw.replace(/^["']|["']$/g, "").trim();
    if (!apiKey) {
      const detail = "GEMINI_API_KEY is missing. Vercel: Settings → Environment Variables → add GEMINI_API_KEY.";
      sendAdminAlert("AI Chat: API key missing", detail);
      return res.status(500).json({ message: GENERIC_CHAT_ERROR });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = getOnboardingSystemPrompt(service || "landing-page", questionnaireData || {});
    const modelIds = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    const sid = sessionId || crypto.randomUUID();
    const historyForChat = toGeminiHistory(history);
    let reply = "";
    let lastErr;

    for (const modelId of modelIds) {
      const model = genAI.getGenerativeModel({
        model: modelId,
        systemInstruction: systemPrompt,
      });
      const chat = model.startChat({ history: historyForChat });
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const result = await chat.sendMessage(message);
          reply = result.response.text();
          lastErr = null;
          break;
        } catch (retryErr) {
          lastErr = retryErr;
          if (retryErr?.status === 429 && attempt < MAX_RETRIES) {
            const retryMatch = retryErr?.message?.match(/retry in (\d+)/i);
            const waitSec = retryMatch ? Math.min(parseInt(retryMatch[1], 10), 40) : 10;
            await new Promise((r) => setTimeout(r, (waitSec + 2) * 1000));
            continue;
          }
          break;
        }
      }
      if (reply) break;
    }
    if (!reply && lastErr) throw lastErr;

    reply = reply.replace(/THOUGHT[\s\S]*?(?=\n[^\n])/g, "").trim();
    const isComplete = reply.includes("<<COLLECTION_COMPLETE>>");
    const cleanReply = reply.replace(/<<COLLECTION_COMPLETE>>/g, "").trim();

    return res.status(200).json({ reply: cleanReply, sessionId: sid, isComplete });
  } catch (error) {
    const detail = error?.message || String(error);
    console.error("Chat error:", error);
    sendAdminAlert("AI Chat error", detail);
    if (error?.status === 429) {
      return res.status(429).json({ message: "שירות ה-AI עמוס כרגע. אנא נסה שוב בעוד כמה דקות." });
    }
    return res.status(500).json({ message: GENERIC_CHAT_ERROR });
  }
}
