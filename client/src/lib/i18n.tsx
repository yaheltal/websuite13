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
    "hero.subtitle": "מלאו שאלון קצר, שוחחו עם סוכנת האפיון שלנו — ותוך 24 שעות תקבלו הדמיה ראשונה והצעת מחיר מותאמת אישית.",
    "hero.subtitle.highlight": "בלי התחייבות!",
    "hero.cta": "התחילו שאלון התאמה",
    "hero.services": "השירותים שלנו",
    "hero.stat.projects": "פרויקטים",
    "hero.stat.experience": "שנות ניסיון",
    "hero.stat.retention": "מנויים",

    "services.badge": "השירותים שלנו",
    "services.title1": "שלושה פתרונות,",
    "services.title2": "אינסוף אפשרויות",
    "services.subtitle": "כל שירות מותאם אישית לעסק שלכם — מהעיצוב ועד השורה האחרונה בקוד",
    "services.card.title": "התחלה חכמה",
    "services.card.subtitle": "כרטיס ביקור דיגיטלי",
    "services.card.description": "כרטיס ביקור אינטראקטיבי ויוקרתי, מותאם למובייל עם שמירת איש קשר בקליק אחד",
    "services.card.f1": "עיצוב בוטיק מותאם",
    "services.card.f2": "שמירת איש קשר מיידית",
    "services.card.f3": "QR Code חכם",
    "services.card.f4": "שיתוף בכל הפלטפורמות",
    "services.card.tag": "הכי נגיש",
    "services.landing.title": "הבית הדיגיטלי",
    "services.landing.subtitle": "אתר תדמית מלא",
    "services.landing.description": "אתר תדמית מקצועי שמספר את סיפור המותג שלכם — עם תיק עבודות, המלצות לקוחות ומערכת לידים חכמה",
    "services.landing.f1": "סיפור מותג ותיק עבודות",
    "services.landing.f2": "המלצות לקוחות",
    "services.landing.f3": "טופס יצירת קשר חכם",
    "services.landing.f4": "אוטומציות למייל ולוואטסאפ",
    "services.landing.tag": "הכי פופולרי",
    "services.ecommerce.title": "חנות אונליין מלאה",
    "services.ecommerce.subtitle": "פתרון מסחר ברמה הכי גבוהה",
    "services.ecommerce.description": "חנות מקצועית עם ניהול מוצרים, סליקת אשראי מאובטחת, ומערכת ניהול הזמנות חכמה",
    "services.ecommerce.f1": "ניהול מוצרים מתקדם",
    "services.ecommerce.f2": "סליקה מאובטחת",
    "services.ecommerce.f3": "מעקב הזמנות אוטומטי",
    "services.ecommerce.f4": "דוחות מכירות ואנליטיקס",
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
    "faq.q6": "מה קורה כשלקוח משאיר פרטים באתר?",
    "faq.a6": "ברגע שלקוח ממלא את טופס יצירת הקשר, הפרטים עוברים אימות מיידי ונשלחים ישירות למייל העבודה שלכם — בזמן אמת, 24/7. ככה אף ליד לא הולך לאיבוד, ותוכלו לחזור ללקוח תוך דקות. המערכת מאובטחת, אמינה, ועובדת אוטומטית בלי שתצטרכו לגעת בשום דבר.",

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
    "contact.service.landing": "אתר תדמית",
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
    "contact.why.2": "6+ שנות ניסיון בפיתוח",
    "contact.why.3": "100+ פרויקטים שהושלמו בהצלחה",
    "contact.why.4": "תמיכה טכנית צמודה אחרי ההשקה",

    "onboarding.resume.title": "יש לנו פרטים שמורים",
    "onboarding.resume.desc": "נשמרו אצלנו פרטי התקשרות וההתקדמות מהפעם הקודמת. איך תרצו להמשיך?",
    "onboarding.resume.continue": "המשך עם הפרטים השמורים",
    "onboarding.resume.fresh": "רשם מחדש פרטים ראשוניים",

    "nav.home": "ראשי",
    "nav.services": "שירותים",
    "nav.contact": "צור קשר",
    "nav.questionnaire": "שאלון התאמה",

    "footer.copyright": "WebSuite. כל הזכויות שמורות.",
    "footer.desc": "עיצוב ופיתוח אתרים ברמה הכי גבוהה — דפי נחיתה, חנויות אונליין וכרטיסי ביקור דיגיטליים. הנוכחות הדיגיטלית שלכם מתחילה כאן.",
    "footer.services": "שירותים",
    "footer.services.websites": "אתרים",
    "footer.services.landing": "אתר תדמית",
    "footer.services.card": "כרטיס ביקור דיגיטלי",
    "footer.contact": "צור קשר",
    "footer.contact.quote": "קבלו הצעת מחיר",
    "footer.contact.email": "שלחו מייל",
    "footer.legal": "משפטי",
    "footer.legal.privacy": "מדיניות פרטיות",
    "footer.legal.terms": "תנאי שימוש",
    "footer.legal.cookies": "מדיניות עוגיות",
  },
  en: {
    "hero.subtitle": "Fill a short questionnaire, chat with our AI specialist — and within 24 hours get your first mockup and a personalized quote.",
    "hero.subtitle.highlight": "No commitment!",
    "hero.cta": "Get Your Free Consultation",
    "hero.services": "Explore Our Work",
    "hero.stat.projects": "Projects Delivered",
    "hero.stat.experience": "Years of Expertise",
    "hero.stat.retention": "Subscribers",

    "services.badge": "What We Do",
    "services.title1": "One Vision,",
    "services.title2": "Three Powerful Solutions",
    "services.subtitle": "Every project is handcrafted to fit your brand — from the first sketch to the final line of code",
    "services.card.title": "Smart Start",
    "services.card.subtitle": "Digital Business Card",
    "services.card.description": "A sleek, interactive digital card optimized for mobile — share your brand and save contacts with a single tap",
    "services.card.f1": "Bespoke visual identity",
    "services.card.f2": "One-tap contact saving",
    "services.card.f3": "Intelligent QR Code",
    "services.card.f4": "Seamless cross-platform sharing",
    "services.card.tag": "Most Accessible",
    "services.landing.title": "The Digital Home",
    "services.landing.subtitle": "Full Brand Website",
    "services.landing.description": "A professional brand website that tells your story — with a stunning portfolio, client testimonials, and a smart lead capture system",
    "services.landing.f1": "Brand story & portfolio",
    "services.landing.f2": "Client testimonials",
    "services.landing.f3": "Smart contact form",
    "services.landing.f4": "Email & WhatsApp automations",
    "services.landing.tag": "Most Popular",
    "services.ecommerce.title": "Full E-Commerce Store",
    "services.ecommerce.subtitle": "Your Complete Online Storefront",
    "services.ecommerce.description": "A professional store with robust product management, secure checkout, and intelligent order fulfillment",
    "services.ecommerce.f1": "Advanced catalog management",
    "services.ecommerce.f2": "PCI-compliant secure checkout",
    "services.ecommerce.f3": "Automated order fulfillment",
    "services.ecommerce.f4": "Revenue dashboards & insights",
    "services.ecommerce.tag": "Premium",
    "services.preview": "Live Preview",
    "services.cta": "Get Started",

    "story.01.tagline": "01 — Craft",
    "story.01.title": "Design Without Compromise",
    "story.01.text": "Every pixel serves a purpose. No templates, no shortcuts — each project is architected from the ground up to bring your unique vision to life.",
    "story.02.tagline": "02 — Speed",
    "story.02.title": "Performance That Speaks for Itself",
    "story.02.text": "Flawless load times. Perfect Google PageSpeed scores. We leverage cutting-edge technology so your audience never waits.",
    "story.03.tagline": "03 — Impact",
    "story.03.title": "Experiences That Drive Revenue",
    "story.03.text": "Every element is strategically placed to guide visitors toward action — turning casual browsers into loyal, paying customers.",
    "story.04.tagline": "04 — Velocity",
    "story.04.title": "From Brief to Launch — Fast",
    "story.04.text": "A transparent, agile process that delivers results in days, not months. Your project stays on track from kickoff to go-live.",
    "story.05.tagline": "05 — Partnership",
    "story.05.title": "We're With You After Launch",
    "story.05.text": "Our relationship doesn't end at deployment. Ongoing support, security updates, and continuous optimization — we're invested in your long-term success.",

    "faq.badge": "Common Questions",
    "faq.title1": "Your Questions,",
    "faq.title2": "Answered",
    "faq.subtitle": "Transparent answers to help you make the right decision",
    "faq.q1": "What's the typical timeline from start to launch?",
    "faq.a1": "Most premium projects are delivered within 7–14 business days, depending on scope and complexity. We never rush quality — every project receives the dedicated attention it deserves.",
    "faq.q2": "Will my site look great on mobile?",
    "faq.a2": "Without question. We engineer every project with a mobile-first approach, using advanced viewport techniques to deliver a flawless experience across all devices and screen sizes.",
    "faq.q3": "Can I manage the content on my own?",
    "faq.a3": "Absolutely. We build intuitive, user-friendly systems that empower you to update content confidently — no technical expertise required.",
    "faq.q4": "What exactly is included in the pricing?",
    "faq.a4": "Every package covers custom design, full-stack development, mobile optimization, and live deployment. The price you see is the price you pay — no hidden fees, ever.",
    "faq.q5": "Do you offer support after the site goes live?",
    "faq.a5": "Always. We provide ongoing technical support, proactive security updates, and performance monitoring. Think of us as your long-term digital partner, not just a vendor.",
    "faq.q6": "What happens when a customer submits their details on the site?",
    "faq.a6": "The moment a visitor fills out your contact form, their details are instantly validated and delivered straight to your business email — in real time, around the clock. No lead ever slips through the cracks, so you can respond within minutes. The system is fully automated, secure, and requires zero maintenance on your end.",

    "contact.badge": "Get in Touch",
    "contact.title1": "Let's Create Something",
    "contact.title2": "Remarkable Together",
    "contact.subtitle": "Share your vision with us — we'll respond within 24 hours with a personalized strategy",
    "contact.name": "Full Name",
    "contact.name.placeholder": "Your full name",
    "contact.email": "Email Address",
    "contact.phone": "Phone Number",
    "contact.service": "Service of Interest",
    "contact.service.placeholder": "Select a service",
    "contact.service.card": "Digital Business Card",
    "contact.service.landing": "Brand Website",
    "contact.service.ecommerce": "Full E-Commerce Store",
    "contact.service.other": "Something Else",
    "contact.message": "Tell Us About Your Vision",
    "contact.message.placeholder": "What does success look like for your project? Share your goals, preferences, and any details that will help us craft the perfect solution...",
    "contact.submit": "Send Your Message",
    "contact.sending": "Sending...",
    "contact.error.title": "Something Went Wrong",
    "contact.error.desc": "Please try again in a moment",
    "contact.success.title": "We've Received Your Details",
    "contact.success.desc": "Our team is already reviewing your project. Expect a tailored proposal in your inbox within 24 hours.",
    "contact.success.item1": "Personalized proposal within 24 hours",
    "contact.success.item2": "Our team arrives prepared with solutions for your business",
    "contact.success.item3": "Quick discovery call — under 2 minutes",
    "contact.success.cta": "Start Your Project Now",
    "contact.success.dismiss": "Maybe later",
    "contact.fallback": "Your information has been saved. You're also welcome to reach out directly via WhatsApp:",
    "contact.fallback.cta": "Message Us on WhatsApp",
    "contact.whatsapp.subtitle": "Responsive during business hours",
    "contact.phone.subtitle": "Sun–Thu, 9:00 AM – 6:00 PM",
    "contact.email.subtitle": "Response guaranteed within 24 hours",
    "contact.why": "The WebSuite Advantage",
    "contact.why.1": "Boutique craftsmanship at competitive rates",
    "contact.why.2": "Over 6 years of hands-on expertise",
    "contact.why.3": "100+ projects delivered successfully",
    "contact.why.4": "Dedicated post-launch partnership & support",

    "onboarding.resume.title": "We have your saved details",
    "onboarding.resume.desc": "We saved your contact info and progress from last time. How would you like to continue?",
    "onboarding.resume.continue": "Continue with saved details",
    "onboarding.resume.fresh": "Re-enter details from scratch",

    "nav.home": "Home",
    "nav.services": "Services",
    "nav.contact": "Contact",
    "nav.questionnaire": "Free Consultation",

    "footer.copyright": "WebSuite. All Rights Reserved.",
    "footer.desc": "Premium web design and development — landing pages, e-commerce stores, and digital business cards. Your digital presence starts here.",
    "footer.services": "Services",
    "footer.services.websites": "Websites",
    "footer.services.landing": "Brand Website",
    "footer.services.card": "Digital Business Card",
    "footer.contact": "Contact",
    "footer.contact.quote": "Get a Quote",
    "footer.contact.email": "Email Us",
    "footer.legal": "Legal",
    "footer.legal.privacy": "Privacy Policy",
    "footer.legal.terms": "Terms of Service",
    "footer.legal.cookies": "Cookie Policy",
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
