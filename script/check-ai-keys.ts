/**
 * בדיקת מפתחות AI (Gemini / OpenAI) — מריצים: npx tsx script/check-ai-keys.ts
 */
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env");
if (fs.existsSync(envPath)) dotenv.config({ path: envPath });

const geminiKey = (process.env.GEMINI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();
const openaiKey = (process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();

const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b"];

async function testGemini(): Promise<{ ok: boolean; reply?: string; error?: string; keyValid?: boolean }> {
  if (!geminiKey) return { ok: false, error: "GEMINI_API_KEY חסר" };
  let lastError = "";
  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(geminiKey)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "אמור רק: שלום" }] }],
        }),
      });
      if (res.status === 400 && /invalid|API key not valid/i.test(await res.text())) {
        return { ok: false, error: "מפתח לא תקף", keyValid: false };
      }
      if (res.status === 404) {
        lastError = `מודל ${model} לא זמין`;
        continue;
      }
      if (!res.ok) {
        lastError = `HTTP ${res.status}: ${(await res.text()).slice(0, 120)}`;
        continue;
      }
      const data = (await res.json()) as any;
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return { ok: true, reply: text || "(ללא טקסט)" };
    } catch (e: any) {
      lastError = e?.message || String(e);
    }
  }
  return { ok: false, error: lastError, keyValid: true };
}

async function testOpenAI(): Promise<{ ok: boolean; reply?: string; error?: string; keyValid?: boolean }> {
  if (!openaiKey) return { ok: false, error: "OPENAI_API_KEY חסר" };
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Say only: hello" }],
        max_tokens: 50,
      }),
    });
    const text = await res.text();
    if (res.status === 401 && /incorrect API key|invalid/i.test(text)) {
      return { ok: false, error: "מפתח לא תקף", keyValid: false };
    }
    if (res.status === 429) {
      return { ok: false, error: "מכסה חודשית אזלה (billing)", keyValid: true };
    }
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 120)}` };
    }
    const data = JSON.parse(text) as any;
    const replyText = data?.choices?.[0]?.message?.content?.trim();
    return { ok: true, reply: replyText || "(ללא טקסט)" };
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
}

async function main() {
  console.log("בודק מפתחות AI...\n");
  console.log("GEMINI_API_KEY:", geminiKey ? `${geminiKey.slice(0, 12)}... (${geminiKey.length} תווים)` : "חסר");
  console.log("OPENAI_API_KEY:", openaiKey ? `${openaiKey.slice(0, 12)}... (${openaiKey.length} תווים)` : "חסר");
  console.log("");

  const geminiResult = await testGemini();
  if (geminiResult.ok) {
    console.log("✓ המפתחות נקלטו. Gemini עובד. תשובה:", geminiResult.reply);
    process.exit(0);
  }
  if (geminiResult.keyValid) {
    console.log("✓ GEMINI_API_KEY התקבל ונקלט (מפתח תקף).", "אבל:", geminiResult.error);
  } else {
    console.log("✗ Gemini:", geminiResult.error);
  }

  const openaiResult = await testOpenAI();
  if (openaiResult.ok) {
    console.log("✓ המפתחות נקלטו. OpenAI עובד (גיבוי). תשובה:", openaiResult.reply);
    process.exit(0);
  }
  if (openaiResult.keyValid) {
    console.log("✓ OPENAI_API_KEY התקבל ונקלט (מפתח תקף).", "אבל:", openaiResult.error);
  } else {
    console.log("✗ OpenAI:", openaiResult.error);
  }

  const bothLoaded = geminiResult.keyValid || openaiResult.keyValid;
  if (bothLoaded) {
    console.log("\nסיכום: המפתחות AI התקבלו ונקלטו. כרגע אין תשובה פעילה (מודל/מכסה).");
  } else {
    console.log("\nסיכום: בדוק .env (GEMINI_API_KEY / OPENAI_API_KEY).");
  }
  process.exit(bothLoaded ? 0 : 1);
}

main();
