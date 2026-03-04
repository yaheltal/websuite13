/**
 * POST /api/onboarding/upload — העלאת קבצים באונבורדינג.
 * ב-Vercel: מפרסר multipart ומחזיר שמות קבצים (ללא אחסון; הלקוח שומר ברשימה ושולח ב-complete).
 * בשרת Express: הקבצים נשמרים ב-uploads/ (server/routes.ts).
 */
const ALLOWED_EXT = /\.(jpg|jpeg|png|gif|svg|pdf|ai|psd|webp)$/i;
const MAX_FILES = 10;

/** Get raw body as Buffer — works when Vercel hasn't consumed the stream. */
function getRawBody(req) {
  if (Buffer.isBuffer(req.body) && req.body.length > 0) return Promise.resolve(req.body);
  if (typeof req.arrayBuffer === "function") {
    return req.arrayBuffer().then((ab) => Buffer.from(ab));
  }
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function parseMultipartFromBuffer(buf, headers) {
  const fields = {};
  const files = [];
  let busboy;
  try {
    busboy = require("busboy");
  } catch {
    return Promise.resolve({ fields: {}, files: [] });
  }
  const { Readable } = require("stream");
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: headers || {} });
    bb.on("field", (name, value) => {
      fields[name] = value;
    });
    bb.on("file", (name, fileStream, info) => {
      const filename = (info && info.filename) || "file";
      const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
      if (ALLOWED_EXT.test(ext) && files.length < MAX_FILES) {
        files.push(`${Date.now()}-${Math.random().toString(36).slice(2)}-${filename}`);
      }
      fileStream.resume();
    });
    bb.on("finish", () => resolve({ fields, files }));
    bb.on("error", reject);
    Readable.from(buf).pipe(bb);
  });
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const contentType = (req.headers && req.headers["content-type"]) || "";
  if (!contentType.includes("multipart/form-data")) {
    return res.status(400).json({ message: "נא לשלוח כטופס multipart (העלאת קבצים)." });
  }

  try {
    const buf = await getRawBody(req);
    if (!buf || buf.length === 0) {
      return res.status(400).json({ message: "גוף הבקשה ריק. נא לבחור קבצים ולשלוח שוב." });
    }
    const { fields, files } = await parseMultipartFromBuffer(buf, req.headers);
    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "לא זוהו קבצים מתאימים. השתמש ב-JPG, PNG, GIF, SVG, PDF, AI, PSD או WEBP (עד 10 קבצים).",
      });
    }
    return res.status(200).json({ files });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      message: "שגיאה בהעלאת קבצים. נסה קבצים קטנים יותר או שוב מאוחר יותר.",
      error: err.message,
    });
  }
}
