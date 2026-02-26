# WebCraft Studio - Boutique Web Agency "Market Disruptor" Platform

## Overview
A premium boutique web agency portfolio site with "market disruptor" branding — high-end quality at competitive pricing. Features a warm boutique aesthetic with soft sand/sage/copper palette, browser preview modals, parallax scrolling, mouse-tracking floating elements, and full Hebrew RTL support.

## Architecture
- **Frontend**: React + Tailwind CSS single-page app with Framer Motion animations
- **Backend**: Express.js API for contact form submissions
- **Database**: PostgreSQL (Neon) via Drizzle ORM
- **Animations**: Framer Motion for parallax, scroll-triggered animations, and mouse tracking

## Key Features
- **Boutique Aesthetic**: Soft Sand, Muted Sage, Warm Off-White with Charcoal text and Copper accents
- **RTL Hebrew Support**: Full right-to-left layout with Assistant font
- **Browser Preview Modals**: Realistic browser window mockups for each service (landing page, business card, e-commerce)
- **Mouse-Tracking Elements**: Floating 3D elements that react to cursor position
- **Parallax Scrolling**: Smooth parallax effects on service cards
- **Contact Form**: Validated with Zod, persisted to PostgreSQL
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
    navigation.tsx           - Fixed top nav with mobile hamburger menu
    hero-section.tsx          - Hero with stats, CTAs, floating shapes
    services-section.tsx      - Three service cards with "View Example" buttons
    portfolio-section.tsx     - Filterable project gallery with browser preview
    contact-section.tsx       - Contact form with validation
    footer.tsx               - Site footer with social links
    browser-preview-modal.tsx - Realistic browser window modal with service mockups
    floating-elements.tsx     - Mouse-tracking elements, floating shapes, parallax wrapper
server/
  db.ts                      - PostgreSQL connection pool
  storage.ts                 - Database storage interface
  routes.ts                  - API routes (/api/contact, /api/contacts)
shared/
  schema.ts                  - Drizzle schema + Zod validation for contacts
```

## API Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - List all submissions
