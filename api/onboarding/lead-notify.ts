type VercelRequest = { method?: string; body?: unknown };
type VercelResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => { json: (body: unknown) => void };
};
import { z } from "zod";
import { sendLeadNotifyEmail } from "../../server/email";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  service: z.string().optional().default(""),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const parsed = schema.parse(req.body);
    const result = await sendLeadNotifyEmail(parsed);
    if (result.success) {
      console.log(`Lead notify sent for: ${parsed.name}`);
    } else {
      console.error(`Lead notify failed for: ${parsed.name}`);
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Lead notify error:", error);
    return res.status(400).json({ message: "Invalid data" });
  }
}
