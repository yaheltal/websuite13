import { validateCredentials, createToken, setCorsHeaders, tokenCookie } from "./_auth.js";

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const admin = validateCredentials(username, password);
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = createToken({ id: admin.id, username: admin.username });
  res.setHeader("Set-Cookie", tokenCookie(token));
  return res.status(200).json({ user: { id: admin.id, username: admin.username } });
}
