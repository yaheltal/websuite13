# פריסת השרת (Backend) — כדי שהמיילים יעבדו באתר החי

הפרונט על Vercel לא מריץ את השרת. כדי שטופס צור קשר ושאלון ישלחו מיילים — צריך לפרוס את השרת (Node) איפשהו.

---

## שלב 1: פריסת השרת ל-Railway (חינם להתחלה)

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
| Vercel     | `VITE_API_URL`       | `https://xxxxx.up.railway.app`      |

אחרי ששני הצעדים מסומנים ✓ — המיילים אמורים להגיע כשמישהו ממלא טופס או שאלון באתר החי.
