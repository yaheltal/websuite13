# WEB13 - Boutique Web Agency "Market Disruptor" Platform

## Overview
A premium boutique web agency portfolio site with "market disruptor" branding — high-end quality at competitive pricing. Features a premium blue/purple/cyan palette, browser preview modals, parallax scrolling, mouse-tracking floating elements, AI-powered onboarding funnel, GSAP scrollytelling, and full Hebrew RTL support.

## Architecture
- **Frontend**: React + Tailwind CSS + Framer Motion + GSAP/ScrollTrigger + Lenis, multi-page with wouter routing
- **Backend**: Express.js API for contact form, onboarding, AI chat, file uploads, email
- **Database**: PostgreSQL (Neon) via Drizzle ORM
- **AI**: Google Gemini API (gemini-2.5-flash) for intelligent client intake
- **Email**: Nodemailer with Gmail App Password for sending prompt emails
- **Uploads**: Multer for file uploads (logos, brand assets)

## Key Features
- **Boutique Aesthetic**: Deep blues, purples, with cyan/emerald accents; charcoal text on light sections, white text on dark sections
- **RTL Hebrew Support**: Full right-to-left layout with Assistant font
- **Fixed Site Header**: SVG logo with GSAP stroke-draw animation (strokeDasharray reveal), char-level text stagger, 3D tilt on hover, dark gradient backdrop, z-index 999. Logo uses blue/purple/cyan gradient. Clear code comments for future logo replacement
- **Scrollytelling Section**: Cinematic immersive section with deep violet/midnight-blue animated background (glowing orbs, scroll-driven color shifting), 25 floating 3D parallax website mockup cards with: continuous ambient hover animation (GSAP yoyo repeat:-1), depth-of-field blur (back-layer blurred, front sharp, scroll-animated focus transitions), translate3d parallax with z-depth, interactive mouse tracking (cards tilt opposite cursor on desktop), glass glare overlay that sweeps on scroll, scroll-velocity skewY distortion, word-level stagger text reveals, dark glassmorphism text containers with white text
- **Onboarding Funnel**: 7-step flow: Service Selection → Contact Info (lead capture) → Incentive Hook → Questionnaire → AI Chat → File Upload → Summary. Data persisted to sessionStorage (survives page refresh). Skip/finish button available in AI chat step.
- **Early Lead Notification**: When user fills contact info in onboarding step 1, an immediate preliminary email is sent via `/api/onboarding/lead-notify` so you know someone started the process (even if they abandon)
- **AI Sales Agent (Gemini)**: Short, focused sales agent that asks one question at a time, never shows code/prompts to client. Uses <<COLLECTION_COMPLETE>> marker for auto-completion. Skip button available after 2 messages.
- **Email Automation**: Triple-email system with 3-attempt retry logic: 1) Early lead notify when contact info entered, 2) Contact form immediate email, 3) Full onboarding brief. Subject: `[URGENT] New WebSuite Lead - [Name]`. WhatsApp fallback shown on 3x failure. All to WEBSUITE153@GMAIL.COM
- **Browser Preview Modals**: Realistic browser window mockups for each service
- **Scroll Background**: Scattered website mockup thumbnails with parallax depth
- **Floating Nav**: Bottom-centered capsule with "שאלון התאמה" button
- **Contact Form**: Validated with Zod, persisted to PostgreSQL. Redirects to onboarding (no separate email)
- **Responsive**: Mobile, tablet, desktop breakpoints

## Data Model
- `contactSubmissions` table: id, name, email, phone, service, message, createdAt
- `onboardingSubmissions` table: id, name, email, phone, service, questionnaireData (jsonb), chatHistory (jsonb), generatedPrompt, uploadedFiles (text[]), createdAt

## Color Palette
- Copper (primary): hsl(28 60% 48%) — buttons and accents
- Sand: hsl(36 33% 95%) — backgrounds
- Sage: hsl(140 12% 78%) — secondary accents
- Charcoal: hsl(220 15% 18%) — text

## Contact Info
- Phone / WhatsApp: 054-796-6616
- Email: websuite153@gmail.com

## File Structure
```
client/src/
  App.tsx                    - Root component, routing (/, /onboarding)
  pages/
    home.tsx                 - Main landing page composing all sections + Lenis init
    onboarding.tsx           - Multi-step onboarding funnel page
  hooks/
    use-lenis.ts             - Lenis smooth scroll + GSAP ticker integration
  components/
    navigation.tsx           - Floating bottom capsule nav with "שאלון התאמה" button
    hero-section.tsx         - Hero with stats, CTAs, floating shapes
    scrollytelling-section.tsx - GSAP-powered scroll-pinned visual + value prop text blocks
    services-section.tsx     - Three service cards with "View Example" buttons
    contact-section.tsx      - Contact form with validation
    footer.tsx               - Site footer with social links
    browser-preview-modal.tsx - Realistic browser window modal with service mockups
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
client/public/images/
  site-1.png to site-10.png  - Website mockup thumbnails for background
```

## API Endpoints
- `POST /api/contact` - Submit contact form (saves to DB, sends email with 3x retry; returns emailSent/fallback status)
- `GET /api/contacts` - List all submissions
- `POST /api/onboarding/start` - Start onboarding (saves contact + questionnaire data)
- `POST /api/onboarding/chat` - AI chat with Gemini (context-aware)
- `POST /api/onboarding/upload` - Upload brand assets (multer, max 10 files)
- `POST /api/onboarding/complete` - Finalize and send single comprehensive email with prompt

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `GEMINI_API_KEY` - Google Gemini API key for AI chatbot
- `GMAIL_APP_PASSWORD` - Gmail App Password for sending emails
- `SESSION_SECRET` - Session secret

## Email Configuration
- Sends to: WEBSUITE153@GMAIL.COM
- Sends from: WEBSUITE153@GMAIL.COM (via Gmail App Password)
- Uses Nodemailer with Gmail SMTP
- Single email per lead at onboarding completion

## Page Flow (Homepage)
Hero → Scrollytelling → Services → Contact → Footer
