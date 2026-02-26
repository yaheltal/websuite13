import nodemailer from "nodemailer";

const RECIPIENT_EMAIL = "WEBSUITE153@GMAIL.COM";
const SENDER_EMAIL = "WEBSUITE153@GMAIL.COM";

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SENDER_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
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
}) {
  const transporter = createTransporter();

  const serviceNames: Record<string, string> = {
    "landing-page": "דף נחיתה",
    "digital-card": "כרטיס ביקור דיגיטלי",
    "ecommerce": "חנות אונליין",
  };

  const serviceName = serviceNames[data.service] || data.service;

  const qaRows = Object.entries(data.questionnaireData)
    .filter(([_, v]) => v && String(v).trim())
    .map(([k, v]) => `<tr><td style="padding: 6px 12px; color: #666; border-bottom: 1px solid #eee; font-size: 13px;">${k}</td><td style="padding: 6px 12px; border-bottom: 1px solid #eee; font-size: 13px;">${String(v)}</td></tr>`)
    .join("");

  const filesSection = data.uploadedFiles.length > 0
    ? `<h3 style="color: #2d3142; margin-top: 24px;">קבצים שהועלו (${data.uploadedFiles.length})</h3>
       <ul style="padding-right: 20px; font-size: 13px; color: #444;">
         ${data.uploadedFiles.map(f => `<li style="padding: 4px 0;">${f}</li>`).join("")}
       </ul>`
    : "";

  const chatLines = data.chatSummary
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

  const htmlBody = `
    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #c27a3a, #9a5e2a); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">WEB13</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">ליד חדש מהאתר!</p>
      </div>
      
      <div style="background: #faf8f5; padding: 30px; border: 1px solid #e8e4de; border-top: none;">
        <h2 style="color: #2d3142; margin-top: 0;">פרטי קשר</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 8px 0; color: #666; width: 120px;">שם:</td><td style="padding: 8px 0; font-weight: bold;">${data.clientName}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">אימייל:</td><td style="padding: 8px 0;">${data.clientEmail}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">טלפון:</td><td style="padding: 8px 0;">${data.clientPhone || "לא צוין"}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">סוג שירות:</td><td style="padding: 8px 0; font-weight: bold; color: #c27a3a;">${serviceName}</td></tr>
        </table>
        
        <h2 style="color: #2d3142;">תוצאות שאלון</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #e8e4de;">
          ${qaRows || '<tr><td style="padding: 12px; color: #999; font-size: 13px;">לא מולא שאלון</td></tr>'}
        </table>

        <h2 style="color: #2d3142;">סיכום שיחת AI</h2>
        <div style="background: #1e1e2e; color: #cdd6f4; padding: 20px; border-radius: 12px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.8; direction: rtl; text-align: right; overflow-x: auto;">
${chatLines}
        </div>

        ${filesSection}
      </div>
      
      <div style="background: #f0ede8; padding: 16px 30px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #e8e4de; border-top: none;">
        <p style="color: #888; margin: 0; font-size: 12px;">נשלח אוטומטית מ-WEB13 Onboarding System</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"WEB13" <${SENDER_EMAIL}>`,
    to: RECIPIENT_EMAIL,
    subject: `ליד חדש מהאתר - ${data.clientName}`,
    html: htmlBody,
  });
}
