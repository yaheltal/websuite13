import express, { type Express } from "express";
import compression from "compression";
import fs from "fs";
import path from "path";

const ONE_YEAR = 365 * 24 * 60 * 60;

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(compression({ level: 6, threshold: 1024 }));

  app.use(
    "/assets",
    express.static(path.join(distPath, "assets"), {
      maxAge: ONE_YEAR * 1000,
      immutable: true,
      etag: false,
      lastModified: false,
    }),
  );

  app.use(
    express.static(distPath, {
      maxAge: "1h",
      etag: true,
      setHeaders(res, filePath) {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, must-revalidate");
        }
      },
    }),
  );

  app.use("/{*path}", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
