# פריסת השרת (Backend) — כדי שהמיילים יעבדו באתר החי

**אפשרות 1 (מומלצת): רק Vercel — בלי שירותים חיצוניים**  
בפרויקט יש תיקיית `api/` עם פונקציות Serverless. כשעושים Deploy ל-Vercel, טופס צור קשר ושאלון פועלים **בלי** לחבר Railway או שרת חיצוני.  
**רק צריך** להגדיר ב-Vercel → Settings → Environment Variables:  
`GMAIL_APP_PASSWORD` = סיסמת האפליקציה של Gmail.  
**לא** להגדיר `VITE_API_URL` — תשאירי ריק כדי שהאתר יקרא ל־API באותו דומיין.

**שיחת AI (סוכן) ב־Vercel:**  
יש פונקציה `api/onboarding/chat.js` — הצ'אט עובד גם ב־Vercel בלי שרת חיצוני. **חובה** להגדיר ב־Vercel → Settings → Environment Variables:  
`GEMINI_API_KEY` = המפתח מ־[Google AI Studio](https://aistudio.google.com/apikey) (אותו ערך שיש ב־`.env` מקומית).  
אחרי הוספת המשתנה — לעשות **Redeploy** לפרויקט.

**למה הצ'אט לא עובד? (פתרון תקלות)**  
1. **"שירות ה-AI לא מוגדר" / "AI service not configured"**  
   - **ב־Vercel:** הוסף `GEMINI_API_KEY` ב־Settings → Environment Variables (Production + Preview), ואז Redeploy.  
   - **מקומי:** וודא שיש בקובץ `.env` שורה: `GEMINI_API_KEY=המפתח_שלך`, והשרת רץ עם `npm run dev` (כך ש־`.env` נטען).  
2. **תקלה כללית / אין תשובה**  
   - פתח DevTools (F12) → לשונית Network. שלח הודעה בצ'אט ובדוק את הקריאה ל־`/api/onboarding/chat`: מה קוד התשובה (200 / 500 / 404) ומה גוף התשובה.  
   - אם 404 — וודא ש־`api/onboarding/chat.js` קיים ושהיה Redeploy אחרי הוספתו.  
   - אם 500 — ב־Vercel: Deployments → הפונקציה → Logs, לראות את השגיאה.

---

## אבטחה והפרדה בין לקוחות ללידים

- **לידים** = פניות מטופס "צור קשר" + מילוי שאלון אונבורדינג. המידע נשמר במערכת ומייל עם הפרטים נשלח **רק אליך** (לכתובת שמוגדרת ב־`RECIPIENT_EMAIL`).
- **אין גישה ציבורית** לרשימת פניות או לידים — רק **אדמין** (דף ניהול עם התחברות) רואה את הרשימות דרך `/api/admin/contacts` ו־`/api/admin/onboardings`.
- **מה להגדיר ב־.env (או ב־Vercel/Railway):**
  - `RECIPIENT_EMAIL` — הכתובת שאליה יישלחו לידים (פניות + שאלונים). אם לא מוגדר — נעשה שימוש ב־WEBSUITE153@GMAIL.COM.
  - `SESSION_SECRET` — מחרוזת אקראית ארוכה (פרודקשן). חובה בשרת מלא כדי שההתחברות לאדמין תהיה מאובטחת.
- **ב־Vercel:** בפונקציות ה־api המיילים נשלחים לכתובת הקבועה בקוד (או ניתן להוסיף משתנה סביבה RECIPIENT_EMAIL שם אם תרצה).

---

## אפשרות 2: פריסת השרת ל-Railway (אם רוצים שרת מלא + DB)

1. היכנסי ל־**[railway.app](https://railway.app)** והתחברי עם GitHub.
2. **New Project** → **Deploy from GitHub repo** → בחרי את הריפו של הפרויקט.
3. Railway יזהה את הפרויקט. אם הוא מציע רק את ה־client, תצטרכי להגדיר:
   - **Root Directory:** השאר ריק (שורש הפרויקט).
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Watch Paths:** `server`, `dist`, `package.json`
4. **Variables** (משתני סביבה) — הוסיפי:
   - `NODE_ENV` = `production`
   - `GMAIL_APP_PASSWORD` = סיסמת האפליקציה של Gmail (16 תווים)
   - `CORS_ORIGIN` = `https://websuite13.com` (או הדומיין שלך, עם https)
   - `DATABASE_URL` = אם יש לך DB (אחרת השרת ישתמש בזיכרון)
5. **Deploy** — Railway יבנה ויריץ. בסיום תקבלי כתובת כמו:  
   `https://xxxxx.up.railway.app`

---

## שלב 2: חיבור הפרונט (Vercel) לשרת

1. ב־**Vercel** → הפרויקט → **Settings** → **Environment Variables**
2. הוסיפי:
   - **Name:** `VITE_API_URL`
   - **Value:** כתובת השרת (למשל `https://xxxxx.up.railway.app`) **בלי** סלאש בסוף
   - **Environment:** Production (ו־Preview אם רלוונטי)
3. **Redeploy** לפרויקט ב־Vercel (Deployments → ⋮ → Redeploy).

אחרי ה־Redeploy, האתר ב־websuite13.com ישלח את כל הקריאות ל־API לכתובת השרת ב־Railway, והמיילים יישלחו משם.

---

## אופציה: Render במקום Railway

1. **[render.com](https://render.com)** → Sign in with GitHub.
2. **New** → **Web Service** → חברי את הריפו.
3. **Build Command:** `npm run build`  
   **Start Command:** `npm start`
4. ב־**Environment** הוסיפי את אותם משתנים: `GMAIL_APP_PASSWORD`, `CORS_ORIGIN`, `DATABASE_URL` (אם צריך).
5. אחרי הפריסה — העתיקי את ה־URL של השירות והגדירי ב־Vercel כ־`VITE_API_URL` כמו למעלה.

---

## סיכום

| מקום        | משתנה              | ערך לדוגמה                          |
|------------|---------------------|--------------------------------------|
| Railway/Render | `GMAIL_APP_PASSWORD` | הסיסמה מ־Google App Passwords        |
| Railway/Render | `CORS_ORIGIN`        | `https://websuite13.com`             |
| Railway/Render | `RECIPIENT_EMAIL`   | המייל שלך לקבלת לידים (אופציונלי)   |
| Railway/Render | `SESSION_SECRET`    | מחרוזת אקראית ארוכה (פרודקשן)       |
| Vercel     | `VITE_API_URL`       | `https://xxxxx.up.railway.app`      |

אחרי ששני הצעדים מסומנים ✓ — המיילים אמורים להגיע כשמישהו ממלא טופס או שאלון באתר החי.
