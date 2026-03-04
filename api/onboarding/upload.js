/**
 * POST /api/onboarding/upload — העלאת קבצים באונבורדינג.
 * ב-Vercel: מפרסר multipart, מחזיר שמות קבצים + base64 כדי שהלקוח ישלח אותם ב-complete.
 * בשרת Express: הקבצים נשמרים ב-uploads/ (server/routes.ts).
 */

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

const ALLOWED_EXT = /\.(jpg|jpeg|png|gif|svg|pdf|ai|psd|webp)$/i;
const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function getRawBody(req) {
  if (Buffer.isBuffer(req.body) && req.body.length > 0) return Promise.resolve(req.body);
  if (typeof req.body === "string" && req.body.length > 0) return Promise.resolve(Buffer.from(req.body, "binary"));
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      chunks.push(c);
      size += c.length;
      if (size > 60 * 1024 * 1024) reject(new Error("Body too large"));
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
    const timer = setTimeout(() => {
      if (chunks.length > 0) resolve(Buffer.concat(chunks));
      else reject(new Error("Body read timeout"));
    }, 25000);
    req.on("end", () => clearTimeout(timer));
  });
}

function extractBoundary(contentType) {
  if (!contentType) return null;
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^\s;]+))/i);
  return match ? (match[1] || match[2]) : null;
}

function parseMultipartFiles(buf, contentType) {
  const boundary = extractBoundary(contentType);
  if (!boundary) return [];

  const boundaryStr = `--${boundary}`;
  const boundaryBuf = Buffer.from(boundaryStr);
  const results = [];

  let pos = 0;
  while (pos < buf.length && results.length < MAX_FILES) {
    const bStart = buf.indexOf(boundaryBuf, pos);
    if (bStart === -1) break;

    const afterBoundary = bStart + boundaryBuf.length;
    if (buf[afterBoundary] === 0x2d && buf[afterBoundary + 1] === 0x2d) break;

    let headerStart = afterBoundary;
    if (buf[headerStart] === 0x0d) headerStart++;
    if (buf[headerStart] === 0x0a) headerStart++;

    let headerEnd = -1;
    for (let i = headerStart; i < buf.length - 3; i++) {
      if (buf[i] === 0x0d && buf[i + 1] === 0x0a && buf[i + 2] === 0x0d && buf[i + 3] === 0x0a) {
        headerEnd = i;
        break;
      }
    }
    if (headerEnd === -1) { pos = afterBoundary + 1; continue; }

    const headerStr = buf.slice(headerStart, headerEnd).toString("utf-8");
    const bodyStart = headerEnd + 4;

    const nextBoundary = buf.indexOf(boundaryBuf, bodyStart);
    const bodyEnd = nextBoundary !== -1 ? nextBoundary - 2 : buf.length;

    const filenameMatch = headerStr.match(/filename="([^"]+)"/i) || headerStr.match(/filename=([^\s;]+)/i);
    if (!filenameMatch) { pos = bodyStart; continue; }

    const originalName = filenameMatch[1].trim();
    if (!originalName) { pos = bodyStart; continue; }

    const ext = originalName.includes(".") ? originalName.slice(originalName.lastIndexOf(".")) : "";
    if (!ALLOWED_EXT.test(ext)) { pos = bodyStart; continue; }

    const fileData = buf.slice(bodyStart, bodyEnd > bodyStart ? bodyEnd : bodyStart);
    if (fileData.length === 0 || fileData.length > MAX_FILE_SIZE) { pos = bodyStart; continue; }

    const mimeMatch = headerStr.match(/Content-Type:\s*([^\r\n;]+)/i);
    const mimeType = mimeMatch ? mimeMatch[1].trim() : "application/octet-stream";

    const generatedName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${originalName}`;

    results.push({
      name: generatedName,
      originalName,
      mimeType,
      base64: fileData.toString("base64"),
      size: fileData.length,
    });

    pos = nextBoundary !== -1 ? nextBoundary : buf.length;
  }

  return results;
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

    const parsedFiles = parseMultipartFiles(buf, contentType);

    if (parsedFiles.length === 0) {
      console.error("Upload: no files parsed. Buffer size:", buf.length, "Content-Type:", contentType);
      return res.status(400).json({
        message: "לא זוהו קבצים מתאימים. השתמש ב-JPG, PNG, GIF, SVG, PDF, AI, PSD או WEBP (עד 10 קבצים).",
      });
    }

    return res.status(200).json({
      files: parsedFiles.map((f) => f.name),
      fileData: parsedFiles.map((f) => ({
        name: f.name,
        originalName: f.originalName,
        mimeType: f.mimeType,
        base64: f.base64,
        size: f.size,
      })),
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      message: "שגיאה בהעלאת קבצים. נסה קבצים קטנים יותר או שוב מאוחר יותר.",
      error: err.message,
    });
  }
}
