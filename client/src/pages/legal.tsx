import { useI18n } from "@/lib/i18n";
import { WebSuiteLogo } from "@/components/websuite-logo";
import { Link, useRoute } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const legalContent: Record<string, { he: { title: string; body: string[] }; en: { title: string; body: string[] } }> = {
  privacy: {
    he: {
      title: "מדיניות פרטיות",
      body: [
        "WebSuite מכבדת את פרטיות המשתמשים שלה. מדיניות זו מתארת כיצד אנו אוספים, משתמשים ומגנים על המידע שלכם.",
        "מידע שאנו אוספים: שם, כתובת אימייל, מספר טלפון ופרטי הפרויקט שלכם — רק כפי שתמסרו לנו דרך טופס יצירת הקשר או שאלון ההתאמה.",
        "שימוש במידע: המידע משמש אך ורק ליצירת קשר עמכם לגבי הפרויקט שלכם ולמתן הצעת מחיר מותאמת אישית.",
        "שמירה ואבטחה: המידע שלכם מאוחסן באופן מאובטח ואינו מועבר לצדדים שלישיים ללא הסכמתכם.",
        "עוגיות: האתר משתמש בעוגיות בסיסיות לשמירת העדפות שפה בלבד.",
        "לשאלות בנוגע לפרטיות, צרו קשר דרך websuite153@gmail.com.",
      ],
    },
    en: {
      title: "Privacy Policy",
      body: [
        "WebSuite respects the privacy of its users. This policy describes how we collect, use, and protect your information.",
        "Information We Collect: Name, email address, phone number, and project details — only as you provide them through our contact form or consultation questionnaire.",
        "Use of Information: Your information is used solely to contact you regarding your project and to provide a personalized quote.",
        "Storage and Security: Your data is stored securely and is never shared with third parties without your consent.",
        "Cookies: This site uses basic cookies only to save your language preference.",
        "For privacy-related questions, contact us at websuite153@gmail.com.",
      ],
    },
  },
  terms: {
    he: {
      title: "תנאי שימוש",
      body: [
        "ברוכים הבאים לאתר WebSuite. השימוש באתר זה כפוף לתנאים המפורטים להלן.",
        "שירותים: WebSuite מספקת שירותי עיצוב ופיתוח אתרים, דפי נחיתה וכרטיסי ביקור דיגיטליים. כל פרויקט כפוף להסכם נפרד.",
        "קניין רוחני: כל התכנים, העיצובים והקוד באתר זה שייכים ל-WebSuite, אלא אם צוין אחרת בהסכם הפרויקט.",
        "אחריות: WebSuite אינה אחראית לנזקים עקיפים הנובעים משימוש באתר. אנו מתחייבים לספק שירות מקצועי ואיכותי.",
        "שינויים: WebSuite שומרת לעצמה את הזכות לעדכן תנאים אלו. עדכונים ייכנסו לתוקף עם פרסומם באתר.",
        "לשאלות, פנו אלינו דרך websuite153@gmail.com.",
      ],
    },
    en: {
      title: "Terms of Service",
      body: [
        "Welcome to the WebSuite website. Your use of this site is subject to the following terms.",
        "Services: WebSuite provides website design and development, landing pages, and digital business cards. Each project is subject to a separate agreement.",
        "Intellectual Property: All content, designs, and code on this site belong to WebSuite, unless otherwise specified in the project agreement.",
        "Liability: WebSuite is not responsible for indirect damages resulting from use of this site. We are committed to delivering professional, high-quality service.",
        "Changes: WebSuite reserves the right to update these terms. Updates take effect upon publication on this site.",
        "For questions, contact us at websuite153@gmail.com.",
      ],
    },
  },
  cookies: {
    he: {
      title: "מדיניות עוגיות",
      body: [
        "אתר WebSuite משתמש בעוגיות (Cookies) כדי לשפר את חוויית הגלישה שלכם.",
        "סוגי עוגיות: אנו משתמשים בעוגיות הכרחיות בלבד — לשמירת העדפת שפה (עברית/אנגלית) וסטטוס השאלון.",
        "איננו משתמשים בעוגיות פרסומיות או בעוגיות מעקב של צדדים שלישיים.",
        "ניהול עוגיות: תוכלו למחוק עוגיות דרך הגדרות הדפדפן שלכם בכל עת. מחיקת העוגיות תאפס את העדפות השפה שלכם.",
        "לשאלות נוספות, צרו קשר דרך websuite153@gmail.com.",
      ],
    },
    en: {
      title: "Cookie Policy",
      body: [
        "The WebSuite website uses cookies to improve your browsing experience.",
        "Types of Cookies: We use only essential cookies — to save your language preference (Hebrew/English) and questionnaire status.",
        "We do not use advertising cookies or third-party tracking cookies.",
        "Managing Cookies: You can delete cookies through your browser settings at any time. Deleting cookies will reset your language preference.",
        "For further questions, contact us at websuite153@gmail.com.",
      ],
    },
  },
};

export default function LegalPage() {
  const { lang } = useI18n();
  const [, params] = useRoute("/legal/:type");
  const type = params?.type || "privacy";

  const content = legalContent[type];
  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Page not found</p>
      </div>
    );
  }

  const localized = lang === "he" ? content.he : content.en;

  return (
    <div className="min-h-screen bg-background" dir={lang === "he" ? "rtl" : "ltr"}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <Link href="/">
          <div className="flex items-center gap-2.5 mb-12 cursor-pointer group" data-testid="link-legal-home">
            <WebSuiteLogo size={32} gradientId="legal" />
            <span dir="ltr" className="text-lg font-extrabold tracking-tight" style={{
              background: "linear-gradient(135deg, hsl(220 80% 60%), hsl(260 70% 60%), hsl(170 80% 50%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              unicodeBidi: "bidi-override",
              direction: "ltr",
            }}>
              WebSuite
            </span>
          </div>
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold text-charcoal mb-8" data-testid="text-legal-title">
          {localized.title}
        </h1>

        <div className="space-y-5">
          {localized.body.map((paragraph, i) => (
            <p key={i} className="text-charcoal-light leading-relaxed" data-testid={`text-legal-paragraph-${i}`}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/40">
          <Link href="/">
            <Button variant="outline" className="gap-2" data-testid="button-legal-back">
              <ArrowRight className="w-4 h-4" />
              {lang === "he" ? "חזרה לדף הבית" : "Back to Home"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
