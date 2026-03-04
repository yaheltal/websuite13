/**
 * POST /api/onboarding/complete — סיום תהליך אונבורדינג.
 * שולח מייל תוצאות (שאלון + שיחת AI + קבצים) רק כאן — אחרי שהמשתמש סיים או דילג על שיחת AI.
 */
import nodemailer from "nodemailer";

const TO = (process.env.RECIPIENT_EMAIL || "WEBSUITE153@GMAIL.COM").trim();
const FROM = (process.env.SENDER_EMAIL || process.env.GMAIL_USER || TO).trim();

const SERVICE_NAMES = {
  "landing-page": "דף נחיתה",
  "digital-card": "כרטיס ביקור דיגיטלי",
  "ecommerce": "חנות אונליין",
  "other": "אחר",
};

const SERVICE_NAMES_EN = {
  "landing-page": "Landing page",
  "digital-card": "Digital business card",
  "ecommerce": "Online store / E-commerce",
  "other": "Other",
};

const QUESTION_LABELS_EN = {
  businessName: "Business name",
  businessField: "Field / Industry",
  targetAudience: "Target audience",
  mainGoal: "Main goal",
  existingBranding: "Existing branding",
  inspirations: "Inspirations",
  specialFeatures: "Special features",
  budget: "Budget",
  timeline: "Timeline",
};

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function questionLabelEn(key) {
  const trimmed = String(key).trim();
  return QUESTION_LABELS_EN[trimmed] || trimmed.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
}

function generateReplitPrompt(clientName, service, questionnaireData, chatSummary) {
  const serviceNameEn = SERVICE_NAMES_EN[service] || service;
  const qaDetails = Object.entries(questionnaireData || {})
    .filter(([_, v]) => v && String(v).trim())
    .map(([k, v]) => `  - ${questionLabelEn(k)}: ${v}`)
    .join("\n");
  const colors = questionnaireData?.brandColors || questionnaireData?.colors || "professional choice";
  const chatPart = chatSummary ? `\n\nFrom AI conversation:\n${chatSummary}` : "";
  return `Build a ${serviceNameEn} for "${clientName}".

Project requirements:
${qaDetails || "  - No specific requirements provided"}${chatPart}

Technical guidelines:
- Modern, clean design; fully responsive; RTL and Hebrew font
- Colors: ${colors}
- Contact form with WhatsApp / email; good SEO and performance`;
}

function generateCursorPrompt(clientName, service, questionnaireData, chatSummary) {
  const serviceNameEn = SERVICE_NAMES_EN[service] || service;
  const qaDetails = Object.entries(questionnaireData || {})
    .filter(([_, v]) => v && String(v).trim())
    .map(([k, v]) => `  - ${questionLabelEn(k)}: ${v}`)
    .join("\n");
  const colors = questionnaireData?.brandColors || questionnaireData?.colors || "professional choice";
  const chatPart = chatSummary ? `\n\nFrom AI conversation:\n${chatSummary}` : "";
  return `Build a ${serviceNameEn} for client "${clientName}".

Project requirements:
${qaDetails || "  - No specific requirements provided"}${chatPart}

Instructions: Modern UI, RTL, Hebrew font, colors: ${colors}, contact form, SEO, performance.`;
}

const SYNTH_SYSTEM_PROMPT = `You are a senior web-development project manager. You receive a client questionnaire (key-value pairs) and a conversation transcript (in Hebrew) between a sales agent and the client about building a website / landing page / e-commerce store.

Your job: produce TWO developer-ready prompts **in English only**. Do NOT paste the transcript or questionnaire verbatim. Instead, **synthesize** the information into a clear, actionable brief that an AI coding assistant can execute to build roughly 50 % of the project.

Each prompt must follow this structure:
1. **Project Goals** – what the site should achieve (leads, sales, brand presence, etc.)
2. **UI/UX Design System** – vibe/mood, color palette, typography, layout style, reference sites if mentioned
3. **Technical Requirements** – list of concrete components (Hero section, contact form, product catalog, WhatsApp button, social links, gallery, testimonials, pricing table, etc.)
4. **Development Instructions** – RTL support, Hebrew content, SEO meta-tags, mobile-first, performance, accessibility (Israeli law AA)

CRITICAL: Both prompts are for building a NEW website from scratch (greenfield project). NEVER use words like "update", "enhance", "improve", "fix", "modify existing", or "upgrade". Use "create", "build", "initialize", "implement", "set up" instead. There is NO existing site — everything is built from zero.

Differences between the two prompts:
- **Replit prompt**: assumes a brand-new project created from scratch inside Replit. Start with project initialization.
- **Cursor prompt**: assumes a brand-new project built from scratch inside Cursor IDE. Include the line "Initialize a new project from scratch. If .cursor/rules or AGENTS.md exist in the workspace, follow their conventions."

Output format (strict):
- First line: exactly \`---REPLIT---\`
- Then the full Replit prompt
- Then a line: exactly \`---CURSOR---\`
- Then the full Cursor prompt
- Nothing else before or after.`;

async function geminiSynthesize(apiKey, userContent, timeoutMs = 15000) {
  const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYNTH_SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: userContent }] }],
          }),
        });
        if (!res.ok) throw new Error(`Gemini ${model} ${res.status}`);
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error(`Gemini ${model}: no text`);
        return text;
      } finally {
        clearTimeout(timer);
      }
    } catch {
      continue;
    }
  }
  return null;
}

async function openaiSynthesize(userContent, timeoutMs = 15000) {
  const key = (process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
  if (!key) return null;
  try {
    const { default: OpenAI } = await import("openai");
    const client = new OpenAI({ apiKey: key, timeout: timeoutMs });
    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYNTH_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      max_tokens: 2048,
    });
    return r.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

function parseSynthOutput(raw) {
  if (!raw) return null;
  const replitIdx = raw.indexOf("---REPLIT---");
  const cursorIdx = raw.indexOf("---CURSOR---");
  if (replitIdx === -1 || cursorIdx === -1 || cursorIdx <= replitIdx) return null;
  const replit = raw.substring(replitIdx + "---REPLIT---".length, cursorIdx).trim();
  const cursor = raw.substring(cursorIdx + "---CURSOR---".length).trim();
  if (!replit || !cursor || replit.length < 50 || cursor.length < 50) return null;
  return { replitPrompt: replit, cursorPrompt: cursor };
}

async function synthesizePrompts(clientName, service, questionnaireData, chatSummary) {
  const geminiKey = ((process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY) ?? "").replace(/^["']|["']$/g, "").trim();
  const serviceEn = SERVICE_NAMES_EN[service] || service;
  const qaText = Object.entries(questionnaireData || {})
    .filter(([_, v]) => v && String(v).trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const userContent = [
    `Client name: ${clientName}`,
    `Service type: ${serviceEn}`,
    "",
    "=== QUESTIONNAIRE ===",
    qaText || "(empty)",
    "",
    "=== CONVERSATION TRANSCRIPT ===",
    chatSummary || "(no conversation)",
  ].join("\n");

  if (geminiKey) {
    const raw = await geminiSynthesize(geminiKey, userContent);
    const result = parseSynthOutput(raw);
    if (result) return result;
  }

  const raw = await openaiSynthesize(userContent);
  return parseSynthOutput(raw);
}

function readBodyStream(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function getBody(req) {
  const b = req.body;
  if (b && typeof b === "object" && !Array.isArray(b) && Object.keys(b).length > 0) return b;
  if (typeof b === "string" && b.trim()) {
    try {
      return JSON.parse(b);
    } catch {
      return {};
    }
  }
  return {};
}

async function getBodyAsync(req) {
  const body = getBody(req);
  if (body && Object.keys(body).length > 0) return body;
  try {
    const raw = await readBodyStream(req);
    if (raw && raw.length > 0) return JSON.parse(raw.toString("utf8"));
  } catch (e) {
    console.error("getBodyAsync read stream:", e);
  }
  return {};
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const body = await getBodyAsync(req);
    const { name, email, phone, service, questionnaireData, chatSummary, uploadedFiles } = body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const qa = questionnaireData || {};
    const serviceName = SERVICE_NAMES[service] || service;
    const files = Array.isArray(uploadedFiles) ? uploadedFiles : [];
    const chat = typeof chatSummary === "string" ? chatSummary.trim() : "";

    const qaRows = Object.entries(qa)
      .filter(([_, v]) => v && String(v).trim())
      .map(([k, v]) => `<tr><td style="padding: 6px 12px; color: #666; border-bottom: 1px solid #eee; font-size: 13px;">${escapeHtml(String(k))}</td><td style="padding: 6px 12px; border-bottom: 1px solid #eee; font-size: 13px;">${escapeHtml(String(v))}</td></tr>`)
      .join("");

    const chatSection = chat
      ? `<h2 style="color: #2d3142;">סיכום שיחת AI</h2><div style="background: white; border: 1px solid #e8e4de; border-radius: 8px; padding: 16px; font-size: 13px; line-height: 1.8; color: #333;">${escapeHtml(chat).replace(/\n/g, "<br>")}</div>`
      : `<p style="color: #999; font-size: 13px;">שיחת AI לא הושלמה</p>`;

    const filesSection =
      files.length > 0
        ? `<h3 style="color: #2d3142; margin-top: 24px;">קבצים שהועלו (${files.length})</h3><ul style="padding-right: 20px; font-size: 13px;">${files.map((f) => `<li>${escapeHtml(String(f))}</li>`).join("")}</ul>`
        : "";

    let replitPrompt, cursorPrompt;
    let hasSynthesized = false;
    try {
      const synth = await synthesizePrompts(name || "", service || "landing-page", qa, chat);
      if (synth) {
        replitPrompt = synth.replitPrompt;
        cursorPrompt = synth.cursorPrompt;
        hasSynthesized = true;
        console.log(`Synthesized prompts generated for: ${name}`);
      }
    } catch (synthErr) {
      console.error("Prompt synthesis failed (using template fallback):", synthErr);
    }
    if (!hasSynthesized) {
      replitPrompt = generateReplitPrompt(name || "", service || "landing-page", qa, chat);
      cursorPrompt = generateCursorPrompt(name || "", service || "landing-page", qa, chat);
    }

    const html = `
<div dir="rtl" style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3b6de0, #5b3dbf); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">WEB13</h1>
    <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">ליד חדש — סיום תהליך Onboarding</p>
  </div>
  <div style="background: #faf8f5; padding: 30px; border: 1px solid #e8e4de; border-top: none;">
    <h2 style="color: #2d3142; margin-top: 0;">פרטי לקוח</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr><td style="padding: 8px 0; color: #666; width: 120px;">שם:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(name || "")}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">אימייל:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email || "")}" style="color: #3b6de0;">${escapeHtml(email || "")}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #666;">טלפון:</td><td style="padding: 8px 0;">${escapeHtml(phone || "לא צוין")}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">סוג שירות:</td><td style="padding: 8px 0; font-weight: bold; color: #3b6de0;">${escapeHtml(serviceName)}</td></tr>
    </table>
    <h2 style="color: #2d3142;">תוצאות שאלון</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e8e4de;">
      ${qaRows || '<tr><td style="padding: 12px; color: #999; font-size: 13px;">לא מולא שאלון</td></tr>'}
    </table>
    ${chatSection}
    ${filesSection}
    <h2 style="color: #2d3142; margin-top: 30px;">פרומפט ל-Replit${hasSynthesized ? ' <span style="color: #16a34a; font-size: 13px; font-weight: normal;">(מסונתז)</span>' : ""}</h2>
    <div style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 12px; font-family: monospace; font-size: 12px; line-height: 1.8; direction: ltr; text-align: left; white-space: pre-wrap;">${escapeHtml(replitPrompt)}</div>
    <h2 style="color: #2d3142; margin-top: 30px;">פרומפט ל-Cursor${hasSynthesized ? ' <span style="color: #16a34a; font-size: 13px; font-weight: normal;">(מסונתז)</span>' : ""}</h2>
    <div style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 12px; font-family: monospace; font-size: 12px; line-height: 1.8; direction: ltr; text-align: left; white-space: pre-wrap;">${escapeHtml(cursorPrompt)}</div>
  </div>
  <div style="background: #f0ede8; padding: 16px 30px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #e8e4de; border-top: none;">
    <p style="color: #888; margin: 0; font-size: 12px;">נשלח אוטומטית מ-WEB13 Onboarding System</p>
  </div>
</div>`;

    const pass = (process.env.GMAIL_APP_PASSWORD || "").trim();
    if (pass && name?.trim() && email?.trim()) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: FROM, pass },
        });
        await transporter.sendMail({
          from: `"WEB13" <${FROM}>`,
          to: TO,
          subject: `[URGENT] New WebSuite Lead - ${name} (Replit + Cursor prompts)`,
          html,
        });
      } catch (mailErr) {
        console.error("Complete email error:", mailErr);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Complete error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
