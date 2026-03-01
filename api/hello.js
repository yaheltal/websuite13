/** GET /api/hello – לבדיקה ש־API חי ב־Vercel */
export default function handler(_req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).json({ ok: true, message: "API works" });
}
