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

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

  const { name, email, phone, service } = req.body || {};

  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const serviceName = SERVICE_NAMES[service] || service || "לא צוין";

  const html = `
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
      <tr><td style="padding: 8px 0; color: #666; width: 120px;">שם:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">אימייל:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #3b6de0;">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #666;">טלפון:</td><td style="padding: 8px 0;"><a href="tel:${escapeHtml(phone || "")}" style="color: #3b6de0; font-weight: bold;">${escapeHtml(phone || "לא צוין")}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #666;">שירות מבוקש:</td><td style="padding: 8px 0; font-weight: bold; color: #3b6de0;">${escapeHtml(serviceName)}</td></tr>
    </table>
    <div style="background: #e8f0fe; border: 1px solid #a4c2f4; border-radius: 8px; padding: 12px; font-size: 13px; color: #1a4fa0;">
      הודעה מקדימה - אם הלקוח ימשיך את התהליך, תקבל הודעה מלאה נוספת עם כל הפרטים.
    </div>
  </div>
  <div style="background: #f0ede8; padding: 16px 30px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #e8e4de; border-top: none;">
    <p style="color: #888; margin: 0; font-size: 12px;">נשלח אוטומטית מ-WEB13 — התראת ליד מוקדמת</p>
  </div>
</div>`;

  const pass = process.env.GMAIL_APP_PASSWORD || "";
  if (!pass.trim()) {
    return res.status(200).json({ success: false, hint: "GMAIL_APP_PASSWORD not configured" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: FROM, pass: pass.trim() },
    });

    await transporter.sendMail({
      from: `"WEB13" <${FROM}>`,
      to: TO,
      subject: `[LEAD] התחיל שאלון - ${name} | ${phone || ""}`,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Lead notify email error:", error);
    return res.status(200).json({ success: false });
  }
}
