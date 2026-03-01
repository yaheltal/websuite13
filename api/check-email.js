/** GET /api/check-email – בודק אם GMAIL_APP_PASSWORD מוגדר (בלי לחשוף ערך) */
export default function handler(_req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const configured = Boolean(process.env.GMAIL_APP_PASSWORD?.trim());
  return res.status(200).json({
    configured,
    hint: configured
      ? "GMAIL_APP_PASSWORD is set"
      : "Add GMAIL_APP_PASSWORD in Vercel → Settings → Environment Variables",
  });
}
