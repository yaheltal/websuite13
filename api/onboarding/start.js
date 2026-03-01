import nodemailer from "nodemailer";

const TO = (process.env.RECIPIENT_EMAIL || "WEBSUITE153@GMAIL.COM").trim();
const FROM = (process.env.SENDER_EMAIL || process.env.GMAIL_USER || TO).trim();

const SERVICE_NAMES = {
  "landing-page": "דף נחיתה",
  "digital-card": "כרטיס ביקור דיגיטלי",
  "business-card": "כרטיס ביקור דיגיטלי",
  "ecommerce": "חנות אונליין",
  "other": "אחר",
};

const SERVICE_NAMES_EN = {
  "landing-page": "Landing page",
  "digital-card": "Digital business card",
  "business-card": "Digital business card",
  "ecommerce": "Online store / E-commerce",
  "other": "Other",
};

const QUESTION_LABELS_EN = {
  businessName: "Business name",
  businessField: "Field / Industry",
  targetAudience: "Target audience",
  mainGoal: "Main goal (leads, sales, awareness)",
  existingBranding: "Existing branding (logo, colors)",
  inspirations: "Sites / stores for inspiration",
  specialFeatures: "Special features required",
  budget: "Approximate budget",
  timeline: "Preferred timeline",
  fullName: "Full name",
  jobTitle: "Job title",
  phone: "Phone",
  email: "Email",
  socialLinks: "Social media links",
  brandColors: "Brand colors",
  personalBranding: "Personal style / message",
  productCount: "Approximate number of products",
  shippingMethod: "Shipping method",
  paymentMethods: "Payment methods",
  existingSite: "Existing site (URL if any)",
};

const QUESTION_LABELS_HE_TO_EN = {
  "שם העסק": "Business name",
  "תחום פעילות": "Field / Industry",
  "קהל יעד": "Target audience",
  "מטרה עיקרית (לידים, מכירות, מודעות)": "Main goal (leads, sales, awareness)",
  "האם יש מיתוג קיים? (לוגו, צבעים)": "Existing branding (logo, colors)",
  "אתרים שמשמשים השראה": "Sites / stores for inspiration",
  "פיצ'רים מיוחדים שצריך": "Special features required",
  "תקציב משוער": "Approximate budget",
  "לוח זמנים רצוי": "Preferred timeline",
  "שם מלא": "Full name",
  "תפקיד": "Job title",
  "שם העסק / חברה": "Business name",
  "טלפון": "Phone",
  "אימייל": "Email",
  "קישורים לרשתות חברתיות": "Social media links",
  "צבעי מותג (אם יש)": "Brand colors",
  "סגנון אישי / מסר שתרצה להעביר": "Personal style / message",
  "פיצ'רים (QR, vCard, גלריה)": "Special features",
  "שם החנות / העסק": "Business name",
  "תחום ומוצרים עיקריים": "Field / Industry",
  "כמה מוצרים (בערך)?": "Approximate number of products",
  "שיטת משלוח (דואר, שליח, איסוף)": "Shipping method",
  "אמצעי תשלום (אשראי, PayPal, bit)": "Payment methods",
  "מיתוג קיים (לוגו, צבעים)": "Existing branding (logo, colors)",
  "האם יש אתר קיים? כתובת?": "Existing site (URL if any)",
  "פיצ'רים מיוחדים (קופונים, מלאי, מנויים)": "Special features required",
  "חנויות שמשמשות השראה": "Sites / stores for inspiration",
  "לוח זמנים": "Preferred timeline",
};

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function questionLabelEn(key) {
  const trimmed = String(key).trim();
  return (
    QUESTION_LABELS_EN[trimmed] ||
    QUESTION_LABELS_HE_TO_EN[trimmed] ||
    trimmed.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim()
  );
}

function generateReplitPrompt(clientName, service, questionnaireData) {
  const serviceNameEn = SERVICE_NAMES_EN[service] || service;
  const qaDetails = Object.entries(questionnaireData)
    .filter(([_, v]) => v && String(v).trim())
    .map(([k, v]) => `  - ${questionLabelEn(k)}: ${v}`)
    .join("\n");
  const colors = questionnaireData.brandColors || questionnaireData.colors || "professional choice";

  return `Build a ${serviceNameEn} for "${clientName}".

Project requirements:
${qaDetails || "  - No specific requirements provided"}

Technical guidelines:
- Modern, clean design; fully responsive
- Full RTL support with Hebrew font (e.g. Assistant / Heebo)
- Colors: ${colors}
- Include a contact form with submit to WhatsApp / email
- Basic SEO: proper headings, meta descriptions, tags
- Fast performance, high Lighthouse score`;
}

function generateCursorPrompt(clientName, service, questionnaireData) {
  const serviceNameEn = SERVICE_NAMES_EN[service] || service;
  const qaDetails = Object.entries(questionnaireData)
    .filter(([_, v]) => v && String(v).trim())
    .map(([k, v]) => `  - ${questionLabelEn(k)}: ${v}`)
    .join("\n");
  const colors = questionnaireData.brandColors || questionnaireData.colors || "professional choice";

  return `In this Cursor project, build a ${serviceNameEn} for client "${clientName}".

Project requirements (from questionnaire):
${qaDetails || "  - No specific requirements provided"}

Instructions:
- Use the existing project structure and tools where relevant.
- Modern, clean UI; fully responsive; RTL and Hebrew font (Assistant / Heebo).
- Brand/colors: ${colors}
- Include contact form with WhatsApp / email submit.
- Basic SEO and good performance (Lighthouse).
- Follow project conventions and any .cursor/rules or AGENTS.md if present.`;
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

  const { name, email, phone, service, questionnaireData } = req.body || {};

  if (!name?.trim() || !email?.trim() || !service) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const qa = questionnaireData || {};
  const serviceName = SERVICE_NAMES[service] || service;

  const qaRows = Object.entries(qa)
    .filter(([_, v]) => v && String(v).trim())
    .map(([k, v]) => `<tr><td style="padding: 6px 12px; color: #666; border-bottom: 1px solid #eee; font-size: 13px;">${escapeHtml(String(k))}</td><td style="padding: 6px 12px; border-bottom: 1px solid #eee; font-size: 13px;">${escapeHtml(String(v))}</td></tr>`)
    .join("");

  const replitPrompt = generateReplitPrompt(name, service, qa);
  const cursorPrompt = generateCursorPrompt(name, service, qa);

  const html = `
<div dir="rtl" style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3b6de0, #5b3dbf); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">WEB13</h1>
    <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">ליד חדש מתהליך ה-Onboarding</p>
  </div>
  <div style="background: #faf8f5; padding: 30px; border: 1px solid #e8e4de; border-top: none;">
    <h2 style="color: #2d3142; margin-top: 0;">פרטי לקוח</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr><td style="padding: 8px 0; color: #666; width: 120px;">שם:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">אימייל:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #3b6de0;">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #666;">טלפון:</td><td style="padding: 8px 0;">${escapeHtml(phone || "לא צוין")}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">סוג שירות:</td><td style="padding: 8px 0; font-weight: bold; color: #3b6de0;">${escapeHtml(serviceName)}</td></tr>
    </table>
    <h2 style="color: #2d3142;">תוצאות שאלון</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e8e4de;">
      ${qaRows || '<tr><td style="padding: 12px; color: #999; font-size: 13px;">לא מולא שאלון</td></tr>'}
    </table>
    <h2 style="color: #2d3142; margin-top: 30px;">פרומפט מוכן ל-Replit</h2>
    <p style="color: #666; font-size: 12px; margin-bottom: 8px;">העתק את הבלוק הבא ל-Replit Agent:</p>
    <div style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 12px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.8; direction: ltr; text-align: left; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">
${escapeHtml(replitPrompt)}
    </div>
    <h2 style="color: #2d3142; margin-top: 30px;">פרומפט מוכן ל-Cursor</h2>
    <p style="color: #666; font-size: 12px; margin-bottom: 8px;">העתק את הבלוק הבא ל-Cursor:</p>
    <div style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 12px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.8; direction: ltr; text-align: left; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">
${escapeHtml(cursorPrompt)}
    </div>
  </div>
  <div style="background: #f0ede8; padding: 16px 30px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #e8e4de; border-top: none;">
    <p style="color: #888; margin: 0; font-size: 12px;">נשלח אוטומטית מ-WEB13 Onboarding System</p>
  </div>
</div>`;

  const pass = process.env.GMAIL_APP_PASSWORD || "";
  if (!pass.trim()) {
    return res.status(201).json({ id: Date.now(), emailSent: false });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: FROM, pass: pass.trim() },
    });

    await transporter.sendMail({
      from: `"WEB13" <${FROM}>`,
      to: TO,
      subject: `[URGENT] New WebSuite Lead - ${name} (includes Replit + Cursor prompts)`,
      html,
    });

    return res.status(201).json({ id: Date.now(), emailSent: true });
  } catch (error) {
    console.error("Onboarding email error:", error);
    return res.status(201).json({ id: Date.now(), emailSent: false });
  }
}
