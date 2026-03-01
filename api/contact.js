import nodemailer from "nodemailer";

const TO = "WEBSUITE153@GMAIL.COM";
const FROM = "WEBSUITE153@GMAIL.COM";

const SERVICE_NAMES = {
  "landing-page": "דף נחיתה",
  "business-card": "כרטיס ביקור דיגיטלי",
  "digital-card": "כרטיס ביקור דיגיטלי",
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
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, phone, service, message } = req.body || {};

  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ message: "שם ואימייל הם שדות חובה" });
  }
  if (!message?.trim() || message.trim().length < 10) {
    return res.status(400).json({ message: "ההודעה חייבת להכיל לפחות 10 תווים" });
  }

  const serviceName = SERVICE_NAMES[service] || service || "לא צוין";

  const html = `
<div dir="rtl" style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3b6de0, #5b3dbf); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">WEB13</h1>
    <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">ליד חדש מטופס צור קשר</p>
  </div>
  <div style="background: #faf8f5; padding: 30px; border: 1px solid #e8e4de; border-top: none;">
    <h2 style="color: #2d3142; margin-top: 0;">פרטי לקוח</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr><td style="padding: 8px 0; color: #666; width: 120px;">שם:</td><td style="padding: 8px 0; font-weight: bold;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">אימייל:</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #3b6de0;">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #666;">טלפון:</td><td style="padding: 8px 0;">${escapeHtml(phone || "לא צוין")}</td></tr>
      <tr><td style="padding: 8px 0; color: #666;">שירות מבוקש:</td><td style="padding: 8px 0; font-weight: bold; color: #3b6de0;">${escapeHtml(serviceName)}</td></tr>
    </table>
    ${message ? `<h2 style="color: #2d3142;">הודעת הלקוח</h2><div style="background: white; border: 1px solid #e8e4de; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.8; color: #333;">${escapeHtml(message).replace(/\n/g, "<br>")}</div>` : ""}
  </div>
  <div style="background: #f0ede8; padding: 16px 30px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #e8e4de; border-top: none;">
    <p style="color: #888; margin: 0; font-size: 12px;">נשלח אוטומטית מ-WEB13 — טופס צור קשר</p>
  </div>
</div>`;

  const pass = process.env.GMAIL_APP_PASSWORD || "";
  if (!pass.trim()) {
    return res.status(201).json({
      emailSent: false,
      fallback: true,
      hint: "GMAIL_APP_PASSWORD לא מוגדר ב-Vercel. Settings → Environment Variables.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: FROM, pass: pass.trim() },
    });

    await transporter.sendMail({
      from: `"WEB13" <${FROM}>`,
      to: TO,
      subject: `[URGENT] New WebSuite Lead - ${name}`,
      html,
    });

    return res.status(201).json({ emailSent: true, fallback: false });
  } catch (error) {
    console.error("Contact email error:", error);
    return res.status(201).json({
      emailSent: false,
      fallback: true,
      hint: "שליחת המייל נכשלה: " + (error.message || "שגיאה לא ידועה"),
    });
  }
}
