import crypto from "crypto";

const ADMIN_USER = "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim() || "1503";
const TOKEN_SECRET = process.env.SESSION_SECRET?.trim() || "websuite-dev-secret-change-in-production";
const TOKEN_MAX_AGE = 24 * 60 * 60; // 24 hours in seconds

/**
 * Create a signed token (HMAC-based, no external deps).
 * Format: base64(payload).base64(signature)
 */
export function createToken(payload) {
  const data = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + TOKEN_MAX_AGE })).toString("base64url");
  const sig = crypto.createHmac("sha256", TOKEN_SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

/**
 * Verify and decode a token. Returns payload or null.
 */
export function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = crypto.createHmac("sha256", TOKEN_SECRET).update(data).digest("base64url");
  if (sig !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Validate admin credentials. Returns { id, username } or null.
 */
export function validateCredentials(username, password) {
  if (username !== ADMIN_USER) return null;
  if (password !== ADMIN_PASSWORD) return null;
  return { id: 1, username: ADMIN_USER };
}

/**
 * Extract token from cookie or Authorization header.
 */
export function getTokenFromRequest(req) {
  // Check cookie
  const cookies = req.headers.cookie || "";
  const match = cookies.match(/(?:^|;\s*)admin_token=([^;]+)/);
  if (match) return match[1];
  // Check Authorization header
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

/**
 * Get authenticated admin from request, or null.
 */
export function getAdmin(req) {
  const token = getTokenFromRequest(req);
  return verifyToken(token);
}

/**
 * Set CORS headers for admin endpoints.
 */
export function setCorsHeaders(res) {
  const origin = process.env.CORS_ORIGIN?.trim() || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
}

/**
 * Cookie string for setting the admin token.
 */
export function tokenCookie(token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `admin_token=${token}; HttpOnly; Path=/; Max-Age=${TOKEN_MAX_AGE}; SameSite=Lax${secure}`;
}

/**
 * Cookie string for clearing the admin token.
 */
export function clearTokenCookie() {
  return "admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax";
}
