# הגדרת Vercel — כדי שהטופס והמיילים יעבדו

## למה המיילים לא נשלחו עד עכשיו?

**Vercel מריץ פונקציות Serverless רק מתיקיית `api/` שנמצאת בשורש הפרויקט** (באותו רמה כמו `vercel.json`).  
בפרויקט היו קבצי API רק ב־`client/api/`, ולכן ב־Vercel **לא הופעלה שום פונקציה** — בקשות ל־`/api/send-email` קיבלו 404 והמיילים לא נשלחו.

**התיקון:** נוצרה תיקייה `api/` בשורש הפרויקט עם `send-email.js`, `hello.js`, `check-email.js`. אחרי push ו־Redeploy ב־Vercel השליחה תעבוד (בתנאי ש־GMAIL_APP_PASSWORD מוגדר).

---

## 1. Root Directory (חשוב)

ב־Vercel → Project → **Settings** → **General** → **Root Directory**  
**השאירי ריק** (או `.`) — כך ש־`api/` ו־`vercel.json` נמצאים בשורש הפרויקט.  
אם מוגדר כאן `client` או תיקייה אחרת — ה־API לא ירוץ.

## 2. Environment Variables

ב־**Settings** → **Environment Variables** הוסיפי:

- **Name:** `GMAIL_APP_PASSWORD`  
- **Value:** סיסמת האפליקציה של Gmail (16 תווים)

**אל תגדירי** `VITE_API_URL` — תשאירי את האתר עם קריאות ל־`/api/...` באותו דומיין.

## 3. אחרי Deploy — בדיקה

1. **בדיקת API:**  
   פתחי בדפדפן:  
   `https://my-web-project-jet.vercel.app/api/hello`  
   אמור להופיע: `{"ok":true,"message":"API works"}`

2. **בדיקה אם Gmail מוגדר:**  
   פתחי:  
   `https://my-web-project-jet.vercel.app/api/check-email`  
   - אם מופיע `"configured": true` — המשתנה GMAIL_APP_PASSWORD מוגדר.  
   - אם מופיע `"configured": false` — הוסיפי ב־Vercel → Settings → Environment Variables את `GMAIL_APP_PASSWORD` ועשי Redeploy.

3. אם `/api/hello` **לא** מחזיר את זה — ה־API לא רץ ב־Vercel.  
   בדקי שוב ש־**Root Directory** ריק וש־**Redeploy** בוצע אחרי שינוי.

4. אם הטופס מצליח אבל **המייל לא מגיע** — בדקי בתיבת הדואר **דואר זבל** ב־websuite153@gmail.com, וודאי ש־`/api/check-email` מחזיר `configured: true`.
