import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Lang = "he" | "en";

interface I18nContextType {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  he: {
    "hero.line1": "אתר פרימיום.",
    "hero.line2": "מחיר נגיש.",
    "hero.line3": "אפס פשרות.",
    "hero.subtitle": "WebSuite הופכת את האתר שלכם לנכס הדיגיטלי הכי חזק בעסק. עיצוב עוצר נשימה במודל שמאפשר לכם לצמוח מהר יותר.",
    "hero.cta": "התחילו שאלון התאמה",
    "hero.services": "השירותים שלנו",
    "hero.stat.projects": "פרויקטים",
    "hero.stat.experience": "שנות ניסיון",
    "hero.stat.satisfaction": "שביעות רצון",

    "services.badge": "השירותים שלנו",
    "services.title1": "שלושה פתרונות,",
    "services.title2": "אינסוף אפשרויות",
    "services.subtitle": "כל שירות מותאם אישית לעסק שלכם — מהעיצוב ועד השורה האחרונה בקוד",
    "services.card.title": "כרטיס ביקור דיגיטלי",
    "services.card.subtitle": "הרושם הראשוני המושלם",
    "services.card.description": "כרטיס ביקור אינטראקטיבי ויוקרתי, מותאם למובייל עם שמירת איש קשר בקליק אחד",
    "services.card.f1": "עיצוב בוטיק מותאם",
    "services.card.f2": "שמירת איש קשר מיידית",
    "services.card.f3": "QR Code חכם",
    "services.card.f4": "שיתוף בכל הפלטפורמות",
    "services.card.price": "החל מ-₪490",
    "services.card.tag": "מחיר השקה",
    "services.landing.title": "דף נחיתה",
    "services.landing.subtitle": "ממיר לידים ומכירות",
    "services.landing.description": "דפי נחיתה מעוצבים עם מיקוד בהמרה גבוהה, מותאמים לכל מכשיר ומהירים ברמה שגוגל אוהב",
    "services.landing.f1": "עיצוב ממוקד המרה",
    "services.landing.f2": "מהירות טעינה מושלמת",
    "services.landing.f3": "אופטימיזציית SEO מלאה",
    "services.landing.f4": "מעקב ואנליטיקס",
    "services.landing.price": "החל מ-₪1,490",
    "services.landing.tag": "הכי פופולרי",
    "services.ecommerce.title": "חנות אונליין מלאה",
    "services.ecommerce.subtitle": "פתרון מסחר ברמה הכי גבוהה",
    "services.ecommerce.description": "חנות מקצועית עם ניהול מוצרים, סליקת אשראי מאובטחת, ומערכת ניהול הזמנות חכמה",
    "services.ecommerce.f1": "ניהול מוצרים מתקדם",
    "services.ecommerce.f2": "סליקה מאובטחת",
    "services.ecommerce.f3": "מעקב הזמנות אוטומטי",
    "services.ecommerce.f4": "דוחות מכירות ואנליטיקס",
    "services.ecommerce.price": "החל מ-₪4,990",
    "services.ecommerce.tag": "Premium",
    "services.preview": "צפו בדוגמה",
    "services.cta": "אני רוצה",

    "story.01.tagline": "01 — עיצוב",
    "story.01.title": "עיצוב ללא פשרות",
    "story.01.text": "כל פיקסל מתוכנן בקפידה. אנחנו לא משתמשים בתבניות מוכנות — כל אתר נבנה מאפס, בדיוק לפי החזון שלכם.",
    "story.02.tagline": "02 — ביצועים",
    "story.02.title": "ביצועים בלי תירוצים",
    "story.02.text": "מהירות טעינה מושלמת, ציון 100 ב-Google PageSpeed. הטכנולוגיות הכי מתקדמות — כדי שהלקוחות שלכם לא יחכו אפילו שנייה.",
    "story.03.tagline": "03 — המרה",
    "story.03.title": "חוויית משתמש שמוכרת",
    "story.03.text": "כל אלמנט מתוכנן להמרה. מהכפתור הראשון ועד לדף התשלום — מסלולים שהופכים מבקרים ללקוחות משלמים.",
    "story.04.tagline": "04 — מהירות",
    "story.04.title": "השקה מהירה ומדויקת",
    "story.04.text": "תהליך עבודה שקוף ומהיר. מהבריף הראשוני ועד לעלייה לאוויר — תוך ימים בודדים, לא שבועות.",
    "story.05.tagline": "05 — ליווי",
    "story.05.title": "ליווי מלא אחרי ההשקה",
    "story.05.text": "לא נעלמים אחרי שהאתר עולה. תמיכה טכנית, עדכוני אבטחה, ואופטימיזציה שוטפת — תמיד ברמה הכי גבוהה.",

    "faq.badge": "שאלות נפוצות",
    "faq.title1": "שאלות",
    "faq.title2": "ותשובות",
    "faq.subtitle": "כל מה שרציתם לדעת — במקום אחד",
    "faq.q1": "כמה זמן לוקח עד שהאתר עולה לאוויר?",
    "faq.a1": "רוב הפרויקטים הפרימיום שלנו מוכנים תוך 7-14 ימי עסקים, בהתאם למורכבות הפתרון הדיגיטלי. אנחנו לא חותכים פינות — כל פרויקט מקבל את הזמן שמגיע לו.",
    "faq.q2": "האתר מותאם למובייל?",
    "faq.a2": "בהחלט. אנחנו משתמשים ב-Dynamic Viewport Scaling (dvh) כדי להבטיח חוויה מושלמת בכל מכשיר — מ-iPhone ועד Galaxy, טאבלט ועד מסך רחב.",
    "faq.q3": "אני יכול לעדכן את התוכן בעצמי אחר כך?",
    "faq.a3": "כן, אנחנו בונים את הפתרונות שלנו כדי שיהיו ידידותיים למשתמש. תוכלו לנהל את התוכן בקלות בלי צורך בידע טכני.",
    "faq.q4": "מה כולל המחיר?",
    "faq.a4": "כל חבילה כוללת עיצוב מותאם אישית, פיתוח מלא, התאמה למובייל, והעלאה לאוויר. אין עלויות נסתרות.",
    "faq.q5": "יש תמיכה אחרי ההשקה?",
    "faq.a5": "בוודאי. אנחנו מלווים את הלקוחות שלנו גם אחרי שהאתר באוויר — תמיכה טכנית, עדכוני אבטחה, ודואגים שהכל רץ חלק. הליווי הוא חלק מהשירות שלנו.",

    "contact.badge": "צור קשר",
    "contact.title1": "בואו נבנה משהו",
    "contact.title2": "יוצא דופן ביחד",
    "contact.subtitle": "ספרו לנו על הפרויקט שלכם — נחזור אליכם תוך 24 שעות עם הצעה מותאמת",
    "contact.name": "שם מלא",
    "contact.name.placeholder": "הזינו את שמכם",
    "contact.email": "אימייל",
    "contact.phone": "טלפון",
    "contact.service": "שירות מבוקש",
    "contact.service.placeholder": "בחרו שירות",
    "contact.service.card": "כרטיס ביקור דיגיטלי",
    "contact.service.landing": "דף נחיתה",
    "contact.service.ecommerce": "חנות אונליין מלאה",
    "contact.service.other": "אחר",
    "contact.message": "ספרו לנו על הפרויקט",
    "contact.message.placeholder": "מה אתם מחפשים? מה חשוב לכם? כל פרט עוזר לנו להתאים את ההצעה...",
    "contact.submit": "שלחו הודעה",
    "contact.sending": "שולח...",
    "contact.error.title": "שגיאה בשליחה",
    "contact.error.desc": "אנא נסו שוב מאוחר יותר",
    "contact.success.title": "הפרטים שלכם בדרך אלינו",
    "contact.success.desc": "אנחנו כבר מתחילים לעבור על המידע. תקבלו מאיתנו הצעה מותאמת אישית תוך פחות מ-24 שעות.",
    "contact.success.item1": "הצעה מותאמת תוך 24 שעות",
    "contact.success.item2": "הצוות מגיע מוכן עם פתרונות לעסק שלך",
    "contact.success.item3": "שאלון קצר — פחות מ-2 דקות",
    "contact.success.cta": "בואו נתחיל עכשיו!",
    "contact.success.dismiss": "לא עכשיו, תודה",
    "contact.fallback": "הפרטים שלכם נשמרו בהצלחה. ניתן גם ליצור קשר ישיר דרך WhatsApp:",
    "contact.fallback.cta": "שלחו לנו WhatsApp",
    "contact.whatsapp.subtitle": "זמינים בשעות העבודה",
    "contact.phone.subtitle": "א׳-ה׳ 9:00-18:00",
    "contact.email.subtitle": "נחזור אליכם תוך 24 שעות",
    "contact.why": "למה WebSuite?",
    "contact.why.1": "איכות בוטיק במחירים תחרותיים",
    "contact.why.2": "8+ שנות ניסיון בפיתוח",
    "contact.why.3": "100+ פרויקטים שהושלמו בהצלחה",
    "contact.why.4": "תמיכה טכנית צמודה אחרי ההשקה",

    "nav.home": "ראשי",
    "nav.services": "שירותים",
    "nav.contact": "צור קשר",
    "nav.questionnaire": "שאלון התאמה",

    "footer.copyright": "WebSuite. כל הזכויות שמורות.",
  },
  en: {
    "hero.line1": "Premium Website.",
    "hero.line2": "Affordable Price.",
    "hero.line3": "Zero Compromises.",
    "hero.subtitle": "WebSuite turns your website into the most powerful digital asset in your business. Stunning design in a model that lets you grow faster.",
    "hero.cta": "Start Matching Quiz",
    "hero.services": "Our Services",
    "hero.stat.projects": "Projects",
    "hero.stat.experience": "Years Experience",
    "hero.stat.satisfaction": "Satisfaction",

    "services.badge": "Our Services",
    "services.title1": "Three Solutions,",
    "services.title2": "Infinite Possibilities",
    "services.subtitle": "Each service is custom-tailored for your business — from design to the last line of code",
    "services.card.title": "Digital Business Card",
    "services.card.subtitle": "The Perfect First Impression",
    "services.card.description": "An interactive, premium business card, mobile-optimized with one-click contact saving",
    "services.card.f1": "Custom boutique design",
    "services.card.f2": "Instant contact saving",
    "services.card.f3": "Smart QR Code",
    "services.card.f4": "Cross-platform sharing",
    "services.card.price": "From ₪490",
    "services.card.tag": "Launch Price",
    "services.landing.title": "Landing Page",
    "services.landing.subtitle": "Lead & Sales Converter",
    "services.landing.description": "Beautifully designed landing pages focused on high conversion, optimized for every device and lightning fast",
    "services.landing.f1": "Conversion-focused design",
    "services.landing.f2": "Perfect load speed",
    "services.landing.f3": "Full SEO optimization",
    "services.landing.f4": "Tracking & analytics",
    "services.landing.price": "From ₪1,490",
    "services.landing.tag": "Most Popular",
    "services.ecommerce.title": "Full Online Store",
    "services.ecommerce.subtitle": "Top-tier E-Commerce Solution",
    "services.ecommerce.description": "Professional store with product management, secure payment processing, and smart order management",
    "services.ecommerce.f1": "Advanced product management",
    "services.ecommerce.f2": "Secure payment processing",
    "services.ecommerce.f3": "Automated order tracking",
    "services.ecommerce.f4": "Sales reports & analytics",
    "services.ecommerce.price": "From ₪4,990",
    "services.ecommerce.tag": "Premium",
    "services.preview": "See Example",
    "services.cta": "I Want This",

    "story.01.tagline": "01 — Design",
    "story.01.title": "Uncompromising Design",
    "story.01.text": "Every pixel is meticulously planned. We don't use templates — each site is built from scratch, exactly to your vision.",
    "story.02.tagline": "02 — Performance",
    "story.02.title": "No-Excuse Performance",
    "story.02.text": "Perfect load speed, 100 score on Google PageSpeed. The most advanced technologies — so your customers don't wait even a second.",
    "story.03.tagline": "03 — Conversion",
    "story.03.title": "UX That Sells",
    "story.03.text": "Every element is designed for conversion. From the first button to the checkout — paths that turn visitors into paying customers.",
    "story.04.tagline": "04 — Speed",
    "story.04.title": "Fast & Precise Launch",
    "story.04.text": "Transparent and swift workflow. From the initial brief to going live — in just days, not weeks.",
    "story.05.tagline": "05 — Support",
    "story.05.title": "Full Post-Launch Support",
    "story.05.text": "We don't disappear after launch. Technical support, security updates, and ongoing optimization — always at the highest level.",

    "faq.badge": "FAQ",
    "faq.title1": "Questions",
    "faq.title2": "& Answers",
    "faq.subtitle": "Everything you wanted to know — in one place",
    "faq.q1": "How long until the site goes live?",
    "faq.a1": "Most of our premium projects are ready within 7-14 business days, depending on the complexity. We don't cut corners — every project gets the time it deserves.",
    "faq.q2": "Is the site mobile-friendly?",
    "faq.a2": "Absolutely. We use Dynamic Viewport Scaling (dvh) to ensure a flawless experience on every device — from iPhone to Galaxy, tablet to widescreen.",
    "faq.q3": "Can I update the content myself?",
    "faq.a3": "Yes, we build our solutions to be user-friendly. You can manage the content easily without any technical knowledge.",
    "faq.q4": "What's included in the price?",
    "faq.a4": "Every package includes custom design, full development, mobile optimization, and deployment. No hidden costs.",
    "faq.q5": "Is there post-launch support?",
    "faq.a5": "Of course. We support our clients even after launch — technical support, security updates, and making sure everything runs smoothly. Support is part of our service.",

    "contact.badge": "Contact Us",
    "contact.title1": "Let's Build Something",
    "contact.title2": "Extraordinary Together",
    "contact.subtitle": "Tell us about your project — we'll get back to you within 24 hours with a tailored proposal",
    "contact.name": "Full Name",
    "contact.name.placeholder": "Enter your name",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.service": "Requested Service",
    "contact.service.placeholder": "Choose a service",
    "contact.service.card": "Digital Business Card",
    "contact.service.landing": "Landing Page",
    "contact.service.ecommerce": "Full Online Store",
    "contact.service.other": "Other",
    "contact.message": "Tell Us About Your Project",
    "contact.message.placeholder": "What are you looking for? What's important to you? Every detail helps us tailor our proposal...",
    "contact.submit": "Send Message",
    "contact.sending": "Sending...",
    "contact.error.title": "Sending Error",
    "contact.error.desc": "Please try again later",
    "contact.success.title": "Your Details Are On Their Way",
    "contact.success.desc": "We're already reviewing your information. You'll receive a personalized proposal within 24 hours.",
    "contact.success.item1": "Custom proposal within 24 hours",
    "contact.success.item2": "Our team comes prepared with solutions for your business",
    "contact.success.item3": "Short questionnaire — less than 2 minutes",
    "contact.success.cta": "Let's Start Now!",
    "contact.success.dismiss": "Not now, thanks",
    "contact.fallback": "Your details have been saved successfully. You can also contact us directly via WhatsApp:",
    "contact.fallback.cta": "Send Us a WhatsApp",
    "contact.whatsapp.subtitle": "Available during business hours",
    "contact.phone.subtitle": "Sun-Thu 9:00-18:00",
    "contact.email.subtitle": "We'll reply within 24 hours",
    "contact.why": "Why WebSuite?",
    "contact.why.1": "Boutique quality at competitive prices",
    "contact.why.2": "8+ years of development experience",
    "contact.why.3": "100+ successfully completed projects",
    "contact.why.4": "Dedicated technical support post-launch",

    "nav.home": "Home",
    "nav.services": "Services",
    "nav.contact": "Contact",
    "nav.questionnaire": "Matching Quiz",

    "footer.copyright": "WebSuite. All Rights Reserved.",
  },
};

const I18nContext = createContext<I18nContextType | null>(null);

const LANG_KEY = "websuite_lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "en" || saved === "he") return saved;
    }
    return "he";
  });

  const dir = lang === "he" ? "rtl" : "ltr";

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[lang][key] || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, dir, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
