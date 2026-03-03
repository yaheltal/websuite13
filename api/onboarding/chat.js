import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
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

const GEMINI_REST_MODEL = "gemini-1.5-flash";
function geminiRestUrl(model, apiKey) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
}
/** Fallback: call Gemini via REST when SDK fails (e.g. API key / model issues) */
async function geminiRestGenerate(apiKey, systemInstruction, contents, model = GEMINI_REST_MODEL) {
  const formatted = contents.map((c, i) => ({
    role: c.role === "user" || c.role === "model" ? c.role : i % 2 === 0 ? "user" : "model",
    parts: c.parts,
  }));
  const res = await fetch(geminiRestUrl(model, apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: systemInstruction }] }, contents: formatted }),
  });
  if (!res.ok) throw new Error(`Gemini REST ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (text == null) throw new Error("Gemini REST: no text in response");
  return text;
}

const OPENAI_CHAT_MODEL = "gpt-4o-mini";
function openaiChat(systemPrompt, history, userMessage) {
  const key = (process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
  if (!key) throw new Error("OPENAI_API_KEY not set");
  const client = new OpenAI({ apiKey: key });
  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((h) => ({ role: h.role === "user" ? "user" : "assistant", content: h.parts.map((p) => p.text).join(" ") })),
    { role: "user", content: userMessage },
  ];
  return client.chat.completions.create({ model: OPENAI_CHAT_MODEL, messages, max_tokens: 1024 }).then((r) => {
    const t = r.choices?.[0]?.message?.content?.trim();
    if (!t) throw new Error("OpenAI: no content");
    return t;
  });
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

    const raw = (process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY) ?? "";
    const apiKey = raw.replace(/^["']|["']$/g, "").trim();
    const openaiKey = (process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
    if (!apiKey && !openaiKey) {
      sendAdminAlert("AI Chat: No API key", "Add GEMINI_API_KEY or OPENAI_API_KEY in Vercel → Environment Variables.");
      return res.status(500).json({ message: GENERIC_CHAT_ERROR });
    }

    const systemPrompt = getOnboardingSystemPrompt(service || "landing-page", questionnaireData || {});
    const sid = sessionId || crypto.randomUUID();
    const historyForChat = toGeminiHistory(history);
    let reply = "";
    let lastErr;

    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const modelIds = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"];
      for (const modelId of modelIds) {
        const model = genAI.getGenerativeModel({ model: modelId, systemInstruction: systemPrompt });
        const chat = model.startChat({ history: historyForChat });
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          try {
            reply = (await chat.sendMessage(message)).response.text();
            lastErr = null;
            break;
          } catch (retryErr) {
            lastErr = retryErr;
            if (retryErr?.status === 429 && attempt < MAX_RETRIES) {
              const waitSec = 10;
              await new Promise((r) => setTimeout(r, (waitSec + 2) * 1000));
              continue;
            }
            break;
          }
        }
        if (reply) break;
      }
      if (!reply) {
        try {
          const restContents = [
            ...historyForChat.map((h) => ({ role: h.role, parts: h.parts })),
            { role: "user", parts: [{ text: message }] },
          ];
          reply = await geminiRestGenerate(apiKey, systemPrompt, restContents);
        } catch {
          // fall through to OpenAI
        }
      }
    }

    if (!reply && openaiKey) {
      try {
        reply = await openaiChat(systemPrompt, historyForChat, message);
      } catch (e) {
        console.error("OpenAI fallback failed:", e);
      }
    }

    if (!reply) {
      throw new Error(apiKey ? "Gemini failed; OpenAI fallback not set or failed." : "No GEMINI_API_KEY or OPENAI_API_KEY.");
    }

    reply = stripThinkingBlocks(reply);
    const isComplete = reply.includes("<<COLLECTION_COMPLETE>>");
    let cleanReply = reply.replace(/<<COLLECTION_COMPLETE>>/g, "").trim();
    // Never show the client code blocks or project summary (safety if model misbehaves)
    cleanReply = cleanReply.replace(/\s*```[\s\S]*?```\s*/g, " ").replace(/\n{3,}/g, "\n\n").trim();

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
