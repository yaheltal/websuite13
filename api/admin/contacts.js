import { getAdmin, setCorsHeaders } from "./_auth.js";
import { query } from "./_db.js";

export default async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const admin = getAdmin(req);
  if (!admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await query("SELECT * FROM contact_submissions ORDER BY created_at DESC");
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Failed to fetch contacts:", err.message);
    return res.status(500).json({ message: "Failed to fetch contacts" });
  }
}
