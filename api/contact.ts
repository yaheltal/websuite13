import { z } from "zod";
import { sendContactEmail } from "../server/email";

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

type Req = { method?: string; body?: unknown };
type Res = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => { json: (body: unknown) => void };
};

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
    const emailResult = await sendContactEmail({
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      service: data.service || "",
      message: data.message || "",
    });
    return res.status(201).json({
      emailSent: emailResult.success,
      fallback: !emailResult.success,
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
