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
    const geminiKey = (process.env.GEMINI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
    if (geminiKey) {
      log(`GEMINI_API_KEY: loaded (${geminiKey.length} chars) — AI chat enabled`);
    } else {
      log("GEMINI_API_KEY: missing — add GEMINI_API_KEY to .env in project root and restart");
    }
    const { verifyEmailConfig } = await import("./email");
    await verifyEmailConfig();
  });
})();
