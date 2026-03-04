import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// טעינת .env — משני מיקומים; אחרון מנצח
const envRoot = path.resolve(__dirname, "..", ".env");
const envCwd = path.resolve(process.cwd(), ".env");
[envCwd, envRoot].forEach((envPath) => {
  if (fs.existsSync(envPath)) dotenv.config({ path: envPath, override: true });
});
// Fallback: קורא .env שורה-שורה (פותר BOM, encoding, רווחים)
function loadGeminiKeyFromFile(filePath: string): boolean {
  try {
    let raw = fs.readFileSync(filePath, "utf8");
    raw = raw.replace(/^\uFEFF/, ""); // BOM
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      if (key !== "GEMINI_API_KEY") continue;
      let val = trimmed.slice(eq + 1).trim();
      const hash = val.indexOf("#");
      if (hash !== -1) val = val.slice(0, hash).trim();
      val = val.replace(/^["']|["']$/g, "").trim();
      if (val.length > 10) {
        process.env.GEMINI_API_KEY = val;
        return true;
      }
    }
  } catch {
    /* ignore */
  }
  return false;
}
if (!process.env.GEMINI_API_KEY?.trim()) {
  loadGeminiKeyFromFile(envCwd) || loadGeminiKeyFromFile(envRoot);
}
// גיבוי: גוגל תומכת גם ב-GOOGLE_API_KEY
if (!process.env.GEMINI_API_KEY?.trim() && process.env.GOOGLE_API_KEY?.trim()) {
  process.env.GEMINI_API_KEY = process.env.GOOGLE_API_KEY.replace(/^["']|["']$/g, "").trim();
}
// טעינת OPENAI_API_KEY מקובץ אם חסר (גיבוי ל־dotenv)
function loadEnvKeyFromFile(filePath: string, keyName: string): boolean {
  try {
    let raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1 || trimmed.slice(0, eq).trim() !== keyName) continue;
      let val = trimmed.slice(eq + 1).trim();
      const hash = val.indexOf("#");
      if (hash !== -1) val = val.slice(0, hash).trim();
      val = val.replace(/^["']|["']$/g, "").trim();
      if (val.length > 10) {
        (process.env as any)[keyName] = val;
        return true;
      }
    }
  } catch {
    /* ignore */
  }
  return false;
}
// תמיד לנסות לטעון OPENAI_API_KEY מקובץ — קודם לפי מיקום הפרויקט (envRoot) כדי שלא תלוי ב-cwd
loadEnvKeyFromFile(envRoot, "OPENAI_API_KEY") || loadEnvKeyFromFile(envCwd, "OPENAI_API_KEY");
// גיבוי סופי: קריאה ישירה מקובץ .env ליד server/ (מבטיח שהמפתח נטען)
if (!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 20)) {
  for (const p of [envRoot, envCwd]) {
    if (!fs.existsSync(p)) continue;
    try {
      const raw = fs.readFileSync(p, "utf8").replace(/^\uFEFF/, "");
      const match = raw.match(/^\s*OPENAI_API_KEY\s*=\s*([^\r\n]+)/m);
      if (match) {
        const v = match[1].replace(/#.*$/g, "").trim().replace(/^["']|["']$/g, "");
        if (v.length > 20) {
          process.env.OPENAI_API_KEY = v;
          break;
        }
      }
    } catch {
      /* ignore */
    }
  }
}

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: "50mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Allow frontend (e.g. Vercel) to call this API when deployed separately. Set CORS_ORIGIN to https://websuite13.com (or comma-separated list).
const corsOrigin = process.env.CORS_ORIGIN?.trim();
if (corsOrigin) {
  const allowed = corsOrigin.split(",").map((o) => o.trim()).filter(Boolean);
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowed.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      // אל תדפיס גוף תשובה בשגיאות — כדי שלא יופיעו הודעות טכניות (למשל מ־chat) בטרמינל
      if (capturedJsonResponse && res.statusCode < 400) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  const { setupAuth } = await import("./auth");
  await setupAuth(app);

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  const listenOpts =
    process.platform === "win32"
      ? { port }
      : { port, host: "0.0.0.0", reusePort: true };
  httpServer.listen(listenOpts, async () => {
    log(`serving on port ${port}`);
    const geminiKey = (process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
    const openaiKey = (process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
    if (geminiKey) log(`GEMINI_API_KEY: loaded (${geminiKey.length} chars) — AI chat (Gemini)`);
    if (openaiKey) log(`OPENAI_API_KEY: loaded — AI chat (OpenAI fallback)`);
    if (!geminiKey && !openaiKey) log("AI chat: add GEMINI_API_KEY or OPENAI_API_KEY to .env and restart");
    const { verifyEmailConfig } = await import("./email");
    await verifyEmailConfig();
  });
})();
