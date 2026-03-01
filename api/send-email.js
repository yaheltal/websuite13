import nodemailer from "nodemailer";

const TO = (process.env.RECIPIENT_EMAIL || "WEBSUITE153@GMAIL.COM").trim();
const FROM = (process.env.SENDER_EMAIL || process.env.GMAIL_USER || TO).trim();

function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      error: "נדרשים: name, email, message",
    });
  }

  const pass = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS || "";
  if (!pass.trim()) {
    return res.status(500).json({
      error: "שליחת מייל לא מוגדרת. הגדר GMAIL_APP_PASSWORD ב־Vercel.",
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || FROM,
      pass: pass.trim(),
    },
  });

  try {
    await transporter.sendMail({
      from: `"WEB13" <${process.env.EMAIL_USER || FROM}>`,
      to: TO,
      subject: `הודעה חדשה מהאתר - ${name}`,
      text: message,
      html: `<p>קיבלת הודעה חדשה מ: <b>${escapeHtml(name)}</b></p>
             <p>מייל לחזרה: ${escapeHtml(email)}</p>
             <p>תוכן ההודעה:</p>
             <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: error.message || "שליחת המייל נכשלה" });
  }
}
