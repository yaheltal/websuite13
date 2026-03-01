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
  Check,
  Share2,
  Linkedin,
  Instagram,
  MessageCircle,
  Play,
  ArrowUpRight,
  Briefcase,
  Award,
  ChevronDown,
} from "lucide-react";

interface BrowserPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: "landing" | "card" | "ecommerce";
}

const serviceUrls: Record<string, string> = {
  landing: "www.nexgen-ai.io",
  card: "v.card/dana-cohen",
  ecommerce: "shop.maison-noir.com",
};

const serviceTitles: Record<string, string> = {
  landing: "NexGen AI — Intelligent Automation",
  card: "Dana Cohen — Digital V-Card",
  ecommerce: "Maison Noir — Luxury Fashion",
};

function LandingPageMockup() {
  return (
    <div className="min-h-[600px] bg-[#060918] text-white" dir="ltr">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 20%, hsla(260, 80%, 35%, 0.4), transparent), radial-gradient(ellipse 60% 40% at 80% 60%, hsla(220, 80%, 30%, 0.3), transparent), radial-gradient(ellipse 50% 50% at 20% 80%, hsla(175, 80%, 25%, 0.2), transparent)",
        }} />

        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full opacity-20" style={{
          background: "radial-gradient(circle, hsl(260, 80%, 60%), transparent 70%)",
          filter: "blur(60px)",
        }} />
        <div className="absolute top-40 right-1/4 w-48 h-48 rounded-full opacity-15" style={{
          background: "radial-gradient(circle, hsl(175, 80%, 50%), transparent 70%)",
          filter: "blur(50px)",
        }} />

        <nav className="relative z-10 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg" style={{ background: "linear-gradient(135deg, hsl(220, 80%, 55%), hsl(260, 70%, 55%))" }} />
            <span className="font-bold text-sm tracking-tight">NexGen AI</span>
          </div>
          <div className="flex items-center gap-5 text-[11px] text-white/60">
            <span className="text-white/90">Platform</span>
            <span>Solutions</span>
            <span>Pricing</span>
            <span>Docs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/50">Login</span>
            <button className="text-[10px] px-3 py-1.5 rounded-full font-bold" style={{ background: "linear-gradient(135deg, hsl(220, 80%, 55%), hsl(260, 70%, 55%))" }}>
              Start Free
            </button>
          </div>
        </nav>

        <div className="relative z-10 text-center px-6 pt-16 pb-20">
          <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/70 px-3 py-1 rounded-full text-[10px] font-medium mb-6 backdrop-blur-sm">
            <Zap className="w-3 h-3 text-cyan-400" />
            Trusted by 2,000+ companies worldwide
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-[1.1] max-w-xl mx-auto">
            Automate
            <span className="mx-2" style={{
              background: "linear-gradient(135deg, hsl(175, 90%, 55%), hsl(220, 85%, 65%), hsl(260, 80%, 65%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Everything</span>
            <br />With Intelligence
          </h1>

          <p className="text-white/50 text-xs mb-8 max-w-md mx-auto leading-relaxed">
            NexGen's AI-powered platform eliminates repetitive workflows, connects your tools, and scales your operations — all on autopilot.
          </p>

          <div className="flex items-center justify-center gap-3 mb-10">
            <button className="text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-lg" style={{
              background: "linear-gradient(135deg, hsl(220, 80%, 55%), hsl(260, 70%, 55%))",
              boxShadow: "0 0 30px hsla(220, 80%, 55%, 0.3)",
            }}>
              Start Free Trial
            </button>
            <button className="flex items-center gap-1.5 border border-white/15 px-5 py-2.5 rounded-lg text-xs font-medium text-white/70 backdrop-blur-sm">
              <Play className="w-3 h-3" /> Watch Demo
            </button>
          </div>

          <div className="max-w-lg mx-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow-2xl" style={{
            boxShadow: "0 0 60px hsla(260, 80%, 50%, 0.08), 0 20px 40px rgba(0,0,0,0.3)",
          }}>
            <div className="flex items-center gap-2 mb-3 text-[10px] text-white/40">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="ml-2">dashboard.nexgen-ai.io</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Tasks Automated", value: "12,847", change: "+24%", color: "hsl(175, 80%, 50%)" },
                { label: "Time Saved", value: "1,209h", change: "+18%", color: "hsl(220, 80%, 60%)" },
                { label: "Revenue Impact", value: "$2.4M", change: "+31%", color: "hsl(260, 70%, 60%)" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-[9px] text-white/40 mb-1">{stat.label}</p>
                  <p className="text-sm font-extrabold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[9px] text-emerald-400 mt-0.5">{stat.change}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 h-16 rounded-lg bg-white/5 border border-white/5 flex items-end px-3 pb-2 gap-1">
              {[40, 55, 35, 65, 50, 75, 60, 80, 70, 90, 85, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-t" style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, hsl(220, 80%, 55%), hsl(260, 70%, 55%))`,
                  opacity: 0.6 + (i / 20),
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-12" style={{ background: "linear-gradient(to bottom, #060918, #0a0f24)" }}>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { icon: Zap, title: "Smart Workflows", desc: "AI learns your patterns and automates repetitive tasks" },
            { icon: Shield, title: "Enterprise Security", desc: "SOC2 Type II certified with end-to-end encryption" },
            { icon: BarChart3, title: "Deep Analytics", desc: "Real-time dashboards with predictive insights" },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{
                background: "linear-gradient(135deg, hsla(220, 80%, 55%, 0.15), hsla(260, 70%, 55%, 0.15))",
              }}>
                <item.icon className="w-4 h-4" style={{ color: "hsl(175, 80%, 55%)" }} />
              </div>
              <p className="font-bold text-[11px] mb-1">{item.title}</p>
              <p className="text-[9px] text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-8 text-center" style={{ background: "#0a0f24" }}>
        <p className="text-[10px] text-white/30 mb-3">Powering the world's best teams</p>
        <div className="flex items-center justify-center gap-8">
          {["Stripe", "Vercel", "Linear", "Notion", "Figma"].map((name) => (
            <span key={name} className="text-[11px] font-bold text-white/15">{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function BusinessCardMockup() {
  const gold = "#b8860b";
  const goldLight = "#d4af37";
  const champagne = "#f7f3eb";
  const charcoal = "#1a1a1a";

  return (
    <div className="min-h-[600px] flex items-center justify-center p-8" dir="ltr" style={{
      background: "#0a0a0a",
    }}>
      {/* כרטיס יוקרה – שמנת, זהב, שחור */}
      <div
        className="w-full max-w-[400px] rounded-[24px] overflow-hidden"
        style={{
          background: champagne,
          boxShadow: "0 0 0 1px rgba(184, 134, 11, 0.2), 0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset",
        }}
      >
        {/* פס עליון שחור קלאסי */}
        <div className="relative h-28 overflow-hidden" style={{ background: charcoal }}>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "linear-gradient(135deg, transparent 0%, rgba(212, 175, 55, 0.15) 100%)",
          }} />
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-14">
            <div
              className="w-28 h-28 rounded-[18px] overflow-hidden"
              style={{
                boxShadow: "0 8px 32px rgba(0,0,0,0.3), 0 0 0 2px " + gold + ", 0 0 0 4px " + champagne,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=224&h=224&fit=crop&crop=face"
                alt="Dana Cohen"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="pt-16 px-6 pb-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3 text-[10px] font-medium tracking-widest uppercase" style={{
              border: "1px solid " + gold,
              color: gold,
              background: "rgba(184, 134, 11, 0.08)",
            }}>
              <Check className="w-3 h-3 shrink-0" /> מאומת
            </div>
            <h2 className="text-[24px] font-semibold tracking-wide" style={{ color: charcoal, letterSpacing: "0.08em" }}>
              Dana Cohen
            </h2>
            <p className="text-[12px] mt-2 tracking-[0.2em] uppercase" style={{ color: "#666" }}>
              CEO & Co-Founder
            </p>
            <p className="text-[13px] font-medium mt-1 tracking-wide" style={{ color: gold }}>
              Vertex Digital Group
            </p>
          </div>

          <div className="my-5 h-px opacity-30" style={{ background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />

          <p className="text-center text-[12px] leading-relaxed px-2" style={{ color: "#555", letterSpacing: "0.02em" }}>
            Building next-gen digital experiences for global brands. 15+ years in tech leadership.
          </p>

          <div className="grid grid-cols-4 gap-2 mb-5">
            {[
              { icon: Phone, label: "התקשר", href: "tel:+972543219876" },
              { icon: Mail, label: "מייל", href: "mailto:dana@vertexdigital.io" },
              { icon: MessageCircle, label: "וואטסאפ", href: "https://wa.me/972543219876", external: true },
              { icon: Share2, label: "שתף", href: "#" },
            ].map((item, i) => {
              const content = (
                <>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 border border-transparent hover:border-current" style={{
                    color: charcoal,
                    background: "rgba(26, 26, 26, 0.06)",
                  }}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium mt-1.5 tracking-wide" style={{ color: "#555" }}>{item.label}</span>
                </>
              );
              const className = "flex flex-col items-center p-2.5 rounded-xl transition-colors duration-200 hover:opacity-90";
              const wrapperStyle = { color: gold };
              return item.href === "#" ? (
                <button key={i} type="button" className={className} style={wrapperStyle}>
                  {content}
                </button>
              ) : (
                <a key={i} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined} className={className} style={wrapperStyle}>
                  {content}
                </a>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {["App Design", "Branding", "UI/UX"].map((label, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-[10px] font-medium tracking-wide uppercase" style={{
                color: gold,
                border: "1px solid " + gold,
                background: "rgba(184, 134, 11, 0.06)",
              }}>
                {label}
              </span>
            ))}
          </div>

          <a
            href="#"
            className="block w-full py-4 rounded-xl text-[12px] font-semibold text-center tracking-[0.2em] uppercase transition-all duration-200 hover:opacity-95 active:scale-[0.99]"
            style={{
              background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
              color: "#1a1a1a",
              boxShadow: "0 2px 8px rgba(184, 134, 11, 0.35), 0 0 0 1px rgba(0,0,0,0.1) inset",
            }}
          >
            שמור את הפרטים שלי
          </a>

          <div className="flex items-center justify-between mt-5 pt-5" style={{ borderTop: "1px solid rgba(184, 134, 11, 0.2)" }}>
            <div className="flex gap-2">
              {[Linkedin, Instagram].map((Icon, i) => (
                <button key={i} type="button" className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80" style={{ background: "rgba(26,26,26,0.06)", color: charcoal }}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2" style={{ color: "#888", fontSize: 10, letterSpacing: "0.1em" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(26,26,26,0.08)" }} aria-hidden="true">
                <div className="grid grid-cols-4 gap-px">
                  {[...Array(16)].map((_, j) => (
                    <div key={j} className="w-1.5 h-1.5 rounded-[1px] opacity-60" style={{ background: charcoal }} />
                  ))}
                </div>
              </div>
              סרוק לשמירה
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EcommerceMockup() {
  const products = [
    { name: "Midnight Velvet Blazer", price: "$1,290", originalPrice: "$1,800", rating: 4.9, tag: "New" },
    { name: "Italian Leather Tote", price: "$890", originalPrice: "$1,200", rating: 4.8, tag: "" },
    { name: "Sapphire Crystal Watch", price: "$2,450", originalPrice: "$3,100", rating: 5.0, tag: "Exclusive" },
    { name: "Silk Cashmere Scarf", price: "$340", originalPrice: "$480", rating: 4.7, tag: "" },
    { name: "Onyx Cufflink Set", price: "$190", originalPrice: "$260", rating: 4.9, tag: "Sale" },
    { name: "Pearl Drop Earrings", price: "$520", originalPrice: "$750", rating: 4.8, tag: "" },
  ];

  return (
    <div className="min-h-[600px] text-white" dir="ltr" style={{ background: "#0a0a0f" }}>
      <div className="border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <span className="font-extrabold text-sm tracking-widest uppercase" style={{
            background: "linear-gradient(135deg, hsl(220, 80%, 70%), hsl(260, 70%, 65%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Maison Noir
          </span>
          <div className="flex items-center gap-5 text-[10px] text-white/40 tracking-wider uppercase">
            <span className="text-white/70">New In</span>
            <span>Women</span>
            <span>Men</span>
            <span>Accessories</span>
            <span>Sale</span>
          </div>
          <div className="flex items-center gap-4">
            <Search className="w-3.5 h-3.5 text-white/30" />
            <User className="w-3.5 h-3.5 text-white/30" />
            <div className="relative">
              <ShoppingCart className="w-3.5 h-3.5 text-white/30" />
              <span className="absolute -top-1.5 -right-1.5 text-[7px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold text-white" style={{ background: "linear-gradient(135deg, hsl(220, 80%, 55%), hsl(260, 70%, 55%))" }}>3</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, hsla(220, 80%, 20%, 0.6), hsla(260, 60%, 15%, 0.6), hsla(220, 70%, 12%, 0.8))",
        }} />
        <div className="absolute top-0 right-0 w-1/2 h-full" style={{
          background: "radial-gradient(ellipse at 70% 50%, hsla(260, 70%, 40%, 0.15), transparent 70%)",
        }} />
        <div className="relative px-6 py-14 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-3 font-medium" style={{ color: "hsl(175, 80%, 55%)" }}>Winter Collection 2026</p>
          <h2 className="text-2xl font-extrabold mb-3 tracking-tight">Up to 40% Off Everything</h2>
          <p className="text-white/30 text-[11px] mb-5 max-w-sm mx-auto">Discover timeless luxury — curated pieces designed for the modern connoisseur</p>
          <button className="text-white px-6 py-2.5 rounded-lg text-[11px] font-bold tracking-wide" style={{
            background: "linear-gradient(135deg, hsl(220, 80%, 55%), hsl(260, 70%, 55%))",
            boxShadow: "0 0 25px hsla(220, 80%, 55%, 0.2)",
          }}>
            Shop the Collection
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Filter className="w-3 h-3 text-white/30" />
            <span className="text-[10px] font-medium text-white/50">Filter:</span>
            {["Price", "Category", "Brand"].map((f) => (
              <span key={f} className="text-[9px] bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-md text-white/40 flex items-center gap-1">
                {f} <ChevronDown className="w-2.5 h-2.5" />
              </span>
            ))}
          </div>
          <span className="text-[9px] text-white/25">6 products</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {products.map((product, i) => (
            <div key={i} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-white/[0.12]">
              <div className="aspect-[4/5] relative flex items-center justify-center" style={{
                background: `linear-gradient(${135 + i * 15}deg, hsla(${220 + i * 10}, 60%, 18%, 1), hsla(${240 + i * 10}, 50%, 12%, 1))`,
              }}>
                <div className="w-14 h-14 rounded-full opacity-20" style={{
                  background: `radial-gradient(circle, hsl(${200 + i * 20}, 70%, 50%), transparent 70%)`,
                }} />
                <button className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <Heart className="w-3 h-3 text-white/40" />
                </button>
                {product.tag && (
                  <span className="absolute top-2.5 left-2.5 text-[8px] px-2 py-0.5 rounded-full font-bold text-white border border-white/10" style={{
                    background: product.tag === "New" ? "linear-gradient(135deg, hsl(220, 80%, 55%), hsl(260, 70%, 55%))" :
                      product.tag === "Exclusive" ? "linear-gradient(135deg, hsl(260, 70%, 50%), hsl(175, 70%, 45%))" :
                      "linear-gradient(135deg, hsl(175, 80%, 40%), hsl(220, 70%, 50%))",
                  }}>
                    {product.tag}
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="w-full py-2 rounded-lg text-[10px] font-bold text-white backdrop-blur-md border border-white/10" style={{
                    background: "hsla(220, 80%, 55%, 0.7)",
                  }}>Quick View</button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-[11px] font-bold mb-1.5 text-white/80 truncate">{product.name}</p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-2 h-2" style={{ color: "hsl(175, 80%, 50%)", fill: s < Math.floor(product.rating) ? "hsl(175, 80%, 50%)" : "transparent" }} />
                  ))}
                  <span className="text-[8px] text-white/30 ml-0.5">{product.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold" style={{
                    background: "linear-gradient(135deg, hsl(175, 80%, 55%), hsl(220, 80%, 65%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>{product.price}</span>
                  <span className="text-[9px] text-white/25 line-through">{product.originalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-5 py-6 mt-2">
        <div className="max-w-5xl mx-auto grid grid-cols-4 gap-3 text-center">
          {[
            { icon: Truck, label: "Free Shipping $100+" },
            { icon: CreditCard, label: "Secure Checkout" },
            { icon: RotateCcw, label: "30-Day Returns" },
            { icon: Shield, label: "Authenticity Guaranteed" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <item.icon className="w-4 h-4" style={{ color: "hsl(220, 70%, 60%)" }} />
              <span className="text-[9px] text-white/30">{item.label}</span>
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-t-xl border border-white/10 border-b-0" style={{ background: "#1a1a2e" }}>
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
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-xs">
                    <ChevronRight className="w-3 h-3 text-white/20" />
                    <ChevronLeft className="w-3 h-3 text-white/20" />
                    <RotateCcw className="w-3 h-3 text-white/20" />
                    <div className="flex-1 flex items-center gap-1.5 bg-white/5 rounded px-2 py-0.5">
                      <Lock className="w-2.5 h-2.5 text-green-400" />
                      <span className="text-[11px] text-white/50" dir="ltr" data-testid="text-browser-url">
                        https://{serviceUrls[serviceType]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Minus className="w-3.5 h-3.5 text-white/20" />
                  <Maximize2 className="w-3 h-3 text-white/20" />
                  <button onClick={onClose}>
                    <X className="w-3.5 h-3.5 text-white/20 hover:text-white/60 transition-colors" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-0 px-3 pb-0">
                <div className="rounded-t-lg px-3 py-1.5 text-[10px] font-medium border border-b-0 border-white/10 flex items-center gap-1.5 bg-white/5 text-white/60">
                  <div className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(135deg, hsl(220, 80%, 55%), hsl(260, 70%, 55%))" }} />
                  <span>{serviceTitles[serviceType]}</span>
                  <X className="w-2.5 h-2.5 text-white/20 ml-2" />
                </div>
                <div className="rounded-t-lg px-3 py-1.5 text-[10px] text-white/20 border border-b-0 border-transparent">
                  + New Tab
                </div>
              </div>
            </div>

            <div className="rounded-b-xl border border-white/10 border-t-0 overflow-y-auto max-h-[calc(85vh-80px)] scrollbar-thin" style={{ background: "#0a0a12" }} data-testid="browser-preview-content">
              <MockupComponent />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
