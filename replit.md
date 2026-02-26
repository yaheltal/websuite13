# WebCraft Studio - Boutique Web Agency "Market Disruptor" Platform

## Overview
A premium boutique web agency portfolio site with "market disruptor" branding — high-end quality at competitive pricing. Features a warm boutique aesthetic with soft sand/sage/copper palette, browser preview modals, parallax scrolling, mouse-tracking floating elements, AI chatbot, and full Hebrew RTL support.

## Architecture
- **Frontend**: React + Tailwind CSS single-page app with Framer Motion animations
- **Backend**: Express.js API for contact form submissions + AI chat
- **Database**: PostgreSQL (Neon) via Drizzle ORM
- **AI**: Google Gemini API (gemini-2.5-flash) for client intake chatbot
- **Animations**: Framer Motion for parallax, scroll-triggered animations, and mouse tracking

## Key Features
- **Boutique Aesthetic**: Soft Sand, Muted Sage, Warm Off-White with Charcoal text and Copper accents
- **RTL Hebrew Support**: Full right-to-left layout with Assistant font
- **Browser Preview Modals**: Realistic browser window mockups for each service (landing page, business card, e-commerce)
- **Mouse-Tracking Elements**: Floating 3D elements that react to cursor position
- **Parallax Scrolling**: Smooth parallax effects on service cards
- **Scroll Background**: Scattered website mockup thumbnails with parallax depth across the entire page
- **AI Chat Widget**: Gemini-powered chatbot that interviews clients about their business needs and generates a Replit Agent prompt
- **Contact Form**: Validated with Zod, persisted to PostgreSQL
- **Floating Nav**: Bottom-centered capsule navigation (not standard top bar)
- **Responsive**: Mobile, tablet, desktop breakpoints

## Data Model
- `contactSubmissions` table: id, name, email, phone, service, message, createdAt

## Color Palette
- Copper (primary): hsl(28 60% 48%) — buttons and accents
- Sand: hsl(36 33% 95%) — backgrounds
- Sage: hsl(140 12% 78%) — secondary accents
- Charcoal: hsl(220 15% 18%) — text

## File Structure
```
client/src/
  App.tsx                    - Root component, routing
  pages/
    home.tsx                 - Main landing page composing all sections
  components/
    navigation.tsx           - Floating bottom capsule nav with mobile support
    hero-section.tsx          - Hero with stats, CTAs, floating shapes
    services-section.tsx      - Three service cards with "View Example" buttons
    portfolio-section.tsx     - Filterable project gallery with browser preview
    contact-section.tsx       - Contact form with validation
    footer.tsx               - Site footer with social links
    browser-preview-modal.tsx - Realistic browser window modal with service mockups
    floating-elements.tsx     - Mouse-tracking elements, floating shapes, parallax wrapper
    scroll-background.tsx     - Scattered website thumbnail collage with parallax
    ai-chat-widget.tsx        - AI chatbot floating widget
server/
  db.ts                      - PostgreSQL connection pool
  storage.ts                 - Database storage interface
  routes.ts                  - API routes (/api/contact, /api/contacts, /api/chat)
shared/
  schema.ts                  - Drizzle schema + Zod validation for contacts
client/public/images/
  site-1.png to site-10.png  - Website mockup thumbnails for background
```

## API Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - List all submissions
- `POST /api/chat` - AI chatbot conversation (sessionId-based, uses Gemini)

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `GEMINI_API_KEY` - Google Gemini API key for AI chatbot
- `SESSION_SECRET` - Session secret
