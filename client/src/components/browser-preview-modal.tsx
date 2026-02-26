import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2, ChevronRight, ChevronLeft, RotateCcw, Lock, Star } from "lucide-react";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  ShoppingCart,
  Heart,
  Search,
  Filter,
  User,
  CreditCard,
  Truck,
  Shield,
  Zap,
  BarChart3,
  Users,
  ArrowLeft,
  Check,
} from "lucide-react";

interface BrowserPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: "landing" | "card" | "ecommerce";
}

const serviceUrls: Record<string, string> = {
  landing: "www.startup-pro.co.il",
  card: "card.daniel-cohen.co.il",
  ecommerce: "shop.luxe-fashion.co.il",
};

const serviceTitles: Record<string, string> = {
  landing: "דף נחיתה - StartUp Pro",
  card: "כרטיס ביקור - דניאל כהן",
  ecommerce: "חנות אונליין - LuxeFashion",
};

function LandingPageMockup() {
  return (
    <div className="min-h-[500px] bg-white text-charcoal" dir="rtl">
      <div className="bg-gradient-to-l from-copper/90 to-copper-dark/90 text-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-sm">StartUp Pro</span>
          <div className="flex gap-4 text-xs">
            <span>ראשי</span>
            <span>שירותים</span>
            <span>אודות</span>
            <span>צור קשר</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-sand to-white px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-copper/10 text-copper-dark px-3 py-1 rounded-full text-[10px] font-semibold mb-4">
            <Zap className="w-3 h-3" />
            פלטפורמת הפינטק המובילה
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-3 leading-tight">
            הגדילו את ההכנסות
            <br />
            <span className="text-copper">ב-300% תוך 90 יום</span>
          </h1>
          <p className="text-charcoal-light text-sm mb-6 max-w-xl mx-auto">
            הצטרפו לאלפי עסקים שכבר משתמשים בפלטפורמה שלנו לניהול פיננסי חכם
          </p>
          <div className="flex items-center justify-center gap-3">
            <button className="bg-copper text-white px-5 py-2 rounded-md text-xs font-bold">
              התחילו בחינם
            </button>
            <button className="border border-charcoal/20 px-5 py-2 rounded-md text-xs font-medium">
              צפו בדמו
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: BarChart3, title: "אנליטיקס מתקדם", desc: "מעקב בזמן אמת" },
            { icon: Shield, title: "אבטחה מקסימלית", desc: "הצפנה מקצה לקצה" },
            { icon: Users, title: "ניהול צוות", desc: "עד 50 משתמשים" },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 rounded-lg bg-sand-light">
              <item.icon className="w-6 h-6 text-copper mx-auto mb-2" />
              <p className="font-bold text-xs mb-1">{item.title}</p>
              <p className="text-[10px] text-charcoal-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-sand-light px-6 py-10 text-center">
        <p className="text-xs text-charcoal-light mb-4">מהימנים על ידי חברות מובילות</p>
        <div className="flex items-center justify-center gap-6">
          {["TechCorp", "FinanceX", "DataPro", "CloudNet"].map((name) => (
            <span key={name} className="text-xs font-bold text-charcoal/30">{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BusinessCardMockup() {
  return (
    <div className="min-h-[500px] bg-gradient-to-b from-sand to-sand-light flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-visible">
          <div className="bg-gradient-to-l from-copper to-copper-dark h-28 relative rounded-t-2xl">
            <div className="absolute -bottom-10 right-1/2 translate-x-1/2">
              <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-copper to-copper-dark flex items-center justify-center text-white text-xl font-bold">
                  דכ
                </div>
              </div>
            </div>
          </div>

          <div className="pt-14 pb-6 px-6 text-center">
            <h2 className="font-extrabold text-lg">דניאל כהן</h2>
            <p className="text-charcoal-light text-xs mb-1">עורך דין | שותף בכיר</p>
            <p className="text-copper text-[10px] font-medium">כהן, לוי ושות׳ - עורכי דין</p>
          </div>

          <div className="px-6 pb-4 space-y-2.5">
            {[
              { icon: Phone, label: "054-987-6543", href: "tel:" },
              { icon: Mail, label: "daniel@cohen-law.co.il", href: "mailto:" },
              { icon: Globe, label: "www.cohen-law.co.il", href: "https://" },
              { icon: MapPin, label: "רח׳ רוטשילד 45, תל אביב", href: "#" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-sand-light/80 text-xs">
                <div className="w-8 h-8 rounded-md bg-copper/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-3.5 h-3.5 text-copper" />
                </div>
                <span className="text-charcoal" dir="ltr">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="px-6 pb-6 flex gap-2">
            <button className="flex-1 bg-copper text-white py-2.5 rounded-lg text-xs font-bold">
              שמור איש קשר
            </button>
            <button className="flex-1 border border-copper/30 text-copper py-2.5 rounded-lg text-xs font-bold">
              שתף כרטיס
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EcommerceMockup() {
  const products = [
    { name: "שעון קלאסי זהב", price: "₪2,490", originalPrice: "₪3,200", rating: 4.8 },
    { name: "תיק עור איטלקי", price: "₪1,890", originalPrice: "₪2,400", rating: 4.9 },
    { name: "משקפי שמש פרימיום", price: "₪690", originalPrice: "₪890", rating: 4.7 },
    { name: "צמיד כסף מעוצב", price: "₪490", originalPrice: "₪650", rating: 4.6 },
    { name: "ארנק עור מינימלי", price: "₪390", originalPrice: "₪520", rating: 4.8 },
    { name: "עגילי פנינה טבעית", price: "₪780", originalPrice: "₪990", rating: 4.9 },
  ];

  return (
    <div className="min-h-[500px] bg-white text-charcoal" dir="rtl">
      <div className="border-b border-sand-dark/50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-extrabold text-sm">
            <span className="text-copper">Luxe</span>Fashion
          </span>
          <div className="flex items-center gap-4 text-xs text-charcoal-light">
            <span>חדש</span>
            <span>נשים</span>
            <span>גברים</span>
            <span>אקססוריז</span>
            <span>מבצעים</span>
          </div>
          <div className="flex items-center gap-3">
            <Search className="w-3.5 h-3.5 text-charcoal-light" />
            <User className="w-3.5 h-3.5 text-charcoal-light" />
            <div className="relative">
              <ShoppingCart className="w-3.5 h-3.5 text-charcoal-light" />
              <span className="absolute -top-1.5 -left-1.5 bg-copper text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">3</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-l from-sand to-sand-light px-4 py-8 text-center">
        <p className="text-[10px] text-copper font-semibold tracking-wide mb-1">קולקציית חורף 2026</p>
        <h2 className="text-xl font-extrabold mb-2">עד 40% הנחה על כל האתר</h2>
        <button className="bg-charcoal text-white px-5 py-2 rounded-md text-xs font-bold">
          קנו עכשיו
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-charcoal-light" />
            <span className="text-xs font-medium">סינון לפי:</span>
            <span className="text-[10px] bg-sand-light px-2 py-1 rounded-md">מחיר</span>
            <span className="text-[10px] bg-sand-light px-2 py-1 rounded-md">קטגוריה</span>
            <span className="text-[10px] bg-sand-light px-2 py-1 rounded-md">מותג</span>
          </div>
          <span className="text-[10px] text-charcoal-light">מציג 6 מוצרים</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {products.map((product, i) => (
            <div key={i} className="group rounded-lg border border-sand-dark/30 bg-white">
              <div className="aspect-[4/5] bg-gradient-to-br from-sand to-sand-light rounded-t-lg relative flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-charcoal/10" />
                <button className="absolute top-2 left-2">
                  <Heart className="w-3.5 h-3.5 text-charcoal/20" />
                </button>
                {i === 0 && (
                  <span className="absolute top-2 right-2 bg-copper text-white text-[8px] px-1.5 py-0.5 rounded font-bold">חדש</span>
                )}
                {i === 2 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold">מבצע</span>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-[10px] font-bold mb-1 truncate">{product.name}</p>
                <div className="flex items-center gap-1 mb-1.5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-2 h-2 text-copper fill-copper" />
                  ))}
                  <span className="text-[8px] text-charcoal-light mr-0.5">{product.rating}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-copper">{product.price}</span>
                  <span className="text-[9px] text-charcoal-light line-through">{product.originalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-sand-dark/30 px-4 py-6">
        <div className="max-w-5xl mx-auto grid grid-cols-4 gap-3 text-center">
          {[
            { icon: Truck, label: "משלוח חינם מעל ₪299" },
            { icon: CreditCard, label: "תשלום מאובטח" },
            { icon: RotateCcw, label: "החזרה עד 30 יום" },
            { icon: Shield, label: "אחריות מלאה" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <item.icon className="w-4 h-4 text-copper" />
              <span className="text-[9px] text-charcoal-light">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const mockups: Record<string, () => JSX.Element> = {
  landing: LandingPageMockup,
  card: BusinessCardMockup,
  ecommerce: EcommerceMockup,
};

export function BrowserPreviewModal({ isOpen, onClose, serviceType }: BrowserPreviewModalProps) {
  const MockupComponent = mockups[serviceType];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
          data-testid="modal-browser-preview"
        >
          <div className="absolute inset-0 bg-charcoal/60 glass-panel" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#e8e4df] rounded-t-xl border border-sand-dark/30 border-b-0">
              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onClose}
                    className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all"
                    data-testid="button-browser-close"
                  />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>

                <div className="flex-1 mx-4 max-w-lg">
                  <div className="flex items-center gap-2 bg-white/80 rounded-md px-3 py-1.5 text-xs">
                    <ChevronRight className="w-3 h-3 text-charcoal/30" />
                    <ChevronLeft className="w-3 h-3 text-charcoal/30" />
                    <RotateCcw className="w-3 h-3 text-charcoal/30" />
                    <div className="flex-1 flex items-center gap-1.5 bg-sand-light/80 rounded px-2 py-0.5">
                      <Lock className="w-2.5 h-2.5 text-green-600" />
                      <span className="text-[11px] text-charcoal/70" dir="ltr" data-testid="text-browser-url">
                        https://{serviceUrls[serviceType]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Minus className="w-3.5 h-3.5 text-charcoal/40" />
                  <Maximize2 className="w-3 h-3 text-charcoal/40" />
                  <button onClick={onClose}>
                    <X className="w-3.5 h-3.5 text-charcoal/40 hover:text-charcoal transition-colors" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-0 px-3 pb-0">
                <div className="bg-white rounded-t-lg px-3 py-1.5 text-[10px] font-medium border border-b-0 border-sand-dark/20 flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-copper/20" />
                  <span>{serviceTitles[serviceType]}</span>
                  <X className="w-2.5 h-2.5 text-charcoal/30 mr-2" />
                </div>
                <div className="bg-sand-dark/10 rounded-t-lg px-3 py-1.5 text-[10px] text-charcoal/40 border border-b-0 border-transparent">
                  + כרטיסיה חדשה
                </div>
              </div>
            </div>

            <div className="bg-white rounded-b-xl border border-sand-dark/30 border-t-0 overflow-y-auto max-h-[calc(85vh-80px)] scrollbar-thin" data-testid="browser-preview-content">
              <MockupComponent />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
