# הגדרת Vercel — כדי שהטופס והמיילים יעבדו

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

2. אם `/api/hello` **לא** מחזיר את זה — ה־API לא רץ ב־Vercel.  
   בדקי שוב ש־**Root Directory** ריק וש־**Redeploy** בוצע אחרי שינוי.

3. אם `/api/hello` **עובד** אבל טופס צור קשר לא שולח מייל —  
   בדקי ב־Vercel → **Deployments** → **Functions** / **Logs** שיש קריאות ל־`/api/contact` ושהשגיאות (אם יש) קשורות ל־`GMAIL_APP_PASSWORD`.
