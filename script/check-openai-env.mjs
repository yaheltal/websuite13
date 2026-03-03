/**
 * בודק אם OPENAI_API_KEY נטען מקובץ .env (כמו שהשרת עושה)
 * הרצה: node script/check-openai-env.mjs   (מהשורש)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const envCwd = path.resolve(process.cwd(), ".env");
const envRoot = path.resolve(root, ".env");

console.log("cwd:", process.cwd());
console.log(".env cwd exists:", fs.existsSync(envCwd));
console.log(".env root exists:", fs.existsSync(envRoot));

function loadKey(filePath, keyName) {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/);
  console.log("Total lines in .env:", lines.length);
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (key !== keyName) continue;
    let val = trimmed.slice(eq + 1).trim();
    const hash = val.indexOf("#");
    if (hash !== -1) val = val.slice(0, hash).trim();
    val = val.replace(/^["']|["']$/g, "").trim();
    console.log("Found line", i + 1, "key=" + JSON.stringify(key), "val.length=" + val.length);
    return val.length > 10 ? val : null;
  }
  return null;
}

const val = loadKey(envCwd, "OPENAI_API_KEY") || loadKey(envRoot, "OPENAI_API_KEY");
console.log("OPENAI_API_KEY:", val ? "found, " + val.length + " chars" : "NOT FOUND");
