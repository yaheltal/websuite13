# WEB13 - Boutique Web Agency "Market Disruptor" Platform

## Overview
A premium boutique web agency portfolio site with "market disruptor" branding — high-end quality at competitive pricing. Features a warm boutique aesthetic with soft sand/sage/copper palette, browser preview modals, parallax scrolling, mouse-tracking floating elements, AI-powered onboarding funnel, and full Hebrew RTL support.

## Architecture
- **Frontend**: React + Tailwind CSS + Framer Motion, multi-page with wouter routing
- **Backend**: Express.js API for contact form, onboarding, AI chat, file uploads, email
- **Database**: PostgreSQL (Neon) via Drizzle ORM
- **AI**: Google Gemini API (gemini-2.5-flash) for intelligent client intake
- **Email**: Nodemailer with Gmail App Password for sending prompt emails
- **Uploads**: Multer for file uploads (logos, brand assets)

## Key Features
- **Boutique Aesthetic**: Soft Sand, Muted Sage, Warm Off-White with Charcoal text and Copper accents
- **RTL Hebrew Support**: Full right-to-left layout with Assistant font
- **Onboarding Funnel**: 5-step flow: Service Selection → Dynamic Questionnaire → AI Chat → File Upload → Summary/Email
- **AI Sales Agent (Gemini)**: Short, focused sales agent that asks one question at a time, never shows code/prompts to client. Uses <<COLLECTION_COMPLETE>> marker for auto-completion
- **Email Automation**: Auto-sends lead email (contact + questionnaire + chat summary) to WEBSUITE153@GMAIL.COM when AI finishes collecting info
- **Browser Preview Modals**: Realistic browser window mockups for each service
- **Scroll Background**: Scattered website mockup thumbnails with parallax depth
- **Floating Nav**: Bottom-centered capsule with "שאלון התאמה" button
- **Contact Form**: Validated with Zod, persisted to PostgreSQL
- **Responsive**: Mobile, tablet, desktop breakpoints

## Data Model
- `contactSubmissions` table: id, name, email, phone, service, message, createdAt
- `onboardingSubmissions` table: id, name, email, phone, service, questionnaireData (jsonb), chatHistory (jsonb), generatedPrompt, uploadedFiles (text[]), createdAt

## Color Palette
- Copper (primary): hsl(28 60% 48%) — buttons and accents
- Sand: hsl(36 33% 95%) — backgrounds
- Sage: hsl(140 12% 78%) — secondary accents
- Charcoal: hsl(220 15% 18%) — text

## File Structure
```
client/src/
  App.tsx                    - Root component, routing (/, /onboarding)
  pages/
    home.tsx                 - Main landing page composing all sections
    onboarding.tsx           - Multi-step onboarding funnel page
  components/
    navigation.tsx           - Floating bottom capsule nav with "שאלון התאמה" button
    hero-section.tsx         - Hero with stats, CTAs, floating shapes
    services-section.tsx     - Three service cards with "View Example" buttons
    portfolio-section.tsx    - Filterable project gallery with browser preview
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
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - List all submissions
- `POST /api/onboarding/start` - Start onboarding (saves contact + questionnaire data)
- `POST /api/onboarding/chat` - AI chat with Gemini (context-aware)
- `POST /api/onboarding/upload` - Upload brand assets (multer, max 10 files)
- `POST /api/onboarding/complete` - Finalize and send email with prompt

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `GEMINI_API_KEY` - Google Gemini API key for AI chatbot
- `GMAIL_APP_PASSWORD` - Gmail App Password for sending emails
- `SESSION_SECRET` - Session secret

## Email Configuration
- Sends to: WEBSUITE153@GMAIL.COM
- Sends from: WEBSUITE153@GMAIL.COM (via Gmail App Password)
- Uses Nodemailer with Gmail SMTP
