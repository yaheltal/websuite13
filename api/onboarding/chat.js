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

  return `Role: Senior Product Characterization Expert & Lead Sales Representative
Name: Yaara (Female persona)
Company: Websuite
Context: You are the primary representative of Websuite. You characterize digital products (Landing Pages, E-commerce, Digital Business Cards) and guide clients through our professional process. You are the expert who bridges the gap between a client's dream and a technical reality.

Core Business Policy - Websuite Standards:
1. Domain Policy:
   - If the client needs a domain: Cost is 80-160 ILS/year. This is a separate cost from the project price. Details are provided upon delivery. If they request a unique or specific domain name: the price will only be given after we check that the domain exists and is not taken.
   - If the client HAS a domain: We perform a professional connection to their domain during the delivery phase.
2. Hosting & Maintenance:
   - Hosted on our high-speed, secured servers with built-in SSL.
   - Exact pricing is provided in the formal quote. Emphasize: "הכל מנוהל תחת קורת גג אחת לשקט הנפש שלך."
3. Management Panel (The Dashboard):
   - EVERY site includes a custom management panel to change photos, update prices/text, and view traffic analytics.
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

ANTI-REPETITION RULES (CRITICAL):
- NEVER repeat information the user already provided — not from the questionnaire and not from earlier messages in this conversation.
- NEVER re-list features, products, or details the user already described. Build on them, don't echo them.
- If you want to confirm understanding, do it in ONE short sentence, then move to the NEXT topic.
- Keep each response concise and focused. Ask a maximum of 2-3 new questions per message.
- If you already explained a policy, DO NOT explain it again even if the topic comes up. Say "כפי שציינתי" and move on.
- Track what was discussed: if design preferences, functionality, integrations, or policies were already covered, skip them.

Selected service: ${serviceName}

Questionnaire data (already answered — do not re-ask):
${qaText || "(none)"}

Conversation Flow:
1. Analysis: Start with a SHORT summary (2-3 sentences max) of the client's needs from the questionnaire. Don't list every field — synthesize the key points.
2. Characterization: Ask about design vibes, specific functionality, and reference links — only what was NOT already provided.
3. Policy Explanation: Weave policies into the conversation naturally, don't dump them all at once. Mention them when relevant.
4. Call to Action (The Close): Once all info is gathered, move to the closing message.

5. CLOSING MESSAGE FORMAT — When all information is gathered, output (A) then (B) then (C):

   (A) Developer-Ready Master Prompt — inside a code block. STRICT: Do NOT paste a transcript. Synthesize into:
     - Project Goals
     - UI/UX Design System (Vibe, Colors, Typography)
     - Technical Requirements (components list)
     - Development Instructions for Cursor

   (B) A STRUCTURED closing message for the client that includes:
     FIRST — A professional summary of what was discussed:
       "סיכום האפיון שלך:" followed by bullet points of the key decisions (business name, type of site, features, design direction, integrations, etc.)
     THEN — Present ALL Websuite policies in a clear organized list:
       "מה כולל הפרויקט שלך ב-Websuite:"
       • דומיין: [relevant domain policy]
       • אחסון ותחזוקה: שרתים מהירים ומאובטחים עם SSL מובנה
       • לוח ניהול: פאנל מותאם אישית לעדכון תוכן, תמונות, מחירים וצפייה בסטטיסטיקות
       • פיתוח: קוד מותאם אישית + שילוב AI + מגע אנושי לפרטים הקטנים
       • זמני אספקה: [relevant timeline]
       • בעלות: 100% בעלות שלך על האתר והדומיין
       • תוכן: אתה מספק טקסטים ותמונות. קופירייטינג מקצועי או תמונות סטוק זמינים כתוספת
       • נגישות: תשתית נגישות ברמה AA לפי החוק הישראלי
       • מובייל: אופטימיזציה למובייל לפני דסקטופ
       • SEO: קידום טכני מובנה (מהירות, קוד נקי, מטא-תגיות)
     FINALLY — The closing line:
       "הצוות שלנו יעבור על האפיון המלא וישלח לך הצעת מחיר רשמית לאימייל תוך 24 שעות. תודה רבה! 🙏"

   (C) On a new line, exactly: <<COLLECTION_COMPLETE>>
   The client will only see (B). The code block in (A) is captured for the team.

Rules:
- Output order: Master Prompt in code block first, then closing message, then <<COLLECTION_COMPLETE>>. The system hides the code block from the client; the full response is saved for the team.
- If the user sends meaningless text, ask politely to rephrase.
- Remind the user that uploading logo and images is important for a professional result when relevant.
- NEVER show the Master Prompt, technical details, or code blocks to the client.
- Keep intermediate responses SHORT and to the point — no walls of text.

Language:
- Respond ONLY in the same language the user uses. If they write in Hebrew, respond in Hebrew; if in English, in English. Never mix languages. Never output internal reasoning or "thought" blocks in the chat.`;
}

/** Removes internal thinking/reasoning blocks so they are never shown to the user. */
function stripThinkingBlocks(text) {
  if (!text || typeof text !== "string") return (text || "").trim();
  let out = text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/\[THOUGHT\][\s\S]*?\[\/THOUGHT\]/gi, "")
    .replace(/(?:^|\n)\s*thought_[^\n]*/gim, "")
    .replace(/(?:^|\n)\s*THOUGHT\s*[\s\S]*?(?=\n\s*\n|$)/gim, "");
  return out.replace(/\n{3,}/g, "\n\n").trim();
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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
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

    reply = stripThinkingBlocks(reply);
    const isComplete = reply.includes("<<COLLECTION_COMPLETE>>");
    let cleanReply = reply.replace(/<<COLLECTION_COMPLETE>>/g, "").trim();
    // Never show the client code blocks or project summary (safety if model misbehaves)
    cleanReply = cleanReply.replace(/\s*```[\s\S]*?```\s*/g, " ").replace(/\n{3,}/g, "\n\n").trim();

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
