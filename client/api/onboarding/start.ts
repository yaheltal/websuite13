type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => { json: (body: unknown) => void };
};
import { z } from "zod";
import { sendOnboardingEmail } from "../../server/email";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const validationSchema = z.object({
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  email: z.string().email("אנא הזן כתובת אימייל תקינה"),
  phone: z.string().nullable().optional(),
  service: z.enum(["landing-page", "digital-card", "ecommerce"]),
  questionnaireData: z.record(z.any()),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const parsed = validationSchema.parse(req.body);
    const id = Math.abs(Date.now() % 1e6) + 1;

    await sendOnboardingEmail({
      clientName: parsed.name,
      clientEmail: parsed.email,
      clientPhone: parsed.phone || "",
      service: parsed.service,
      questionnaireData: parsed.questionnaireData || {},
      chatSummary: "",
      uploadedFiles: [],
    });

    return res.status(201).json({ id });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error("Onboarding start error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
