/**
 * POST /api/onboarding/upload — העלאת קבצים באונבורדינג.
 * ב-Vercel: מפרסר multipart ומחזיר שמות קבצים (ללא אחסון; הלקוח שומר ברשימה ושולח ב-complete).
 * בשרת Express: הקבצים נשמרים ב-uploads/ (server/routes.ts).
 */
const ALLOWED_EXT = /\.(jpg|jpeg|png|gif|svg|pdf|ai|psd|webp)$/i;
const MAX_FILES = 10;

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function parseMultipart(req) {
  const fields = {};
  const files = [];
  let busboy;
  try {
    busboy = require("busboy");
  } catch {
    return Promise.resolve({ fields: {}, files: [] });
  }

  return new Promise((resolve, reject) => {
    function runBusboy(stream) {
      const bb = busboy({ headers: req.headers || {} });
      bb.on("field", (name, value) => { fields[name] = value; });
      bb.on("file", (name, stream, info) => {
        const filename = (info && info.filename) || "file";
        const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
        if (ALLOWED_EXT.test(ext) && files.length < MAX_FILES) {
          files.push(`${Date.now()}-${Math.random().toString(36).slice(2)}-${filename}`);
        }
        stream.resume();
      });
      bb.on("finish", () => resolve({ fields, files }));
      bb.on("error", reject);
      stream.pipe(bb);
    }

    if (typeof req.pipe === "function") {
      runBusboy(req);
    } else {
      readRawBody(req)
        .then((buf) => {
          if (!buf || buf.length === 0) return resolve({ fields: {}, files: [] });
          const { Readable } = require("stream");
          runBusboy(Readable.from(buf));
        })
        .catch(reject);
    }
  });
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseMultipart(req);
    const onboardingId = fields && fields.onboardingId;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded or file type not allowed" });
    }

    return res.status(200).json({ files });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "שגיאה בהעלאת קבצים", error: err.message });
  }
}
