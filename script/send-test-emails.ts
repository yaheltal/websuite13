/**
 * שולח 3 מיילי ניסיון: צור קשר → התחלת שאלון → סיום שאלון.
 * הרצה: npx tsx script/send-test-emails.ts
 */
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { sendContactEmail, sendLeadNotifyEmail, sendOnboardingEmail } from "../server/email";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env");
if (fs.existsSync(envPath)) dotenv.config({ path: envPath });

const TEST = {
  name: "משתמש ניסיון",
  email: "test@example.com",
  phone: "050-1234567",
  service: "landing-page",
  message: "זו הודעת ניסיון מטופס צור קשר — לבדיקת מערכת המיילים.",
};

async function main() {
  const pass = (process.env.GMAIL_APP_PASSWORD ?? "").trim();
  if (!pass) {
    console.error("GMAIL_APP_PASSWORD חסר ב-.env. לא ניתן לשלוח מיילים.");
    process.exit(1);
  }

  console.log("שולח 3 מיילי ניסיון ל:", process.env.RECIPIENT_EMAIL || "WEBSUITE153@GMAIL.COM");
  console.log("");

  // 1. צור קשר
  console.log("1. מייל מטופס צור קשר...");
  const r1 = await sendContactEmail({
    name: TEST.name,
    email: TEST.email,
    phone: TEST.phone,
    service: TEST.service,
    message: TEST.message,
  });
  console.log(r1.success ? "   נשלח בהצלחה." : "   נכשל.");
  console.log("");

  // 2. התחלת תהליך מילוי (lead-notify)
  console.log("2. מייל התחלת שאלון...");
  const r2 = await sendLeadNotifyEmail({
    name: TEST.name,
    email: TEST.email,
    phone: TEST.phone,
    service: TEST.service,
  });
  console.log(r2.success ? "   נשלח בהצלחה." : "   נכשל.");
  console.log("");

  // 3. סיום מילוי (onboarding complete)
  console.log("3. מייל סיום שאלון...");
  const r3 = await sendOnboardingEmail({
    clientName: TEST.name,
    clientEmail: TEST.email,
    clientPhone: TEST.phone,
    service: TEST.service,
    questionnaireData: {
      businessName: "חברת ניסיון",
      businessField: "טכנולוגיה",
      targetAudience: "עסקים קטנים",
      mainGoal: "בדיקת מערכת מיילים",
    },
    chatSummary: "סוכן: מה המטרה של האתר?\nלקוח: בדיקת מיילים.\nסוכן: מעולה, קיבלנו את הפרטים.",
    aiSummary: "סיכום ניסיון: ליד לבדיקת מערכת המיילים — דף נחיתה.",
    uploadedFiles: [],
  });
  console.log(r3.success ? "   נשלח בהצלחה." : "   נכשל.");
  console.log("");

  const ok = r1.success && r2.success && r3.success;
  console.log(ok ? "כל 3 המיילים נשלחו." : "חלק מהמיילים נכשלו.");
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
