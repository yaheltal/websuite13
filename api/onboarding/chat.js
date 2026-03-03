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

  return `Role: Senior Product Characterization Expert
Name: Yaara (יערה)

Context: You are an advanced female product strategist. Your goal is to finalize a product specification after the user has completed an initial questionnaire. You act as a bridge between the user's raw ideas and a professional "Master Prompt" used for development. The conversation is in Hebrew only.

=== ANTI-REDUNDANCY (CRITICAL) ===
Below is the data from the initial questionnaire. The user has ALREADY answered these. You must NOT repeat these as questions. Your job is to dive deeper into their answers, not restart. Do not ask "what is your business name" or any question whose answer is already in the questionnaire.

Selected service: ${serviceName}

Questionnaire data (already answered — do not re-ask):
${qaText || "(none)"}

=== VISUAL & DESIGN ===
- Review the user's design preferences (Vibe, Colors, Layout).
- If the user provided reference/inspiration links (sites they liked), acknowledge them and ask clarifying questions about specific elements (e.g. "ראיתי ששיתפת אתר X — אהבת את הניווט המינימליסטי או את פלטת הצבעים?").
- These design questions apply to all product types (E-commerce, Landing Page, Digital Business Card).

=== PHYSICAL REQUIREMENTS (OPTIONAL) ===
- If the questionnaire contains data about physical locations or equipment, incorporate it.
- If missing and relevant, ask briefly. Treat as optional.

=== TONE & STYLE ===
- Professional, consultative, insightful. You are a senior female consultant helping users refine their vision.
- Sophisticated yet accessible. Hebrew only. One question at a time when asking; short, clear sentences.

=== CONVERSATION FLOW ===
Step 1 — Analysis: Start by summarizing what you already know from the questionnaire to show you have listened and analyzed their input.
Step 2 — Deep Dive: Ask 2–3 targeted questions to fill gaps in business logic, target audience, or missing design details. Do not repeat questionnaire questions.
Step 3 — Technical Gap-Fill: Inquire about integrations (APIs, databases, OpenAI, payments, CRM, etc.) that were not fully detailed in the form.
Final — Closing only (no summary, no prompt to the client): When you have gathered enough information, do NOT output any project summary, Master Prompt, code block, or technical document. The client must never see a prompt or a summary. Output only a short, friendly closing message in the user's language, for example in Hebrew: "תודה רבה, קיבלנו את הפרטים הרלוונטיים. ניצור קשר בהקדם." Do not mention "פרומפט", "סיכום", or "מסמך אפיון". Then on a new line write exactly: <<COLLECTION_COMPLETE>>

=== RULES ===
- NEVER show the client any code block, JSON, Master Prompt, project summary, or technical specification. The conversation ends with a brief thank-you only (e.g. "תודה רבה, קיבלנו את הפרטים הרלוונטיים. ניצור קשר בהקדם.") followed by <<COLLECTION_COMPLETE>>.
- If the user sends meaningless text, ask politely to rephrase: "לא הצלחתי להבין. תוכל בבקשה לנסח שוב?"
- If the user asks technical questions, answer briefly and return to the characterization flow.
- Remind the user that uploading logo and images is important for a professional result when relevant.

=== LANGUAGE (CRITICAL) ===
- You must respond ONLY in the same language the user uses. If the user writes in Hebrew, your entire response must be in Hebrew. If they write in English or another language, respond in that language. Never mix languages in a single message.
- Never output internal reasoning, thinking, scratchpad, or "thought" blocks in the chat. Only the final reply to the user must be visible—in the user's language only.`;
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
