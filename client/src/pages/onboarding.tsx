import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WebSuiteLogo } from "@/components/websuite-logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";
import { API_BASE, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowLeft,
  Globe,
  CreditCard,
  ShoppingBag,
  Bot,
  User,
  Send,
  Upload,
  FileImage,
  Check,
  CheckCircle2,
  Loader2,
  Clock,
  Zap,
  FileText,
  Sparkles,
  SkipForward,
  Smile,
} from "lucide-react";

const STORAGE_KEY = "web13_onboarding";

function saveToStorage(data: Record<string, any>) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...data }));
  } catch {}
}

function loadFromStorage(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

const services = [
  {
    id: "landing-page",
    title: "דף נחיתה",
    description: "דף נחיתה ממוקד המרה שימשוך לידים ויגביר מכירות",
    icon: Globe,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "digital-card",
    title: "כרטיס ביקור דיגיטלי",
    description: "כרטיס ביקור מעוצב ומקצועי שמשאיר רושם",
    icon: CreditCard,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "ecommerce",
    title: "חנות אונליין",
    description: "חנות מסחר אלקטרוני מלאה עם תשלומים ומשלוחים",
    icon: ShoppingBag,
    color: "from-emerald-500 to-emerald-600",
  },
];

const landingQuestions = [
  { key: "businessName", label: "שם העסק", type: "text", required: true },
  { key: "businessField", label: "תחום פעילות", type: "text", required: true },
  { key: "targetAudience", label: "קהל יעד", type: "text", required: true },
  { key: "mainGoal", label: "מטרה עיקרית (לידים, מכירות, מודעות)", type: "text", required: true },
  { key: "existingBranding", label: "האם יש מיתוג קיים? (לוגו, צבעים)", type: "text", required: false },
  { key: "inspirations", label: "אתרים שמשמשים השראה", type: "text", required: false },
  { key: "specialFeatures", label: "פיצ'רים מיוחדים שצריך", type: "textarea", required: false },
  { key: "budget", label: "תקציב משוער", type: "text", required: false },
  { key: "timeline", label: "לוח זמנים רצוי", type: "text", required: false },
];

const cardQuestions = [
  { key: "fullName", label: "שם מלא", type: "text", required: true },
  { key: "jobTitle", label: "תפקיד", type: "text", required: true },
  { key: "businessName", label: "שם העסק / חברה", type: "text", required: true },
  { key: "phone", label: "טלפון", type: "text", required: true },
  { key: "email", label: "אימייל", type: "text", required: true },
  { key: "socialLinks", label: "קישורים לרשתות חברתיות", type: "textarea", required: false },
  { key: "brandColors", label: "צבעי מותג (אם יש)", type: "text", required: false },
  { key: "personalBranding", label: "סגנון אישי / מסר שתרצה להעביר", type: "textarea", required: false },
  { key: "specialFeatures", label: "פיצ'רים (QR, vCard, גלריה)", type: "text", required: false },
];

const ecommerceQuestions = [
  { key: "businessName", label: "שם החנות / העסק", type: "text", required: true },
  { key: "businessField", label: "תחום ומוצרים עיקריים", type: "text", required: true },
  { key: "productCount", label: "כמה מוצרים (בערך)?", type: "text", required: true },
  { key: "targetAudience", label: "קהל יעד", type: "text", required: true },
  { key: "shippingMethod", label: "שיטת משלוח (דואר, שליח, איסוף)", type: "text", required: true },
  { key: "paymentMethods", label: "אמצעי תשלום (אשראי, PayPal, bit)", type: "text", required: true },
  { key: "existingBranding", label: "מיתוג קיים (לוגו, צבעים)", type: "text", required: false },
  { key: "existingSite", label: "האם יש אתר קיים? כתובת?", type: "text", required: false },
  { key: "specialFeatures", label: "פיצ'רים מיוחדים (קופונים, מלאי, מנויים)", type: "textarea", required: false },
  { key: "inspirations", label: "חנויות שמשמשות השראה", type: "text", required: false },
  { key: "budget", label: "תקציב משוער", type: "text", required: false },
  { key: "timeline", label: "לוח זמנים", type: "text", required: false },
];

function getQuestionsForService(service: string) {
  switch (service) {
    case "digital-card": return cardQuestions;
    case "ecommerce": return ecommerceQuestions;
    default: return landingQuestions;
  }
}

const contactSchema = z.object({
  name: z.string().min(2, "שם חייב להכיל לפחות 2 תווים"),
  email: z.string().email("אנא הזן כתובת אימייל תקינה"),
  phone: z.string().min(9, "אנא הזן מספר טלפון תקין (*)"),
});

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

function formatChatMessage(text: string) {
  return text.split("\n").map((line, j) => {
    const segments: Array<{ text: string; bold: boolean }> = [];
    let lastIndex = 0;
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) segments.push({ text: line.slice(lastIndex, match.index), bold: false });
      segments.push({ text: match[1], bold: true });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) segments.push({ text: line.slice(lastIndex), bold: false });
    if (segments.length === 0) segments.push({ text: line, bold: false });
    return (
      <span key={j}>
        {j > 0 && <br />}
        {segments.map((seg, k) =>
          seg.bold ? <strong key={k}>{seg.text}</strong> : <span key={k}>{seg.text}</span>
        )}
      </span>
    );
  });
}

function ProgressBar({ stepsRemaining }: { stepsRemaining: number }) {
  const totalSteps = 3;
  const completed = totalSteps - stepsRemaining;
  const percentage = Math.round((completed / totalSteps) * 100);

  const stepLabels = ["שאלון", "שיחת AI", "העלאת קבצים"];

  return (
    <div className="mb-8" data-testid="progress-bar">
      <div className="flex items-center justify-between mb-3">
        <span className="text-base font-bold text-charcoal">
          {stepsRemaining > 0
            ? `${stepsRemaining} צעדים להצעת מחיר מקצועית`
            : "סיימת! ההצעה בדרך אליך"}
        </span>
        <span className="text-sm font-bold text-copper">{percentage}%</span>
      </div>
      <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-l from-copper to-copper-dark rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {stepLabels.map((label, i) => (
          <span
            key={i}
            className={`text-xs font-medium ${i < completed ? "text-copper" : "text-charcoal-light/60"}`}
          >
            {i < completed ? "✓ " : ""}{label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Onboarding() {
  const saved = loadFromStorage();
  const hasSavedData = (saved.step != null && saved.step > 0) || (saved.contactName && String(saved.contactName).trim() !== "");
  const [resumeChoice, setResumeChoice] = useState<null | "continue" | "fresh">(null);

  const [step, setStep] = useState(saved.step || 0);
  const [selectedService, setSelectedService] = useState<string>(saved.selectedService || "");
  const [questionnaireData, setQuestionnaireData] = useState<Record<string, string>>(saved.questionnaireData || {});
  const [onboardingId, setOnboardingId] = useState<number | null>(saved.onboardingId || null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(saved.chatMessages || []);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(saved.chatSessionId || null);
  const [chatComplete, setChatComplete] = useState(saved.chatComplete || false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(saved.uploadedFiles || []);
  const [uploading, setUploading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(saved.completed || false);
  const [leadNotified, setLeadNotified] = useState(saved.leadNotified || false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useI18n();

  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: saved.contactName || "",
      email: saved.contactEmail || "",
      phone: saved.contactPhone || "",
    },
  });

  const stateRef = useRef({
    step, selectedService, questionnaireData, onboardingId,
    chatMessages, chatSessionId, chatComplete, uploadedFiles,
    completed, leadNotified,
  });

  useEffect(() => {
    stateRef.current = {
      step, selectedService, questionnaireData, onboardingId,
      chatMessages, chatSessionId, chatComplete, uploadedFiles,
      completed, leadNotified,
    };
  });

  const persistState = useCallback(() => {
    const s = stateRef.current;
    const contactValues = contactForm.getValues();
    saveToStorage({
      step: s.step,
      selectedService: s.selectedService,
      questionnaireData: s.questionnaireData,
      onboardingId: s.onboardingId,
      chatMessages: s.chatMessages,
      chatSessionId: s.chatSessionId,
      chatComplete: s.chatComplete,
      uploadedFiles: s.uploadedFiles,
      completed: s.completed,
      leadNotified: s.leadNotified,
      contactName: contactValues.name,
      contactEmail: contactValues.email,
      contactPhone: contactValues.phone,
    });
  }, [contactForm]);

  useEffect(() => {
    persistState();
  }, [step, selectedService, questionnaireData, onboardingId, chatMessages, chatSessionId, chatComplete, uploadedFiles, completed, leadNotified, persistState]);

  useEffect(() => {
    const handleBeforeUnload = () => persistState();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [persistState]);

  useEffect(() => {
    const handleVisChange = () => {
      if (document.visibilityState === "hidden") persistState();
    };
    document.addEventListener("visibilitychange", handleVisChange);
    return () => document.removeEventListener("visibilitychange", handleVisChange);
  }, [persistState]);

  const hasShownWelcomeBack = useRef(false);
  useEffect(() => {
    if (hasShownWelcomeBack.current || resumeChoice !== "continue") return;
    hasShownWelcomeBack.current = true;
    if (saved.step && saved.step > 0 && !saved.completed) {
      toast({ title: "ברוכים השבים!", description: "שמרנו את ההתקדמות שלך — אפשר להמשיך מאיפה שהפסקת." });
    }
  }, [resumeChoice, saved.step, saved.completed]);

  useEffect(() => {
    const subscription = contactForm.watch(() => {
      const contactValues = contactForm.getValues();
      saveToStorage({
        contactName: contactValues.name,
        contactEmail: contactValues.email,
        contactPhone: contactValues.phone,
      });
    });
    return () => subscription.unsubscribe();
  }, [contactForm]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (step === 4) {
      setTimeout(() => chatInputRef.current?.focus(), 50);
    }
  }, [chatMessages, chatLoading]);

  const handleResumeContinue = () => setResumeChoice("continue");

  const handleResumeFresh = () => {
    clearStorage();
    setResumeChoice("fresh");
    setStep(0);
    setSelectedService("");
    setQuestionnaireData({});
    setOnboardingId(null);
    setChatMessages([]);
    setChatSessionId(null);
    setChatComplete(false);
    setUploadedFiles([]);
    setCompleted(false);
    setLeadNotified(false);
    contactForm.reset({ name: "", email: "", phone: "" });
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setStep(1);
    saveToStorage({ selectedService: serviceId, step: 1 });
  };

  const handleContactSubmit = async () => {
    const isValid = await contactForm.trigger();
    if (!isValid) return;

    const contactValues = contactForm.getValues();

    if (!leadNotified) {
      setLeadNotified(true);
      try {
        await fetch(API_BASE + "/api/onboarding/lead-notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: contactValues.name,
            email: contactValues.email,
            phone: contactValues.phone ?? "",
            service: selectedService,
          }),
        });
      } catch {
        // Continue to step 2 even if lead-notify fails (e.g. no backend on static host)
      }
    }

    setStep(2);
    saveToStorage({ step: 2, leadNotified: true });
  };

  const handleStartQuestionnaire = () => {
    setStep(3);
    saveToStorage({ step: 3 });
  };

  const handleQuestionnaireSubmit = async () => {
    const questions = getQuestionsForService(selectedService);
    const required = questions.filter(q => q.required);
    const missing = required.filter(q => !questionnaireData[q.key]?.trim());
    if (missing.length > 0) {
      toast({ title: "שדות חובה חסרים", description: `אנא מלא: ${missing.map(q => q.label).join(", ")}`, variant: "destructive" });
      return;
    }

    const contactValues = contactForm.getValues();

    try {
      const response = await fetch(API_BASE + "/api/onboarding/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: contactValues.name,
          email: contactValues.email,
          phone: contactValues.phone,
          service: selectedService,
          questionnaireData,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg =
          typeof data?.message === "string"
            ? data.message
            : response.status === 404
              ? "השירות לא זמין כרגע. אם האתר מונח על Vercel או אירוח סטטי — צריך להריץ גם את השרת (Backend) או לפרוס אותו."
              : "משהו השתבש, נסה שוב";
        toast({ title: "שגיאה", description: msg, variant: "destructive" });
        return;
      }
      const newId = data.id;
      setOnboardingId(newId);
      setStep(4);
      saveToStorage({ step: 4, onboardingId: newId });
      startAiChat(newId);
    } catch (err) {
      const description =
        err instanceof Error && err.message.includes("Failed to fetch")
          ? "אין חיבור לשרת. וודא שהשרת רץ או שהאתר מחובר ל-Backend."
          : "משהו השתבש, נסה שוב";
      toast({ title: "שגיאה", description, variant: "destructive" });
    }
  };

  const startAiChat = async (oid?: number) => {
    const currentId = oid ?? onboardingId;
    setChatLoading(true);
    try {
      const response = await fetch(API_BASE + "/api/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: "שלום, מילאתי את השאלון ואני מוכן להמשיך",
          sessionId: null,
          onboardingId: currentId,
          service: selectedService,
          questionnaireData,
          history: [],
        }),
      });
      let data: { reply?: string; sessionId?: string; message?: string } = {};
      try {
        const text = await response.text();
        if (text) data = JSON.parse(text);
      } catch {
        // non-JSON response
      }
      if (response.ok && data.reply) {
        setChatSessionId(data.sessionId);
        setChatMessages([
          { role: "user", content: "שלום, מילאתי את השאלון ואני מוכן להמשיך" },
          { role: "bot", content: data.reply },
        ]);
      } else {
        const fallback = response.status === 429
          ? "שלום! הסוכן שלנו עמוס כרגע. אנא נסה שוב בעוד כמה רגעים."
          : "שלום! סליחה, הייתה תקלה זמנית. נסה שוב בעוד רגע.";
        setChatMessages([{ role: "bot", content: fallback }]);
      }
    } catch {
      setChatMessages([{ role: "bot", content: "שלום! סליחה, הייתה תקלה זמנית. נסה שוב בעוד רגע." }]);
    }
    setChatLoading(false);
  };

  const sendChatMessage = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || chatLoading) return;

    setChatMessages(prev => [...prev, { role: "user", content: trimmed }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch(API_BASE + "/api/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: trimmed,
          sessionId: chatSessionId,
          onboardingId,
          service: selectedService,
          questionnaireData,
          history: chatMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      let data: { reply?: string; sessionId?: string; isComplete?: boolean; message?: string } = {};
      try {
        const text = await response.text();
        if (text) data = JSON.parse(text);
      } catch {
        // non-JSON response (e.g. 502/504 HTML)
      }

      if (!response.ok) {
        const fallback = response.status === 429
          ? "הסוכן שלנו עמוס כרגע. אנא נסה שוב בעוד כמה רגעים — הפרטים שלך שמורים!"
          : "סליחה, הייתה תקלה זמנית. נסה שוב בעוד רגע.";
        setChatMessages(prev => [...prev, { role: "bot", content: fallback }]);
      } else {
        if (!chatSessionId && data.sessionId) setChatSessionId(data.sessionId);
        setChatMessages(prev => [...prev, { role: "bot", content: data.reply ?? "סליחה, לא התקבלה תשובה. נסה שוב." }]);

        if (data.isComplete) {
          setChatComplete(true);
        }
      }
    } catch {
      setChatMessages(prev => [...prev, { role: "bot", content: "סליחה, הייתה תקלה זמנית. נסה שוב בעוד רגע." }]);
    }
    setChatLoading(false);
  };

  const handleSkipChat = () => {
    setChatComplete(true);
    setStep(5);
    saveToStorage({ chatComplete: true, step: 5 });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !onboardingId) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("onboardingId", String(onboardingId));
    Array.from(files).forEach(f => formData.append("files", f));

    try {
      const response = await fetch(API_BASE + "/api/onboarding/upload", { method: "POST", credentials: "include", body: formData });
      const data = await response.json();
      if (data.files) {
        setUploadedFiles(prev => [...prev, ...data.files]);
        toast({ title: "הקבצים הועלו בהצלחה!" });
      }
    } catch {
      toast({ title: "שגיאה בהעלאה", variant: "destructive" });
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleComplete = async () => {
    if (!onboardingId) return;
    setCompleting(true);
    try {
      const contactValues = contactForm.getValues();
      const chatSummary = chatComplete
        ? chatMessages.map((m) => `${m.role === "user" ? "לקוח" : "סוכן"}: ${m.content}`).join("\n")
        : "";
      await apiRequest("POST", "/api/onboarding/complete", {
        onboardingId,
        name: contactValues.name,
        email: contactValues.email,
        phone: contactValues.phone ?? "",
        service: selectedService,
        questionnaireData,
        chatSummary,
        uploadedFiles,
      });
      setCompleted(true);
      clearStorage();
    } catch {
      toast({ title: "שגיאה", variant: "destructive" });
    }
    setCompleting(false);
  };

  const getStepsRemaining = () => {
    if (step <= 2) return 3;
    if (step === 3) return 2;
    if (step === 4) return 1;
    return 0;
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl" data-testid="page-onboarding">
      <div className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" data-testid="link-back-home">
            <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity select-none">
              <WebSuiteLogo size={40} gradientId="onb" className="w-9 h-9 sm:w-10 sm:h-10" />
              <span
                dir="ltr"
                className="text-lg font-extrabold tracking-tight"
                style={{
                  background: "linear-gradient(135deg, hsl(220 80% 60%), hsl(260 70% 60%), hsl(170 80% 50%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  unicodeBidi: "bidi-override",
                  direction: "ltr",
                }}
              >
                WebSuite
              </span>
            </div>
          </Link>
          <h1 className="text-sm font-semibold text-charcoal-light" data-testid="text-onboarding-title">
            שאלון התאמה לאתר
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!(resumeChoice === null && hasSavedData) && step >= 2 && step <= 5 && !completed && (
          <ProgressBar stepsRemaining={getStepsRemaining()} />
        )}

        <AnimatePresence mode="wait">
          {resumeChoice === null && hasSavedData && (
            <motion.div key="resume-choice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="max-w-lg mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-charcoal mb-3" data-testid="text-resume-title">
                  {t("onboarding.resume.title")}
                </h2>
                <p className="text-charcoal-light leading-relaxed">
                  {t("onboarding.resume.desc")}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleResumeContinue}
                  className="w-full bg-gradient-to-l from-copper to-copper-dark text-white py-6 text-base font-bold rounded-2xl"
                  data-testid="button-resume-continue"
                >
                  {t("onboarding.resume.continue")}
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
                <Button
                  onClick={handleResumeFresh}
                  variant="outline"
                  className="w-full py-6 text-base font-semibold rounded-2xl border-2"
                  data-testid="button-resume-fresh"
                >
                  {t("onboarding.resume.fresh")}
                </Button>
              </div>
            </motion.div>
          )}

          {!(resumeChoice === null && hasSavedData) && step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-charcoal mb-3" data-testid="text-step-title">
                  מה תרצה לבנות?
                </h2>
                <p className="text-charcoal-light">בחר את סוג האתר שמתאים לך ונתחיל</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map((svc) => (
                  <motion.button
                    key={svc.id}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleServiceSelect(svc.id)}
                    className="p-6 rounded-2xl border border-border/60 bg-card hover:border-copper/40 transition-all text-right group"
                    data-testid={`button-service-${svc.id}`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <svc.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-charcoal mb-2">{svc.title}</h3>
                    <p className="text-sm text-charcoal-light">{svc.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {!(resumeChoice === null && hasSavedData) && step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-charcoal mb-3" data-testid="text-step-title">
                  פרטי התקשרות
                </h2>
                <p className="text-charcoal-light">השאר פרטים ונחזור אליך עם הצעה מותאמת</p>
              </div>

              <div className="bg-card rounded-2xl border border-border/60 p-6 max-w-lg mx-auto">
                <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-copper" />
                  פרטי קשר
                </h3>
                <Form {...contactForm}>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField control={contactForm.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>שם מלא *</FormLabel>
                        <FormControl><Input {...field} data-testid="input-contact-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={contactForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>אימייל *</FormLabel>
                        <FormControl><Input type="email" {...field} data-testid="input-contact-email" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={contactForm.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>טלפון <span className="text-red-500">*</span></FormLabel>
                        <FormControl><Input type="tel" placeholder="054-1234567" dir="ltr" {...field} data-testid="input-contact-phone" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </Form>
              </div>

              <div className="flex items-center justify-between mt-6 max-w-lg mx-auto">
                <Button variant="outline" onClick={() => { setStep(0); setSelectedService(""); }} className="min-h-[44px]" data-testid="button-back">
                  <ArrowRight className="w-4 h-4 ml-2" />
                  חזרה
                </Button>
                <Button onClick={handleContactSubmit} className="bg-gradient-to-l from-copper to-copper-dark text-white min-h-[44px]" data-testid="button-submit-contact">
                  המשך
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {!(resumeChoice === null && hasSavedData) && step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="max-w-xl mx-auto text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", damping: 15 }}
                  className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </motion.div>

                <h2 className="text-2xl font-extrabold text-charcoal mb-2" data-testid="text-step-title">
                  מעולה! קיבלנו את פרטי הקשר שלך
                </h2>
                <p className="text-lg text-charcoal-light mb-6 leading-relaxed max-w-md mx-auto">
                  כדי לדלג על שיחות ההכרות ולקבל הצעת מחיר מותאמת תוך 24 שעות — מלא את השאלון הדיגיטלי. זה לוקח פחות מ-2 דקות.
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-card rounded-2xl border-2 border-copper/20 p-6 mb-6 text-right shadow-sm"
                >
                  <h3 className="text-base font-bold text-charcoal mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-copper" />
                    למה כדאי למלא עכשיו?
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: Clock, text: "הצעת מחיר מותאמת תוך 24 שעות — בלי שיחות מיותרות" },
                      { icon: Zap, text: "הצוות שלנו מגיע מוכן עם פתרונות ספציפיים לעסק שלך" },
                      { icon: FileText, text: "שאלון קצר ומדויק — פחות מ-2 דקות" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-xl bg-copper/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4.5 h-4.5 text-copper" />
                        </div>
                        <span className="text-sm text-charcoal leading-snug">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col items-center gap-3"
                >
                  <Button
                    onClick={handleStartQuestionnaire}
                    className="bg-gradient-to-l from-copper to-copper-dark text-white px-10 py-6 text-lg font-bold rounded-2xl shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto"
                    data-testid="button-start-questionnaire"
                  >
                    כן, בואו נתחיל!
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Button>
                  <Link href="/">
                    <Button variant="ghost" className="text-sm text-charcoal-light hover:text-charcoal" data-testid="button-skip-home">
                      לא עכשיו, חזרה לדף הבית
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}

          {!(resumeChoice === null && hasSavedData) && step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-charcoal mb-3" data-testid="text-step-title">
                  ספר לנו על הפרויקט
                </h2>
                <p className="text-charcoal-light">מלא את השאלון וניצור לך הצעה מותאמת</p>
              </div>

              <div className="bg-card rounded-2xl border border-border/60 p-6">
                <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                  {services.find(s => s.id === selectedService)?.icon && (() => {
                    const Icon = services.find(s => s.id === selectedService)!.icon;
                    return <Icon className="w-5 h-5 text-copper" />;
                  })()}
                  פרטי הפרויקט
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {getQuestionsForService(selectedService).map((q) => (
                    <div key={q.key}>
                      <label className="text-sm font-medium text-charcoal mb-1.5 block">
                        {q.label} {q.required && <span className="text-copper">*</span>}
                      </label>
                      {q.type === "textarea" ? (
                        <Textarea
                          value={questionnaireData[q.key] || ""}
                          onChange={(e) => setQuestionnaireData(prev => ({ ...prev, [q.key]: e.target.value }))}
                          className="resize-none"
                          rows={3}
                          data-testid={`input-q-${q.key}`}
                        />
                      ) : (
                        <Input
                          value={questionnaireData[q.key] || ""}
                          onChange={(e) => setQuestionnaireData(prev => ({ ...prev, [q.key]: e.target.value }))}
                          data-testid={`input-q-${q.key}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(2)} data-testid="button-back">
                  <ArrowRight className="w-4 h-4 ml-2" />
                  חזרה
                </Button>
                <Button onClick={handleQuestionnaireSubmit} className="bg-gradient-to-l from-copper to-copper-dark text-white" data-testid="button-next-to-chat">
                  המשך לשיחה עם הסוכן
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {!(resumeChoice === null && hasSavedData) && step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-charcoal mb-2" data-testid="text-step-title">
                  שיחה עם הסוכן AI
                </h2>
                <p className="text-sm text-charcoal-light">הסוכן שלנו ישאל כמה שאלות קצרות כדי להבין את הצרכים שלך</p>
              </div>

              <div className="bg-card rounded-2xl border border-border/60 overflow-hidden flex flex-col" style={{ height: "min(500px, calc(100dvh - 200px))" }}>
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-l from-copper to-copper-dark text-white">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <Smile className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">סוכן AI — WebSuite</h3>
                    <span className="text-[11px] text-white/70">סוכן אפיון מקצועי</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" dir="rtl">
                  {chatMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1 ${
                        msg.role === "user" ? "bg-copper/15 text-copper" : "bg-sage/30 text-foreground/70"
                      }`}>
                        {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>
                      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user" ? "bg-copper text-white rounded-tr-md" : "bg-muted/60 text-foreground rounded-tl-md"
                      }`} data-testid={`chat-message-${msg.role}-${i}`}>
                        {msg.role === "bot" ? formatChatMessage(msg.content) : msg.content}
                      </div>
                    </motion.div>
                  ))}

                  {chatLoading && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-sage/30 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-foreground/70" />
                      </div>
                      <div className="bg-muted/60 rounded-2xl rounded-tl-md px-4 py-3">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="px-3 py-3 border-t border-border/40" dir="rtl">
                  {!chatComplete && (
                    <div className="flex gap-2 items-center">
                      <input
                        ref={chatInputRef}
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                        placeholder="כתוב הודעה..."
                        className="flex-1 bg-muted/40 border border-border/40 rounded-xl px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-copper/30 focus:border-copper/40 transition-all"
                        data-testid="input-chat-message"
                      />
                      <Button onClick={sendChatMessage} disabled={!chatInput.trim() || chatLoading} size="icon" className="rounded-xl bg-copper hover:bg-copper-dark text-white h-10 w-10" data-testid="button-send-chat">
                        <Send className="w-4 h-4 rotate-180" />
                      </Button>
                    </div>
                  )}
                  {chatComplete && (
                    <div className="text-center py-2">
                      <span className="text-sm text-green-600 font-medium flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" />
                        השיחה הושלמה — אפשר להמשיך
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {chatMessages.length >= 2 && !chatComplete && (
                    <Button variant="outline" onClick={handleSkipChat} className="text-sm gap-1" data-testid="button-skip-chat">
                      <SkipForward className="w-4 h-4" />
                      סיום השיחה והמשך
                    </Button>
                  )}
                </div>
                {chatComplete && (
                  <Button onClick={() => setStep(5)} className="bg-gradient-to-l from-copper to-copper-dark text-white mr-auto" data-testid="button-next-to-upload">
                    המשך להעלאת קבצים
                    <ArrowLeft className="w-4 h-4 mr-2" />
                  </Button>
                )}
              </motion.div>
            </motion.div>
          )}

          {!(resumeChoice === null && hasSavedData) && step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-charcoal mb-3" data-testid="text-step-title">
                  העלאת קבצים
                </h2>
                <p className="text-charcoal-light">העלאת לוגו ותמונות היא צעד קריטי למיתוג מקצועי</p>
              </div>

              <div className="bg-card rounded-2xl border border-border/60 p-8">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.ai,.psd,.svg"
                  onChange={handleFileUpload}
                  className="hidden"
                  data-testid="input-file-upload"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full border-2 border-dashed border-border/60 rounded-xl p-10 text-center hover:border-copper/40 transition-colors group"
                  data-testid="button-upload-area"
                >
                  {uploading ? (
                    <Loader2 className="w-10 h-10 mx-auto text-copper animate-spin mb-3" />
                  ) : (
                    <Upload className="w-10 h-10 mx-auto text-charcoal-light group-hover:text-copper transition-colors mb-3" />
                  )}
                  <p className="font-medium text-charcoal mb-1">
                    {uploading ? "מעלה קבצים..." : "לחץ כאן להעלאת קבצים"}
                  </p>
                  <p className="text-xs text-charcoal-light">
                    JPG, PNG, SVG, PDF, AI, PSD — עד 10MB לקובץ
                  </p>
                </button>

                {uploadedFiles.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="text-sm font-semibold text-charcoal mb-3">קבצים שהועלו ({uploadedFiles.length})</h4>
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <FileImage className="w-5 h-5 text-copper flex-shrink-0" />
                        <span className="text-sm text-charcoal truncate flex-1" dir="ltr">{file}</span>
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(4)} data-testid="button-back-to-chat">
                  <ArrowRight className="w-4 h-4 ml-2" />
                  חזרה לשיחה
                </Button>
                <Button onClick={() => setStep(6)} className="bg-gradient-to-l from-copper to-copper-dark text-white" data-testid="button-next-to-summary">
                  המשך לסיכום
                  <ArrowLeft className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {!(resumeChoice === null && hasSavedData) && step === 6 && !completed && (
            <motion.div key="step6" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-charcoal mb-3" data-testid="text-step-title">
                  סיכום ושליחה
                </h2>
                <p className="text-charcoal-light">בדוק את הפרטים ושלח</p>
              </div>

              <div className="bg-card rounded-2xl border border-border/60 p-6 mb-6">
                <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-copper" />
                  פרטי הפרויקט
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <span className="text-charcoal-light block text-xs mb-1">שם</span>
                    <strong data-testid="text-summary-name">{contactForm.getValues("name")}</strong>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <span className="text-charcoal-light block text-xs mb-1">אימייל</span>
                    <strong data-testid="text-summary-email">{contactForm.getValues("email")}</strong>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <span className="text-charcoal-light block text-xs mb-1">שירות</span>
                    <strong className="text-copper" data-testid="text-summary-service">{services.find(s => s.id === selectedService)?.title}</strong>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <span className="text-charcoal-light block text-xs mb-1">קבצים</span>
                      <strong data-testid="text-summary-files">{uploadedFiles.length} קבצים הועלו</strong>
                    </div>
                  )}
                  {chatComplete && (
                    <div className="p-3 bg-green-50 rounded-lg sm:col-span-2">
                      <span className="text-green-700 text-xs flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        שיחת AI הושלמה — הנתונים נשלחו לצוות
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setStep(5)} data-testid="button-back-to-upload">
                  <ArrowRight className="w-4 h-4 ml-2" />
                  חזרה
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={completing}
                  className="bg-gradient-to-l from-copper to-copper-dark text-white gap-2"
                  data-testid="button-complete"
                >
                  {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 rotate-180" />}
                  סיום ושליחה
                </Button>
              </div>
            </motion.div>
          )}

          {!(resumeChoice === null && hasSavedData) && completed && (
            <motion.div key="completed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, delay: 0.2 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg, hsl(160 60% 92%), hsl(170 50% 88%))" }}
              >
                <CheckCircle2 className="w-10 h-10" style={{ color: "hsl(160 55% 42%)" }} />
              </motion.div>
              <h2 className="text-3xl font-extrabold text-charcoal mb-3" data-testid="text-completion-title">
                הפרטים שלכם בדרך אלינו
              </h2>
              <p className="text-charcoal-light mb-2 max-w-md mx-auto leading-relaxed">
                אנחנו כבר מתחילים לעבור על המידע. תקבלו מאיתנו הצעה מותאמת אישית תוך פחות מ-24 שעות.
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <Link href="/">
                  <Button variant="outline" data-testid="button-back-home">
                    <ArrowRight className="w-4 h-4 ml-2" />
                    חזרה לדף הבית
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  data-testid="button-start-over"
                  onClick={() => {
                    clearStorage();
                    setStep(0);
                    setSelectedService("");
                    setQuestionnaireData({});
                    setOnboardingId(null);
                    setChatMessages([]);
                    setChatInput("");
                    setChatSessionId(null);
                    setChatComplete(false);
                    setUploadedFiles([]);
                    setCompleted(false);
                    setLeadNotified(false);
                  }}
                >
                  התחל שאלון חדש
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
