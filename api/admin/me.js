import { getAdmin, setCorsHeaders } from "./_auth.js";

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const admin = getAdmin(req);
  if (!admin) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  return res.status(200).json({ user: { id: admin.id, username: admin.username } });
}
