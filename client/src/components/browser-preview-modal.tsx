import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Globe,
  ShoppingCart,
  Heart,
  Search,
  User,
  CreditCard,
  Truck,
  Shield,
  Zap,
  Check,
  Share2,
  Linkedin,
  Instagram,
  MessageCircle,
  Play,
  ArrowRight,
  Star,
  Clock,
  Menu,
  Facebook,
  ChevronRight,
  Award,
  Calendar,
  Sparkles,
  Quote,
} from "lucide-react";

interface BrowserPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: "landing" | "card" | "ecommerce";
}

/* ═══════════════════════════════════════════════════════════
   1. LANDING PAGE — "Maya Pilates" — מורה לפילאטיס
   צבעים: ורוד-סגול רך, לבן, קרם
   ═══════════════════════════════════════════════════════════ */
function LandingPageMockup() {
  const accent = "#9b6b9e";
  const accentLight = "#c99bcc";
  const soft = "#f8f4f9";
  const warmBg = "#fdfbfe";

  return (
    <div className="min-h-[600px]" dir="ltr" style={{ background: warmBg, color: "#2d2535" }}>
      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#f0e8f2" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accent}, ${accentLight})` }}>
            <span className="text-white text-xs font-extrabold">M</span>
          </div>
          <span className="font-bold text-[14px] tracking-tight" style={{ color: "#2d2535" }}>Maya Pilates</span>
        </div>
        <div className="flex items-center gap-6 text-[11px]" style={{ color: "#8a7a8e" }}>
          <span style={{ color: accent, fontWeight: 600 }}>Home</span>
          <span>About</span>
          <span>Classes</span>
          <span>Schedule</span>
          <span>Testimonials</span>
        </div>
        <button className="text-[11px] px-5 py-2 rounded-full font-bold text-white" style={{ background: `linear-gradient(135deg, ${accent}, ${accentLight})` }}>
          Book a Class
        </button>
      </nav>

      {/* ── Hero ── */}
      <div className="grid grid-cols-2 gap-6 px-8 py-14 items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium mb-5" style={{ background: soft, color: accent, border: `1px solid ${accentLight}40` }}>
            <Sparkles className="w-3 h-3" />
            Private & Group Sessions Available
          </div>
          <h1 className="text-4xl font-extrabold mb-4 leading-[1.1]" style={{ color: "#2d2535" }}>
            Transform Your<br />
            <span style={{ color: accent }}>Body & Mind</span><br />
            With Pilates
          </h1>
          <p className="text-[12px] mb-6 leading-relaxed max-w-sm" style={{ color: "#8a7a8e" }}>
            Personalized Pilates training in a boutique studio setting. Build strength, improve flexibility, and find your inner balance with certified instructor Maya Levy.
          </p>
          <div className="flex items-center gap-3 mb-8">
            <button className="px-6 py-3 rounded-xl text-[11px] font-bold text-white flex items-center gap-2" style={{ background: `linear-gradient(135deg, ${accent}, ${accentLight})`, boxShadow: `0 8px 24px ${accent}30` }}>
              Start Your Journey <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-1.5 px-5 py-3 rounded-xl text-[11px] font-medium" style={{ border: `1.5px solid ${accentLight}60`, color: accent }}>
              <Play className="w-3 h-3" /> Watch Intro
            </button>
          </div>
          <div className="flex items-center gap-5">
            {[
              { val: "500+", label: "Students" },
              { val: "8 yrs", label: "Experience" },
              { val: "4.9", label: "Rating", star: true },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-lg font-extrabold flex items-center gap-0.5" style={{ color: accent }}>
                  {s.val}
                  {s.star && <Star className="w-3 h-3 inline" style={{ fill: accent, color: accent }} />}
                </p>
                <p className="text-[9px]" style={{ color: "#a99cad" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden aspect-[3/4]" style={{
            boxShadow: `0 20px 60px ${accent}15, 0 8px 24px rgba(0,0,0,0.06)`,
          }}>
            <img
              src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=450&h=600&fit=crop"
              alt="Pilates session"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-3 -left-3 rounded-2xl p-4 backdrop-blur-sm border shadow-lg" style={{ background: "rgba(255,255,255,0.95)", borderColor: "#f0e8f2" }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <div>
                <p className="text-[10px] font-bold" style={{ color: "#2d2535" }}>Join 500+ students</p>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5" style={{ color: "#f5a623", fill: "#f5a623" }} />)}
                  <span className="text-[9px] ml-1" style={{ color: "#a99cad" }}>4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Services ── */}
      <div className="px-8 py-10" style={{ background: soft }}>
        <p className="text-center text-[10px] tracking-[0.25em] uppercase mb-2 font-semibold" style={{ color: accent }}>What I Offer</p>
        <h2 className="text-center text-xl font-extrabold mb-8" style={{ color: "#2d2535" }}>Classes & Programs</h2>
        <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
          {[
            { title: "Private Sessions", desc: "One-on-one personalized training tailored to your goals", icon: User, price: "₪250/session" },
            { title: "Group Classes", desc: "Small groups of 6-8 for focused attention and fun", icon: Globe, price: "₪80/class" },
            { title: "Online Program", desc: "8-week guided video program, train from anywhere", icon: Play, price: "₪399" },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl p-5 text-center border" style={{ background: "white", borderColor: "#f0e8f2", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${accent}12` }}>
                <item.icon className="w-5 h-5" style={{ color: accent }} />
              </div>
              <p className="font-bold text-[12px] mb-1" style={{ color: "#2d2535" }}>{item.title}</p>
              <p className="text-[10px] leading-relaxed mb-3" style={{ color: "#8a7a8e" }}>{item.desc}</p>
              <p className="text-[11px] font-extrabold" style={{ color: accent }}>{item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Testimonial ── */}
      <div className="px-8 py-10 text-center">
        <Quote className="w-8 h-8 mx-auto mb-3" style={{ color: accentLight }} />
        <p className="text-[13px] italic max-w-md mx-auto leading-relaxed mb-4" style={{ color: "#5a4d60" }}>
          "Maya completely changed how I feel in my body. After 3 months of private sessions, my back pain is gone and I feel stronger than ever."
        </p>
        <div className="flex items-center justify-center gap-2">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=36&h=36&fit=crop&crop=face" alt="" className="w-8 h-8 rounded-full object-cover" />
          <div className="text-left">
            <p className="text-[11px] font-bold" style={{ color: "#2d2535" }}>Noa Levi</p>
            <p className="text-[9px]" style={{ color: "#a99cad" }}>Marketing Director</p>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-8 py-6 border-t grid grid-cols-4 gap-3 text-center" style={{ borderColor: "#f0e8f2", background: soft }}>
        {[
          { icon: MapPin, label: "Dizengoff 120", sub: "Tel Aviv" },
          { icon: Phone, label: "054-321-9876", sub: "Call / WhatsApp" },
          { icon: Calendar, label: "Sun-Thu", sub: "07:00 – 21:00" },
          { icon: Instagram, label: "@maya.pilates", sub: "2.5K Followers" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <item.icon className="w-4 h-4" style={{ color: accent }} />
            <p className="text-[10px] font-bold" style={{ color: "#2d2535" }}>{item.label}</p>
            <p className="text-[9px]" style={{ color: "#a99cad" }}>{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. BUSINESS CARD — "Noa Dahan" — מעצבת פנים
   צבעים: חמים — קורל, אפרסק, שמנת
   ═══════════════════════════════════════════════════════════ */
function BusinessCardMockup() {
  const coral = "#d4756b";
  const coralDeep = "#c25d52";
  const peach = "#f0b8a8";
  const warm = "#fdf5f2";
  const darkText = "#3a2c2a";

  return (
    <div className="min-h-[600px] flex items-center justify-center p-8" dir="ltr" style={{ background: `linear-gradient(145deg, ${warm}, #fef8f5, ${warm})` }}>
      <div
        className="w-full max-w-[400px] rounded-[28px] overflow-hidden"
        style={{
          background: "white",
          boxShadow: "0 25px 60px rgba(180,120,100,0.12), 0 8px 24px rgba(0,0,0,0.05)",
        }}
      >
        {/* Big face photo header */}
        <div className="relative h-56 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=350&fit=crop&crop=face&facepad=2.5"
            alt="Noa Dahan"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to bottom, transparent 40%, ${warm} 100%)`,
          }} />
          {/* Verified badge on photo */}
          <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm" style={{
            background: "rgba(255,255,255,0.85)",
            color: coralDeep,
            border: `1px solid ${peach}`,
          }}>
            <Check className="w-3 h-3" /> מאומתת
          </div>
        </div>

        <div className="px-6 pb-6 -mt-4 relative">
          <div className="text-center">
            <h2 className="text-[24px] font-bold tracking-tight" style={{ color: darkText }}>
              Noa Dahan
            </h2>
            <p className="text-[13px] mt-1 font-medium" style={{ color: coral }}>
              Interior Designer
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "#9a8583" }}>
              Dahan Design Studio · Tel Aviv
            </p>
          </div>

          <div className="my-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${peach}80, transparent)` }} />

          <p className="text-center text-[11px] leading-relaxed px-2" style={{ color: "#7a6563" }}>
            Creating warm, elegant spaces that feel like home. Specializing in residential design, renovations, and boutique hospitality projects.
          </p>

          {/* Action buttons */}
          <div className="grid grid-cols-4 gap-2 my-5">
            {[
              { icon: Phone, label: "התקשרי" },
              { icon: Mail, label: "מייל" },
              { icon: MessageCircle, label: "וואטסאפ" },
              { icon: Share2, label: "שתפי" },
            ].map((item, i) => (
              <button key={i} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-colors" style={{ background: `${peach}20` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{
                  background: `linear-gradient(135deg, ${coralDeep}, ${coral})`,
                  boxShadow: `0 4px 14px ${coral}30`,
                }}>
                  <item.icon className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-[9px] font-medium" style={{ color: "#7a6563" }}>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Info items */}
          <div className="space-y-2 mb-5">
            {[
              { icon: MapPin, text: "דיזנגוף 200, תל אביב" },
              { icon: Globe, text: "www.dahan-design.co.il" },
              { icon: Calendar, text: "קבעו פגישת ייעוץ חינם" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: `${peach}12` }}>
                <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: coral }} />
                <span className="text-[11px]" style={{ color: "#7a6563" }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Portfolio samples */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=200&fit=crop",
              "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&h=200&fit=crop",
              "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=200&h=200&fit=crop",
            ].map((src, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Save contact CTA */}
          <button
            className="block w-full py-3.5 rounded-xl text-[12px] font-bold text-center tracking-wide text-white"
            style={{
              background: `linear-gradient(135deg, ${coralDeep}, ${coral})`,
              boxShadow: `0 8px 24px ${coral}30`,
            }}
          >
            שמרו את הפרטים שלי
          </button>

          <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: `1px solid ${peach}30` }}>
            <div className="flex gap-2">
              {[Linkedin, Instagram].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${peach}20`, color: coral }}>
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
            <p className="text-[9px]" style={{ color: "#c0a8a5" }}>Powered by WebSuite</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. E-COMMERCE — "MOMENTUM" — חנות ספורט בסגנון Apple
   צבעים: לבן נקי, שחור, כחול בהיר
   אינטראקטיבי: הוספה לסל, עגלה, צ'קאאוט דמו
   ═══════════════════════════════════════════════════════════ */
const PRODUCTS = [
  { id: 1, name: "Air Pro Running Shoes", price: 549, originalPrice: 749, rating: 4.9, tag: "Bestseller", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop" },
  { id: 2, name: "Elite Training Mat", price: 189, originalPrice: 259, rating: 4.8, tag: "New", img: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400&h=400&fit=crop" },
  { id: 3, name: "Flex Resistance Bands", price: 129, originalPrice: 179, rating: 4.7, tag: "", img: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop" },
  { id: 4, name: "Carbon Fiber Water Bottle", price: 89, originalPrice: 129, rating: 4.9, tag: "Popular", img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop" },
  { id: 5, name: "Pro Wireless Earbuds", price: 349, originalPrice: 449, rating: 4.8, tag: "", img: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop" },
  { id: 6, name: "Compression Tights", price: 219, originalPrice: 289, rating: 4.6, tag: "Sale", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop" },
];

type CartItem = { id: number; qty: number };
type ShopView = "shop" | "cart" | "checkout";

function EcommerceMockup() {
  const accent = "#0071e3";
  const darkText = "#1d1d1f";
  const grayText = "#86868b";
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, setView] = useState<ShopView>("shop");
  const [addedId, setAddedId] = useState<number | null>(null);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => {
    const p = PRODUCTS.find(pr => pr.id === c.id);
    return s + (p ? p.price * c.qty : 0);
  }, 0);

  const addToCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing) return prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id, qty: 1 }];
    });
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newQty = c.qty + delta;
      return newQty <= 0 ? c : { ...c, qty: newQty };
    }).filter(c => c.qty > 0));
  };

  /* ── Checkout Screen ── */
  if (view === "checkout") {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-8" dir="ltr" style={{ background: "#fbfbfd", color: darkText }}>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: `${accent}12` }}>
            <ShoppingCart className="w-8 h-8" style={{ color: accent }} />
          </div>
          <h2 className="text-2xl font-extrabold mb-3" style={{ color: darkText }}>This is a Demo Store</h2>
          <p className="text-[13px] leading-relaxed mb-2" style={{ color: grayText }}>
            You've reached the checkout page! In a real store built by <strong style={{ color: accent }}>WebSuite</strong>, this is where customers would complete their purchase.
          </p>
          <div className="rounded-2xl p-5 my-6 text-left" style={{ background: "#f5f5f7", border: "1px solid #e8e8ed" }}>
            <p className="text-[11px] font-semibold mb-3" style={{ color: darkText }}>Your Cart Summary:</p>
            {cart.map(item => {
              const p = PRODUCTS.find(pr => pr.id === item.id);
              if (!p) return null;
              return (
                <div key={item.id} className="flex items-center justify-between py-1.5 text-[11px]">
                  <span style={{ color: darkText }}>{p.name} x{item.qty}</span>
                  <span className="font-bold" style={{ color: darkText }}>₪{p.price * item.qty}</span>
                </div>
              );
            })}
            <div className="border-t mt-3 pt-3 flex items-center justify-between text-[13px] font-extrabold" style={{ borderColor: "#e0e0e0" }}>
              <span>Total</span>
              <span style={{ color: accent }}>₪{cartTotal}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setView("shop")} className="px-6 py-2.5 rounded-full text-[12px] font-semibold" style={{ color: accent, border: `1.5px solid ${accent}` }}>
              Back to Shop
            </button>
            <button onClick={() => { setCart([]); setView("shop"); }} className="px-6 py-2.5 rounded-full text-[12px] font-semibold text-white" style={{ background: accent }}>
              Start Fresh
            </button>
          </div>
          <p className="text-[10px] mt-6" style={{ color: "#c0c0c0" }}>
            Interested in a store like this? Contact WebSuite to get started.
          </p>
        </div>
      </div>
    );
  }

  /* ── Cart Screen ── */
  if (view === "cart") {
    return (
      <div className="min-h-[600px]" dir="ltr" style={{ background: "#fbfbfd", color: darkText }}>
        <nav className="flex items-center justify-between px-8 py-3 sticky top-0 z-10" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid #f0f0f0" }}>
          <button onClick={() => setView("shop")} className="text-[12px] font-semibold flex items-center gap-1" style={{ color: accent }}>
            ← Continue Shopping
          </button>
          <span className="font-extrabold text-[16px]" style={{ color: darkText }}>MOMENTUM</span>
          <div className="w-20" />
        </nav>

        <div className="px-8 py-8 max-w-lg mx-auto">
          <h2 className="text-xl font-extrabold mb-6" style={{ color: darkText }}>
            Shopping Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
          </h2>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4" style={{ color: "#d0d0d0" }} />
              <p className="text-[13px]" style={{ color: grayText }}>Your cart is empty</p>
              <button onClick={() => setView("shop")} className="mt-4 px-6 py-2.5 rounded-full text-[12px] font-semibold text-white" style={{ background: accent }}>
                Browse Products
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map(item => {
                  const p = PRODUCTS.find(pr => pr.id === item.id);
                  if (!p) return null;
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border" style={{ borderColor: "#f0f0f0", background: "white" }}>
                      <img src={p.img} alt={p.name} className="w-20 h-20 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold truncate" style={{ color: darkText }}>{p.name}</p>
                        <p className="text-[13px] font-extrabold mt-1" style={{ color: darkText }}>₪{p.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full flex items-center justify-center text-[14px] font-bold" style={{ background: "#f5f5f7", color: darkText }}>−</button>
                        <span className="text-[12px] font-bold w-5 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full flex items-center justify-center text-[14px] font-bold" style={{ background: "#f5f5f7", color: darkText }}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-medium ml-2" style={{ color: "#ff3b30" }}>Remove</button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-5 rounded-2xl" style={{ background: "#f5f5f7" }}>
                <div className="flex items-center justify-between mb-2 text-[12px]" style={{ color: grayText }}>
                  <span>Subtotal</span>
                  <span>₪{cartTotal}</span>
                </div>
                <div className="flex items-center justify-between mb-2 text-[12px]" style={{ color: grayText }}>
                  <span>Shipping</span>
                  <span style={{ color: "#34c759" }}>{cartTotal >= 299 ? "Free" : "₪29"}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex items-center justify-between text-[15px] font-extrabold" style={{ borderColor: "#e0e0e0" }}>
                  <span>Total</span>
                  <span style={{ color: accent }}>₪{cartTotal + (cartTotal >= 299 ? 0 : 29)}</span>
                </div>
              </div>

              <button onClick={() => setView("checkout")} className="w-full mt-5 py-3.5 rounded-full text-[13px] font-bold text-white" style={{ background: accent }}>
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ── Shop View ── */
  return (
    <div className="min-h-[600px]" dir="ltr" style={{ background: "#fbfbfd", color: darkText }}>
      {/* ── Nav — Apple style ── */}
      <nav className="flex items-center justify-between px-8 py-3 sticky top-0 z-10" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid #f0f0f0" }}>
        <span className="font-extrabold text-[16px] tracking-tight" style={{ color: darkText }}>
          MOMENTUM
        </span>
        <div className="flex items-center gap-7 text-[11px] font-medium" style={{ color: grayText }}>
          <span style={{ color: darkText }}>New</span>
          <span>Men</span>
          <span>Women</span>
          <span>Equipment</span>
          <span>Sale</span>
        </div>
        <div className="flex items-center gap-4">
          <Search className="w-4 h-4" style={{ color: grayText }} />
          <User className="w-4 h-4" style={{ color: grayText }} />
          <button onClick={() => setView("cart")} className="relative">
            <ShoppingCart className="w-4 h-4" style={{ color: cartCount > 0 ? accent : grayText }} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold text-white animate-pulse" style={{ background: accent }}>{cartCount}</span>
            )}
          </button>
        </div>
      </nav>

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f5f5f7, #e8e8ed, #f5f5f7)" }}>
        <div className="grid grid-cols-2 items-center px-8 py-14">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase font-semibold mb-3" style={{ color: accent }}>Spring Collection 2026</p>
            <h1 className="text-4xl font-extrabold leading-[1.05] mb-4" style={{ color: darkText }}>
              Push Your<br />
              Limits.<br />
              <span style={{ color: accent }}>Every Day.</span>
            </h1>
            <p className="text-[12px] mb-6 max-w-xs leading-relaxed" style={{ color: grayText }}>
              Professional-grade sports equipment designed for athletes who never settle. Free shipping on orders over ₪299.
            </p>
            <div className="flex items-center gap-3">
              <button className="px-7 py-3 rounded-full text-[12px] font-semibold text-white" style={{ background: accent }}>
                Shop Now
              </button>
              <button className="px-7 py-3 rounded-full text-[12px] font-semibold" style={{ color: accent, border: `1.5px solid ${accent}` }}>
                Learn More
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=350&fit=crop"
              alt="Running shoe"
              className="w-[90%] object-contain"
              style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))" }}
            />
          </div>
        </div>
      </div>

      {/* ── Trusted bar ── */}
      <div className="px-8 py-4 flex items-center justify-center gap-10 border-b" style={{ borderColor: "#f0f0f0" }}>
        {[
          { icon: Truck, text: "Free Shipping ₪299+" },
          { icon: Shield, text: "30-Day Returns" },
          { icon: CreditCard, text: "Secure Payment" },
          { icon: Zap, text: "Express Delivery" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <item.icon className="w-3.5 h-3.5" style={{ color: accent }} />
            <span className="text-[10px] font-medium" style={{ color: grayText }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* ── Products Grid ── */}
      <div className="px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: darkText }}>Featured Products</h2>
            <p className="text-[11px] mt-0.5" style={{ color: grayText }}>Handpicked for you</p>
          </div>
          {cartCount > 0 && (
            <button onClick={() => setView("cart")} className="text-[11px] font-semibold flex items-center gap-1.5 px-4 py-2 rounded-full" style={{ color: "white", background: accent }}>
              <ShoppingCart className="w-3.5 h-3.5" /> View Cart ({cartCount})
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {PRODUCTS.map((product) => {
            const inCart = cart.find(c => c.id === product.id);
            const justAdded = addedId === product.id;
            return (
              <div key={product.id} className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg" style={{ borderColor: "#f0f0f0", background: "white" }}>
                <div className="aspect-square relative overflow-hidden" style={{ background: "#f5f5f7" }}>
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                    <Heart className="w-3.5 h-3.5" style={{ color: grayText }} />
                  </button>
                  {product.tag && (
                    <span className="absolute top-3 left-3 text-[9px] px-2.5 py-1 rounded-full font-semibold text-white" style={{
                      background: product.tag === "Bestseller" ? accent :
                        product.tag === "New" ? "#34c759" :
                        product.tag === "Sale" ? "#ff3b30" :
                        "#ff9500",
                    }}>
                      {product.tag}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[12px] font-semibold mb-1.5 truncate" style={{ color: darkText }}>{product.name}</p>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="w-2.5 h-2.5" style={{ color: "#ff9500", fill: s < Math.floor(product.rating) ? "#ff9500" : "transparent" }} />
                    ))}
                    <span className="text-[9px] ml-0.5" style={{ color: grayText }}>{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-extrabold" style={{ color: darkText }}>₪{product.price}</span>
                      <span className="text-[10px] line-through" style={{ color: "#c0c0c0" }}>₪{product.originalPrice}</span>
                    </div>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[14px] font-bold transition-all duration-200 hover:scale-110 active:scale-95"
                      style={{
                        background: justAdded ? "#34c759" : inCart ? accent : "#e8e8ed",
                        color: justAdded ? "white" : inCart ? "white" : darkText,
                      }}
                    >
                      {justAdded ? "✓" : "+"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Floating cart bar ── */}
      {cartCount > 0 && (
        <div className="sticky bottom-0 px-8 py-4" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(10px)", borderTop: "1px solid #f0f0f0" }}>
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div>
              <p className="text-[12px] font-bold" style={{ color: darkText }}>{cartCount} items in cart</p>
              <p className="text-[11px]" style={{ color: grayText }}>Total: <strong style={{ color: accent }}>₪{cartTotal}</strong></p>
            </div>
            <button onClick={() => setView("cart")} className="px-6 py-2.5 rounded-full text-[12px] font-bold text-white" style={{ background: accent }}>
              Go to Cart →
            </button>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="px-8 py-5 border-t text-center" style={{ borderColor: "#f0f0f0" }}>
        <p className="text-[10px]" style={{ color: "#c0c0c0" }}>© 2026 MOMENTUM Sports — All rights reserved</p>
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
              data-testid="button-browser-close"
            >
              <X className="w-4 h-4 text-white/80" />
            </button>

            {/* Clean product preview */}
            <div className="overflow-y-auto max-h-[85vh] scrollbar-thin" data-testid="browser-preview-content">
              <MockupComponent />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
