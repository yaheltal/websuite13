/**
 * Diagnostic endpoint – GET /api/onboarding/chat-test
 * Reports which AI keys are configured and attempts test calls.
 */
import OpenAI from "openai";

export default async function handler(req, res) {
  const geminiKey = ((process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY) ?? "").replace(/^["']|["']$/g, "").trim();
  const openaiKey = (process.env.OPENAI_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();

  const report = {
    geminiKeySet: geminiKey.length > 0,
    geminiKeyPreview: geminiKey ? geminiKey.slice(0, 6) + "..." : "(not set)",
    geminiTest: null,
    openaiKeySet: openaiKey.length > 0,
    openaiKeyPreview: openaiKey ? openaiKey.slice(0, 6) + "..." : "(not set)",
    openaiTest: null,
    nodeVersion: process.version,
  };

  // Test Gemini
  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Say OK" }] }] }),
      });
      clearTimeout(timeout);
      if (r.ok) {
        const data = await r.json();
        report.geminiTest = "OK – " + (data.candidates?.[0]?.content?.parts?.[0]?.text || "").slice(0, 60);
      } else {
        report.geminiTest = `FAIL ${r.status}: ${(await r.text()).slice(0, 200)}`;
      }
    } catch (e) {
      report.geminiTest = `ERROR: ${e.message}`;
    }
  } else {
    report.geminiTest = "SKIPPED – no key";
  }

  // Test OpenAI
  if (openaiKey) {
    try {
      const client = new OpenAI({ apiKey: openaiKey, timeout: 6000 });
      const r = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Say OK" }],
        max_tokens: 10,
      });
      const text = r.choices?.[0]?.message?.content?.trim();
      report.openaiTest = text ? "OK – " + text.slice(0, 60) : "FAIL – no content";
    } catch (e) {
      report.openaiTest = `FAIL: ${(e?.message || String(e)).slice(0, 200)}`;
    }
  } else {
    report.openaiTest = "SKIPPED – no key";
  }

  return res.status(200).json(report);
}
