/**
 * בודק אם מפתח Gemini עובד — קורא ישירות ל-API של גוגל (בלי השרת שלנו).
 * הרצה: node script/test-gemini-key.mjs
 *    או: node script/test-gemini-key.mjs YOUR_API_KEY
 * קורא .env מהשורש אם לא העברת מפתח.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadKey() {
  const fromArg = process.argv[2];
  if (fromArg && fromArg.length > 30) return fromArg.trim();
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return null;
  let raw = fs.readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    if (t.slice(0, eq).trim() !== "GEMINI_API_KEY") continue;
    let v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    const i = v.indexOf("#");
    if (i !== -1) v = v.slice(0, i).trim();
    return v;
  }
  return null;
}

const apiKey = loadKey();
if (!apiKey) {
  console.log("לא נמצא GEMINI_API_KEY. העבר כמשתנה: node script/test-gemini-key.mjs YOUR_KEY");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
const body = {
  contents: [{ role: "user", parts: [{ text: "Say only: hello" }] }],
};

console.log("שולח בקשת בדיקה ל-Gemini (gemini-1.5-flash)...");
try {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    console.log("שגיאה מהשרת:", res.status);
    console.log(text);
    if (text.includes("API key not valid")) {
      console.log("\n--- טיפים: ---");
      console.log("1. צור מפתח רק ב- https://aistudio.google.com/apikey (לא ב-Google Cloud Console)");
      console.log("2. בהגדרות המפתח: Application restrictions = None");
      console.log("3. אם את באיזור לא נתמך (חינם) — ב-AI Studio אפשר להפעיל Billing");
    }
    process.exit(1);
  }
  const data = JSON.parse(text);
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log("תשובה:", reply || "(ללא טקסט)");
  console.log("המפתח תקף.");
} catch (e) {
  console.error("שגיאה:", e.message);
  process.exit(1);
}
