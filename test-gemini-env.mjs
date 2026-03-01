/**
 * הרצה: מהתיקייה הראשית של הפרויקט (איפה ש־package.json ו־.env)
 *   node test-gemini-env.mjs
 * בודק אם GEMINI_API_KEY נטען מהקובץ .env
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, ".env");
const cwd = path.resolve(process.cwd(), ".env");

console.log("cwd:", process.cwd());
console.log(".env at cwd exists:", fs.existsSync(cwd));
console.log(".env at root exists:", fs.existsSync(root));

function readKey(p) {
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, "utf8").replace(/^\uFEFF/, "");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const keyPart = t.slice(0, eq).trim();
    if (keyPart !== "GEMINI_API_KEY") continue;
    let v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    const i = v.indexOf("#");
    if (i !== -1) v = v.slice(0, i).trim();
    return v;
  }
  return null;
}

const key = readKey(cwd) || readKey(root);
if (key) {
  console.log("GEMINI_API_KEY: found, length =", key.length);
} else {
  console.log("GEMINI_API_KEY: NOT FOUND in .env");
}
