/**
 * POST /api/onboarding/complete — סיום תהליך אונבורדינג.
 * ב-Vercel אין DB, אז רק מאמתים שיש onboardingId ומחזירים success.
 * הנתונים והמייל נשלחו כבר ב־/api/onboarding/start (ותשובת הצ'אט ב־chat).
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { onboardingId } = req.body || {};

    if (onboardingId == null || onboardingId === "") {
      return res.status(400).json({ message: "Onboarding ID required" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Complete error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
