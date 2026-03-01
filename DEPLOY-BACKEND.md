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

**למה הסוכן AI לא עובד? — סיבות ותיקונים**  

| סיבה | איפה | מה לעשות |
|------|------|----------|
| **מפתח לא נטען** | מקומי | וודא ש־`.env` **בשורש הפרויקט** (ליד `package.json`), עם שורה `GEMINI_API_KEY=...` בלי רווחים/גרשיים. הפעל את השרת **מהשורש**: `npm run dev`. |
| **מפתח לא מוגדר** | Vercel | Vercel → הפרויקט → Settings → Environment Variables → הוסף `GEMINI_API_KEY` (Production + Preview) → **Redeploy**. |
| **404 על /api/onboarding/chat** | Vercel | וודא שקיים `api/onboarding/chat.js` ועשית Redeploy. |
| **500 / "תקלה זמנית"** | שני הצדדים | המפתח קיים אבל Gemini מחזיר שגיאה. בדוק: מפתח תקף ב־[Google AI Studio](https://aistudio.google.com/apikey), לא נחסם, מכסה לא נגמרה. ב־Vercel: Deployments → Logs. |
| **"API key not valid"** | מקומי / Vercel | המפתח נטען אבל גוגל דוחה. השתמשי **רק** במפתח מ־[Google AI Studio](https://aistudio.google.com/apikey) (Create API key). אם המפתח מ־Google Cloud Console — להפעיל "Generative Language API" בפרויקט. בלי רווחים/גרשיים בערך; אחרי שינוי — הפעלה מחדש מקומי + Redeploy ב־Vercel. |
| **החלפתי כמה מפתחות — כולם "לא תקף"** | — | (1) צרי מפתח **רק** ב־[AI Studio](https://aistudio.google.com/apikey). (2) בהגדרות המפתח: **Application restrictions = None**. (3) באיזורים שבהם Free tier לא נתמך, גוגל דורשת **Billing** — ב־AI Studio: [Plan / Billing](https://aistudio.google.com/app/plan_information) והפעילי חיוב. (4) בדיקה בלי השרת: `node script/test-gemini-key.mjs` מהשורש. |
| **הרצה מתיקייה לא נכונה** | מקומי | הרץ תמיד מתיקיית הפרויקט: `cd path\to\Websuite` ואז `npm run dev`. |

**בדיקה מקומית:** אחרי `npm run dev` אמור להופיע בטרמינל: `GEMINI_API_KEY: loaded (chat will work)`. אם מופיע `missing` — המפתח לא נטען (ראה שורות למעלה).

**לראות את השגיאה האמיתית של Gemini:** פתח בדפדפן (כשהשרת רץ מקומי):  
`http://localhost:5000/api/onboarding/chat-test`  
אם המפתח לא עובד או המודל לא זמין — תופיע שם ההודעה מהשרת (למשל "API key not valid" או "404").

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
