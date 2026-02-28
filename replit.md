# WebSuite - Boutique Web Agency "Market Disruptor" Platform

## Overview
A premium boutique web agency portfolio site with "market disruptor" branding — high-end quality at competitive pricing. Features a premium blue/purple/cyan palette, browser preview modals, parallax scrolling, mouse-tracking floating elements, AI-powered onboarding funnel, GSAP scrollytelling, bilingual Hebrew/English support with language toggle, and full RTL support.

## Architecture
- **Frontend**: React + Tailwind CSS + Framer Motion + GSAP/ScrollTrigger + Lenis, multi-page with wouter routing
- **Backend**: Express.js API for contact form, onboarding, AI chat, file uploads, email
- **Database**: PostgreSQL (Neon) via Drizzle ORM
- **AI**: Google Gemini API (gemini-2.5-flash) for intelligent client intake
- **Email**: Nodemailer with Gmail App Password for sending prompt emails
- **Uploads**: Multer for file uploads (logos, brand assets)
- **i18n**: Custom React context-based i18n system with Hebrew/English translations

## Key Features
- **Boutique Aesthetic**: Deep blues, purples, with cyan/emerald accents; charcoal text on light sections, white text on dark sections
- **Bilingual Support (i18n)**: Full Hebrew/English translation system via `client/src/lib/i18n.tsx`. Language toggle in site header. Translations cover hero, services, scrollytelling, FAQ, contact, nav, footer sections. Language persisted in localStorage (`websuite_lang`). Document dir dynamically toggles between RTL (Hebrew) and LTR (English).
- **RTL Hebrew Support**: Full right-to-left layout with Assistant font, dynamically switched via i18n
- **Fixed Site Header**: SVG logo with GSAP stroke-draw animation, char-level text stagger, 3D tilt on hover, language toggle button (Globe icon). z-index 999.
- **Scrollytelling Section**: Cinematic immersive section with deep violet/midnight-blue animated background, 25 floating 3D parallax website mockup cards (scale + z-depth animation, brightness modulation, throttled filter updates), glass glare with dynamic intensity, scroll-velocity skewY distortion, cinematic word-level blur-reveal stagger, icon spin entrance (back.out easing), hover glow on glass cards
- **Onboarding Funnel**: 7-step flow: Service Selection → Contact Info → Incentive Hook → Questionnaire → AI Chat → File Upload → Summary. Data persisted to sessionStorage.
- **Early Lead Notification**: When user fills contact info in onboarding step 1, an immediate preliminary email is sent
- **AI Sales Agent (Gemini)**: Short, focused sales agent using <<COLLECTION_COMPLETE>> marker for auto-completion
- **Email Automation**: Triple-email system with 3-attempt retry logic. All to WEBSUITE153@GMAIL.COM
- **Browser Preview Modals**: Realistic browser window mockups for each service
- **FAQ Section**: Glassmorphism accordion with GSAP scroll-triggered stagger reveals
- **Navigation**: Bottom-centered capsule nav with blue/purple active states (updated from copper)
- **Contact Form**: Validated with Zod, persisted to PostgreSQL

## Data Model
- `contactSubmissions` table: id, name, email, phone, service, message, createdAt
- `onboardingSubmissions` table: id, name, email, phone, service, questionnaireData (jsonb), chatHistory (jsonb), generatedPrompt, uploadedFiles (text[]), createdAt

## Color Palette
- Primary gradient: blue hsl(220 80% 55%) → purple hsl(260 70% 55%) → cyan hsl(170 80% 50%)
- Sand: hsl(36 33% 95%) — backgrounds
- Sage: hsl(140 12% 78%) — secondary accents
- Charcoal: hsl(220 15% 18%) — text
- Navigation active: blue/purple (NOT copper/orange)

## Contact Info
- Phone / WhatsApp: 054-796-6616
- Email: websuite153@gmail.com

## File Structure
```
client/src/
  App.tsx                    - Root component, routing (/, /onboarding), I18nProvider wrapper
  lib/
    i18n.tsx                 - i18n system: translations dict, I18nProvider, useI18n hook, t() function
  pages/
    home.tsx                 - Main landing page composing all sections + Lenis init
    onboarding.tsx           - Multi-step onboarding funnel page
  hooks/
    use-lenis.ts             - Lenis smooth scroll + GSAP ticker integration
  components/
    site-header.tsx          - Fixed header with logo, brand name, language toggle
    websuite-logo.tsx        - SVG vector logo component with GSAP animations
    navigation.tsx           - Floating bottom capsule nav with blue/purple active states
    hero-section.tsx         - Hero with stats, CTAs, i18n-aware text
    scrollytelling-section.tsx - GSAP-powered scroll-pinned visual + i18n text blocks
    services-section.tsx     - Three service cards with i18n labels
    faq-section.tsx          - Glassmorphism FAQ accordion with i18n
    contact-section.tsx      - Contact form with i18n labels/placeholders
    footer.tsx               - Site footer with i18n copyright
    browser-preview-modal.tsx - Realistic browser window modal
    floating-elements.tsx    - Mouse-tracking elements, floating shapes, parallax wrapper
    scroll-background.tsx    - Scattered website thumbnail collage with parallax
    ai-chat-widget.tsx       - Floating AI chatbot widget (homepage)
server/
  db.ts                      - PostgreSQL connection pool
  storage.ts                 - Database storage interface (contacts + onboarding)
  routes.ts                  - All API routes
  email.ts                   - Gmail email sending utility (Nodemailer)
shared/
  schema.ts                  - Drizzle schema + Zod validation
```

## API Endpoints
- `POST /api/contact` - Submit contact form (saves to DB, sends email with 3x retry)
- `GET /api/contacts` - List all submissions
- `POST /api/onboarding/start` - Start onboarding
- `POST /api/onboarding/chat` - AI chat with Gemini
- `POST /api/onboarding/upload` - Upload brand assets
- `POST /api/onboarding/complete` - Finalize and send comprehensive email

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `GMAIL_APP_PASSWORD` - Gmail App Password for sending emails
- `SESSION_SECRET` - Session secret

## localStorage Keys
- `websuite_lang` - Language preference ("he" or "en")
- `web13_onboarding` - Onboarding state persistence

## Page Flow (Homepage)
Hero → Scrollytelling → Services → FAQ → Contact → Footer
