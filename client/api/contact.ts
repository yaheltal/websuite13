import nodemailer from "nodemailer";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  email: z.string().email("אנא הזן כתובת אימייל תקינה"),
  phone: z.string().optional().default(""),
  service: z.string().min(1, "אנא בחר שירות"),
  message: z.string().min(10, "ההודעה חייבת להכיל לפחות 10 תווים"),
}).refine(
  (d) => !d.phone || d.phone.replace(/\D/g, "").length >= 9,
  { message: "אנא הזן מספר טלפון תקין (9 ספרות לפחות)", path: ["phone"] }
);

const TO = "WEBSUITE153@GMAIL.COM";
const FROM = "WEBSUITE153@GMAIL.COM";
const SERVICE_NAMES: Record<string, string> = {
  "landing-page": "דף נחיתה",
  "business-card": "כרטיס ביקור דיגיטלי",
  "ecommerce": "חנות אונליין",
  "other": "אחר",
};

function escapeHtml(str: string) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function parseBody(body: unknown): unknown {
  if (body == null) return {};
  if (typeof body === "object") return body;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return {};
}

type Req = { method?: string; body?: unknown };
type Res = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => { json: (body: unknown) => void };
};

export default async function handler(req: Req, res: Res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const raw = parseBody(req.body);
    const data = contactSchema.parse(raw);
    const serviceName = SERVICE_NAMES[data.service] || data.service || "לא צוין";

    const html = `
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
    ${data.message ? `<h2 style="color: #2d3142;">הודעת הלקוח</h2><div style="background: white; border: 1px solid #e8e4de; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.8; color: #333;">${escapeHtml(data.message).replace(/\n/g, "<br>")}</div>` : ""}
  </div>
  <div style="background: #f0ede8; padding: 16px 30px; border-radius: 0 0 16px 16px; text-align: center; border: 1px solid #e8e4de; border-top: none;">
    <p style="color: #888; margin: 0; font-size: 12px;">נשלח אוטומטית מ-WEB13 — טופס צור קשר</p>
  </div>
</div>`;

    const pass = process.env.GMAIL_APP_PASSWORD?.trim() || "";
    let emailSent = false;
    if (pass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: FROM, pass },
        });
        await transporter.sendMail({
          from: `"WEB13" <${FROM}>`,
          to: TO,
          subject: `[URGENT] New WebSuite Lead - ${data.name}`,
          html,
        });
        emailSent = true;
      } catch (err) {
        console.error("Contact email failed:", err);
      }
    }

    return res.status(201).json({
      emailSent,
      fallback: !emailSent,
      ...(emailSent ? {} : { hint: "המייל לא נשלח. ב־Vercel: Settings → Environment Variables → GMAIL_APP_PASSWORD (סיסמת אפליקציה של Gmail)." }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.errors.map((e) => e.message).join("; ");
      return res.status(400).json({ message: msg });
    }
    console.error("Contact API error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
