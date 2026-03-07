import { setCorsHeaders, clearTokenCookie } from "./_auth.js";

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  res.setHeader("Set-Cookie", clearTokenCookie());
  return res.status(200).json({ ok: true });
}
