import nodemailer from "nodemailer";

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

function generateReplitPrompt(data: {
  clientName: string;
  service: string;
  questionnaireData: Record<string, any>;
  chatSummary?: string;
}): string {
  const serviceName = SERVICE_NAMES[data.service] || data.service;

  const qaDetails = Object.entries(data.questionnaireData)
    .filter(([_, v]) => v && String(v).trim())
    .map(([k, v]) => `  - ${k}: ${v}`)
    .join("\n");

  const chatContext = data.chatSummary
    ? `\n\nסיכום שיחה עם הלקוח:\n${data.chatSummary}`
    : "";

  return `בנה ${serviceName} עבור "${data.clientName}".

דרישות הפרויקט:
${qaDetails || "  - לא צוינו דרישות ספציפיות"}
${chatContext}

הנחיות טכניות:
- עיצוב מודרני ונקי, רספונסיבי לכל המכשירים
- RTL מלא עם פונט עברי (Assistant / Heebo)
- צבעים: ${data.questionnaireData["צבעים מועדפים"] || data.questionnaireData["colors"] || "לפי שיקול דעת מקצועי"}
- כולל טופס צור קשר עם שליחה ל-WhatsApp / אימייל
- SEO בסיסי: כותרות, תיאורים, תגיות מתאימות
- ביצועים מהירים, Lighthouse score גבוה`;
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
      <div style="background: linear-gradient(135deg, #c27a3a, #9a5e2a); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">WEB13</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">ליד חדש מטופס צור קשר</p>
      </div>
      
      <div style="background: #faf8f5; padding: 30px; border: 1px solid #e8e4de; border-top: none;">
        <h2 style="color: #2d3142; margin-top: 0;">פרטי לקוח</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 8px 0; color: #666; width: 120px;">שם:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(data.name)}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">אימייל:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #c27a3a;">${escapeHtml(data.email)}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">טלפון:</td><td style="padding: 8px 0;">${escapeHtml(data.phone || "לא צוין")}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">שירות מבוקש:</td><td style="padding: 8px 0; font-weight: bold; color: #c27a3a;">${escapeHtml(serviceName)}</td></tr>
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

export async function sendOnboardingEmail(data: {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  questionnaireData: Record<string, any>;
  chatSummary: string;
  uploadedFiles: string[];
}): Promise<{ success: boolean; attempts: number }> {
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

  const htmlBody = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #c27a3a, #9a5e2a); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">WEB13</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">ליד חדש מתהליך ה-Onboarding</p>
      </div>
      
      <div style="background: #faf8f5; padding: 30px; border: 1px solid #e8e4de; border-top: none;">
        <h2 style="color: #2d3142; margin-top: 0;">פרטי לקוח</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 8px 0; color: #666; width: 120px;">שם:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(data.clientName)}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">אימייל:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.clientEmail)}" style="color: #c27a3a;">${escapeHtml(data.clientEmail)}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #666;">טלפון:</td><td style="padding: 8px 0;">${escapeHtml(data.clientPhone || "לא צוין")}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">סוג שירות:</td><td style="padding: 8px 0; font-weight: bold; color: #c27a3a;">${escapeHtml(serviceName)}</td></tr>
        </table>
        
        <h2 style="color: #2d3142;">תוצאות שאלון</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e8e4de;">
          ${qaRows || '<tr><td style="padding: 12px; color: #999; font-size: 13px;">לא מולא שאלון</td></tr>'}
        </table>

        ${chatSection}

        ${filesSection}

        <h2 style="color: #2d3142; margin-top: 30px;">פרומפט מותאם — מוכן ל-Replit</h2>
        <p style="color: #666; font-size: 12px; margin-bottom: 8px;">העתק את הבלוק הבא ישירות ל-Replit Agent כדי להתחיל לבנות את הפרויקט:</p>
        <div style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 12px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.8; direction: rtl; text-align: right; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">
${escapeHtml(replitPrompt)}
        </div>
      </div>
      
      <div style="background: #f0ede8; padding: 16px 30px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #e8e4de; border-top: none;">
        <p style="color: #888; margin: 0; font-size: 12px;">נשלח אוטומטית מ-WEB13 Onboarding System</p>
      </div>
    </div>
  `;

  return sendWithRetry({
    from: `"WEB13" <${SENDER_EMAIL}>`,
    to: RECIPIENT_EMAIL,
    subject: `[URGENT] New WebSuite Lead - ${data.clientName}`,
    html: htmlBody,
  });
}
