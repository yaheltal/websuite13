/**
 * POST /api/onboarding/upload — העלאת קבצים באונבורדינג.
 * ב-Vercel: מפרסר multipart ומחזיר שמות קבצים (ללא אחסון; הלקוח שומר ברשימה ושולח ב-complete).
 * בשרת Express: הקבצים נשמרים ב-uploads/ ומקושרים ל-onboarding (ראו server/routes.ts).
 */
import Busboy from "busboy";

const ALLOWED_EXT = /\.(jpg|jpeg|png|gif|svg|pdf|ai|psd|webp)$/i;
const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB (Vercel body limit 4.5MB — may hit on large uploads)

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const fields = {};
    const files = [];
    const busboy = Busboy({ headers: req.headers });

    busboy.on("field", (name, value) => {
      fields[name] = value;
    });

    busboy.on("file", (name, stream, info) => {
      const filename = info.filename || "file";
      const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
      if (!ALLOWED_EXT.test(ext)) {
        stream.resume();
        return;
      }
      let size = 0;
      stream.on("data", (chunk) => {
        size += chunk.length;
        if (size > MAX_FILE_SIZE) stream.destroy();
      });
      stream.on("end", () => {
        if (size <= MAX_FILE_SIZE && files.length < MAX_FILES) {
          files.push(filename);
        }
      });
      stream.resume();
    });

    busboy.on("finish", () => resolve({ fields, files }));
    busboy.on("error", reject);
    req.pipe(busboy);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseMultipart(req);
    const onboardingId = fields.onboardingId;

    if (!onboardingId) {
      return res.status(400).json({ message: "Onboarding ID required" });
    }
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded or file type not allowed" });
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ files });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "שגיאה בהעלאת קבצים" });
  }
}
