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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { onboardingId, name, email, phone, service, questionnaireData, chatSummary, uploadedFiles } = req.body || {};

    if (onboardingId == null || onboardingId === "") {
      return res.status(400).json({ message: "Onboarding ID required" });
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

    const replitPrompt = generateReplitPrompt(name || "", service || "landing-page", qa, chat);
    const cursorPrompt = generateCursorPrompt(name || "", service || "landing-page", qa, chat);

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
    <h2 style="color: #2d3142; margin-top: 30px;">פרומפט ל-Replit</h2>
    <div style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 12px; font-family: monospace; font-size: 12px; line-height: 1.8; direction: ltr; text-align: left; white-space: pre-wrap;">${escapeHtml(replitPrompt)}</div>
    <h2 style="color: #2d3142; margin-top: 30px;">פרומפט ל-Cursor</h2>
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
