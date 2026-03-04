/**
 * POST /api/onboarding/upload — העלאת קבצים באונבורדינג.
 * ב-Vercel: מפרסר multipart ומחזיר שמות קבצים (ללא אחסון; הלקוח שומר ברשימה ושולח ב-complete).
 * בשרת Express: הקבצים נשמרים ב-uploads/ (server/routes.ts).
 */

export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_EXT = /\.(jpg|jpeg|png|gif|svg|pdf|ai|psd|webp)$/i;
const ALLOWED_MIME = /^(image\/(jpeg|png|gif|svg\+xml|webp)|application\/(pdf|postscript|x-photoshop|octet-stream))$/i;
const MAX_FILES = 10;

function getRawBody(req) {
  if (Buffer.isBuffer(req.body) && req.body.length > 0) return Promise.resolve(req.body);
  if (typeof req.body === "string" && req.body.length > 0) return Promise.resolve(Buffer.from(req.body, "binary"));
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      chunks.push(c);
      size += c.length;
      if (size > 50 * 1024 * 1024) reject(new Error("Body too large"));
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

function parseMultipart(buf, contentType) {
  const files = [];
  const boundary = extractBoundary(contentType);
  if (!boundary) return { files: [] };

  const boundaryBuf = Buffer.from(`--${boundary}`);
  const parts = splitBuffer(buf, boundaryBuf);

  for (const part of parts) {
    const headerEnd = findDoubleCRLF(part);
    if (headerEnd === -1) continue;

    const headerStr = part.slice(0, headerEnd).toString("utf-8");
    const filenameMatch = headerStr.match(/filename="([^"]+)"/i) || headerStr.match(/filename=([^\s;]+)/i);
    if (!filenameMatch) continue;

    const filename = filenameMatch[1].trim();
    if (!filename) continue;

    const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
    if (ALLOWED_EXT.test(ext) && files.length < MAX_FILES) {
      files.push(`${Date.now()}-${Math.random().toString(36).slice(2)}-${filename}`);
    }
  }

  return { files };
}

function extractBoundary(contentType) {
  if (!contentType) return null;
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^\s;]+))/i);
  return match ? (match[1] || match[2]) : null;
}

function splitBuffer(buf, delimiter) {
  const parts = [];
  let start = 0;
  while (start < buf.length) {
    const idx = buf.indexOf(delimiter, start);
    if (idx === -1) {
      if (start < buf.length) parts.push(buf.slice(start));
      break;
    }
    if (idx > start) parts.push(buf.slice(start, idx));
    start = idx + delimiter.length;
    if (buf[start] === 0x0d) start++;
    if (buf[start] === 0x0a) start++;
  }
  return parts;
}

function findDoubleCRLF(buf) {
  for (let i = 0; i < buf.length - 3; i++) {
    if (buf[i] === 0x0d && buf[i + 1] === 0x0a && buf[i + 2] === 0x0d && buf[i + 3] === 0x0a) return i;
  }
  return -1;
}

function parseBusboy(buf, headers) {
  let busboy;
  try {
    busboy = require("busboy");
  } catch {
    return null;
  }
  const { Readable } = require("stream");
  const files = [];
  return new Promise((resolve) => {
    const bb = busboy({ headers, limits: { files: MAX_FILES } });
    bb.on("file", (_name, fileStream, info) => {
      const filename = (info && info.filename) || "file";
      const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
      if (ALLOWED_EXT.test(ext) && files.length < MAX_FILES) {
        files.push(`${Date.now()}-${Math.random().toString(36).slice(2)}-${filename}`);
      }
      fileStream.resume();
    });
    bb.on("finish", () => resolve({ files }));
    bb.on("error", () => resolve(null));
    setTimeout(() => resolve(files.length > 0 ? { files } : null), 10000);
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

    let result = await parseBusboy(buf, req.headers);

    if (!result || !result.files || result.files.length === 0) {
      result = parseMultipart(buf, contentType);
    }

    if (!result || !result.files || result.files.length === 0) {
      console.error("Upload: no files parsed. Buffer size:", buf.length, "Content-Type:", contentType);
      return res.status(400).json({
        message: "לא זוהו קבצים מתאימים. השתמש ב-JPG, PNG, GIF, SVG, PDF, AI, PSD או WEBP (עד 10 קבצים).",
      });
    }

    return res.status(200).json({ files: result.files });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      message: "שגיאה בהעלאת קבצים. נסה קבצים קטנים יותר או שוב מאוחר יותר.",
      error: err.message,
    });
  }
}
