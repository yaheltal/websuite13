import nodemailer from "nodemailer";

/**
 * Emails are sent in exactly 3 cases:
 * 1. Contact form (צור קשר) → sendContactEmail
 * 2. Start of questionnaire (מילוי פרטים בתחילת שאלון) → sendLeadNotifyEmail — alerts that lead started filling the questionnaire
 * 3. End of questionnaire (סוף השאלון) → sendOnboardingEmail — full client details + Replit prompt (EN) + Cursor prompt (EN)
 */

const RECIPIENT_EMAIL = "WEBSUITE153@GMAIL.COM";
const SENDER_EMAIL = "WEBSUITE153@GMAIL.COM";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SENDER_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function escapeHtml(str: string) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const SERVICE_NAMES: Record<string, string> = {
  "landing-page": "דף נחיתה",
  "digital-card": "כרטיס ביקור דיגיטלי",
  "ecommerce": "חנות אונליין",
  "business-card": "כרטיס ביקור דיגיטלי",
  "other": "אחר",
};

const SERVICE_NAMES_EN: Record<string, string> = {
  "landing-page": "Landing page",
  "digital-card": "Digital business card",
  "ecommerce": "Online store / E-commerce",
  "business-card": "Digital business card",
  "other": "Other",
};

/** English labels for questionnaire keys (prompts must be fully in English for Replit/Cursor). */
const QUESTION_LABELS_EN: Record<string, string> = {
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

/** Hebrew question labels → English (so prompts are fully in English even if key is stored in Hebrew). */
const QUESTION_LABELS_HE_TO_EN: Record<string, string> = {
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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendWithRetry(
  mailOptions: nodemailer.SendMailOptions
): Promise<{ success: boolean; attempts: number }> {
  const transporter = createTransporter();
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email dispatched successfully on attempt ${attempt}`);
      return { success: true, attempts: attempt };
    } catch (err) {
      lastError = err;
      console.error(`Email dispatch attempt ${attempt}/${MAX_RETRIES} failed:`, err);
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  console.error(`Email dispatch failed after ${MAX_RETRIES} attempts. Last error:`, lastError);
  return { success: false, attempts: MAX_RETRIES };
}

/** Human-readable English label for a questionnaire key (for Replit/Cursor prompts). Keys may be English or Hebrew. */
function questionLabelEn(key: string): string {
  const trimmed = String(key).trim();
  return (
    QUESTION_LABELS_EN[trimmed] ||
    QUESTION_LABELS_HE_TO_EN[trimmed] ||
    trimmed.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim()
  );
}

/** Shared data for generating copy-paste prompts (English only, for Replit/Cursor). */
function buildPromptData(data: {
  clientName: string;
  service: string;
  questionnaireData: Record<string, any>;
  chatSummary?: string;
}) {
  const serviceNameEn = SERVICE_NAMES_EN[data.service] || data.service;
  const qaDetails = Object.entries(data.questionnaireData)
    .filter(([_, v]) => v && String(v).trim())
    .map(([k, v]) => `  - ${questionLabelEn(k)}: ${v}`)
    .join("\n");
  const chatContext = data.chatSummary
    ? `\n\nClient conversation summary:\n${data.chatSummary}`
    : "";
  const colors =
    data.questionnaireData["brandColors"] ||
    data.questionnaireData["colors"] ||
    "professional choice";
  return { serviceNameEn, qaDetails, chatContext, colors };
}

/** English prompt for pasting into Replit Agent. */
export function generateReplitPrompt(data: {
  clientName: string;
  service: string;
  questionnaireData: Record<string, any>;
  chatSummary?: string;
}): string {
  const { serviceNameEn, qaDetails, chatContext, colors } = buildPromptData(data);

  return `Build a ${serviceNameEn} for "${data.clientName}".

Project requirements:
${qaDetails || "  - No specific requirements provided"}
${chatContext}

Technical guidelines:
- Modern, clean design; fully responsive
- Full RTL support with Hebrew font (e.g. Assistant / Heebo)
- Colors: ${colors}
- Include a contact form with submit to WhatsApp / email
- Basic SEO: proper headings, meta descriptions, tags
- Fast performance, high Lighthouse score`;
}

/** English prompt for pasting into Cursor (AI in the editor). */
export function generateCursorPrompt(data: {
  clientName: string;
  service: string;
  questionnaireData: Record<string, any>;
  chatSummary?: string;
}): string {
  const { serviceNameEn, qaDetails, chatContext, colors } = buildPromptData(data);

  return `In this Cursor project, build a ${serviceNameEn} for client "${data.clientName}".

Project requirements (from questionnaire):
${qaDetails || "  - No specific requirements provided"}
${chatContext}

Instructions:
- Use the existing project structure and tools where relevant.
- Modern, clean UI; fully responsive; RTL and Hebrew font (Assistant / Heebo).
- Brand/colors: ${colors}
- Include contact form with WhatsApp / email submit.
- Basic SEO and good performance (Lighthouse).
- Follow project conventions and any .cursor/rules or AGENTS.md if present.`;
}

export async function sendLeadNotifyEmail(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
}): Promise<{ success: boolean; attempts: number }> {
  const serviceName = SERVICE_NAMES[data.service] || data.service || "לא צוין";

  const htmlBody = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b6de0, #5b3dbf); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">WEB13</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">ליד חדש התחיל שאלון</p>
      </div>
      
      <div style="background: #faf8f5; padding: 30px; border: 1px solid #e8e4de; border-top: none;">
        <h2 style="color: #2d3142; margin-top: 0;">פרטי לקוח (הודעה מקדימה)</h2>
        <p style="color: #666; font-size: 14px; margin-bottom: 16px;">
          לקוח התחיל למלא את השאלון והשאיר פרטים ראשונים. ייתכן שהוא עדיין באמצע התהליך או שעזב.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 8px 0; color: #666; width: 120px;">שם:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">אימייל:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #3b6de0;">${escapeHtml(data.email)}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">טלפון:</td><td style="padding: 8px 0;"><a href="tel:${escapeHtml(data.phone)}" style="color: #3b6de0; font-weight: bold;">${escapeHtml(data.phone || "לא צוין")}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">שירות מבוקש:</td><td style="padding: 8px 0; font-weight: bold; color: #3b6de0;">${escapeHtml(serviceName)}</td></tr>
        </table>
        <div style="background: #e8f0fe; border: 1px solid #a4c2f4; border-radius: 8px; padding: 12px; font-size: 13px; color: #1a4fa0;">
          הודעה מקדימה - אם הלקוח ימשיך את התהליך, תקבל הודעה מלאה נוספת עם כל הפרטים.
        </div>
      </div>
      
      <div style="background: #f0ede8; padding: 16px 30px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #e8e4de; border-top: none;">
        <p style="color: #888; margin: 0; font-size: 12px;">נשלח אוטומטית מ-WEB13 — התראת ליד מוקדמת</p>
      </div>
    </div>
  `;

  return sendWithRetry({
    from: `"WEB13" <${SENDER_EMAIL}>`,
    to: RECIPIENT_EMAIL,
    subject: `[LEAD] התחיל שאלון - ${data.name} | ${data.phone}`,
    html: htmlBody,
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}): Promise<{ success: boolean; attempts: number }> {
  const serviceName = SERVICE_NAMES[data.service] || data.service || "לא צוין";

  const htmlBody = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b6de0, #5b3dbf); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">WEB13</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">ליד חדש מטופס צור קשר</p>
      </div>
      
      <div style="background: #faf8f5; padding: 30px; border: 1px solid #e8e4de; border-top: none;">
        <h2 style="color: #2d3142; margin-top: 0;">פרטי לקוח</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 8px 0; color: #666; width: 120px;">שם:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">אימייל:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #3b6de0;">${escapeHtml(data.email)}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">טלפון:</td><td style="padding: 8px 0;">${escapeHtml(data.phone || "לא צוין")}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">שירות מבוקש:</td><td style="padding: 8px 0; font-weight: bold; color: #3b6de0;">${escapeHtml(serviceName)}</td></tr>
        </table>

        ${data.message ? `
        <h2 style="color: #2d3142;">הודעת הלקוח</h2>
        <div style="background: white; border: 1px solid #e8e4de; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.8; color: #333;">
          ${escapeHtml(data.message).replace(/\n/g, "<br>")}
        </div>
        ` : ""}
      </div>
      
      <div style="background: #f0ede8; padding: 16px 30px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #e8e4de; border-top: none;">
        <p style="color: #888; margin: 0; font-size: 12px;">נשלח אוטומטית מ-WEB13 — טופס צור קשר</p>
      </div>
    </div>
  `;

  return sendWithRetry({
    from: `"WEB13" <${SENDER_EMAIL}>`,
    to: RECIPIENT_EMAIL,
    subject: `[URGENT] New WebSuite Lead - ${data.name}`,
    html: htmlBody,
  });
}

export type OnboardingEmailData = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  questionnaireData: Record<string, any>;
  chatSummary: string;
  uploadedFiles: string[];
};

/** Returns subject, html and text for the onboarding email (for preview or send). */
export function getOnboardingEmailContent(data: OnboardingEmailData): { subject: string; html: string; text: string } {
  const serviceName = SERVICE_NAMES[data.service] || data.service;

  const qaRows = Object.entries(data.questionnaireData)
    .filter(([_, v]) => v && String(v).trim())
    .map(([k, v]) => `<tr><td style="padding: 6px 12px; color: #666; border-bottom: 1px solid #eee; font-size: 13px;">${escapeHtml(String(k))}</td><td style="padding: 6px 12px; border-bottom: 1px solid #eee; font-size: 13px;">${escapeHtml(String(v))}</td></tr>`)
    .join("");

  const filesSection = data.uploadedFiles.length > 0
    ? `<h3 style="color: #2d3142; margin-top: 24px;">קבצים שהועלו (${data.uploadedFiles.length})</h3>
       <ul style="padding-right: 20px; font-size: 13px; color: #444;">
         ${data.uploadedFiles.map(f => `<li style="padding: 4px 0;">${escapeHtml(f)}</li>`).join("")}
       </ul>`
    : "";

  const chatSection = data.chatSummary
    ? `<h2 style="color: #2d3142;">סיכום שיחת AI</h2>
       <div style="background: white; border: 1px solid #e8e4de; border-radius: 8px; padding: 16px; font-size: 13px; line-height: 1.8; color: #333;">
         ${escapeHtml(data.chatSummary).replace(/\n/g, "<br>")}
       </div>`
    : `<p style="color: #999; font-size: 13px;">שיחת AI לא הושלמה</p>`;

  const replitPrompt = generateReplitPrompt({
    clientName: data.clientName,
    service: data.service,
    questionnaireData: data.questionnaireData,
    chatSummary: data.chatSummary,
  });

  const cursorPrompt = generateCursorPrompt({
    clientName: data.clientName,
    service: data.service,
    questionnaireData: data.questionnaireData,
    chatSummary: data.chatSummary,
  });

  const htmlBody = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b6de0, #5b3dbf); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">WEB13</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">ליד חדש מתהליך ה-Onboarding</p>
      </div>
      
      <div style="background: #faf8f5; padding: 30px; border: 1px solid #e8e4de; border-top: none;">
        <h2 style="color: #2d3142; margin-top: 0;">פרטי לקוח</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 8px 0; color: #666; width: 120px;">שם:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(data.clientName)}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">אימייל:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.clientEmail)}" style="color: #3b6de0;">${escapeHtml(data.clientEmail)}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">טלפון:</td><td style="padding: 8px 0;">${escapeHtml(data.clientPhone || "לא צוין")}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">סוג שירות:</td><td style="padding: 8px 0; font-weight: bold; color: #3b6de0;">${escapeHtml(serviceName)}</td></tr>
        </table>
        
        <h2 style="color: #2d3142;">תוצאות שאלון</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e8e4de;">
          ${qaRows || '<tr><td style="padding: 12px; color: #999; font-size: 13px;">לא מולא שאלון</td></tr>'}
        </table>

        ${chatSection}

        ${filesSection}

        <h2 style="color: #2d3142; margin-top: 30px;">פרומפט מוכן ל-Replit</h2>
        <p style="color: #666; font-size: 12px; margin-bottom: 8px;">העתק את הבלוק הבא ל-Replit Agent:</p>
        <div style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 12px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.8; direction: ltr; text-align: left; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">
${escapeHtml(replitPrompt)}
        </div>

        <h2 style="color: #2d3142; margin-top: 30px;">פרומפט מוכן ל-Cursor</h2>
        <p style="color: #666; font-size: 12px; margin-bottom: 8px;">העתק את הבלוק הבא ל-Cursor (צ'אט או Agent) כדי לבנות את הפרויקט בפרויקט הקיים:</p>
        <div style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 12px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.8; direction: ltr; text-align: left; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">
${escapeHtml(cursorPrompt)}
        </div>
      </div>
      
      <div style="background: #f0ede8; padding: 16px 30px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #e8e4de; border-top: none;">
        <p style="color: #888; margin: 0; font-size: 12px;">נשלח אוטומטית מ-WEB13 Onboarding System</p>
      </div>
    </div>
  `;

  const textBody = [
    `WEB13 - ליד חדש מתהליך Onboarding`,
    ``,
    `פרטי לקוח: ${data.clientName}, ${data.clientEmail}, ${data.clientPhone || "לא צוין"}, ${serviceName}`,
    ``,
    `--- תוצאות שאלון ---`,
    ...Object.entries(data.questionnaireData)
      .filter(([_, v]) => v && String(v).trim())
      .map(([k, v]) => `${k}: ${v}`),
    ``,
    data.chatSummary ? `--- סיכום שיחת AI ---\n${data.chatSummary}` : `(שיחת AI לא הושלמה)`,
    ``,
    `========== PROMPT FOR REPLIT ==========`,
    replitPrompt,
    ``,
    `========== PROMPT FOR CURSOR ==========`,
    cursorPrompt,
    ``,
    `-- WEB13 Onboarding System`,
  ].join("\n");

  const subject = `[URGENT] New WebSuite Lead - ${data.clientName} (includes Replit + Cursor prompts)`;
  return { subject, html: htmlBody, text: textBody };
}

export async function sendOnboardingEmail(data: OnboardingEmailData): Promise<{ success: boolean; attempts: number }> {
  const { subject, html, text } = getOnboardingEmailContent(data);
  return sendWithRetry({
    from: `"WEB13" <${SENDER_EMAIL}>`,
    to: RECIPIENT_EMAIL,
    subject,
    html,
    text,
  });
}
