# WebCraft Studio - Professional Web Agency Portfolio

## Overview
A high-end, modern website for a web development agency (WebCraft Studio) offering three main services: Landing Pages, Digital Business Cards, and Full E-commerce Solutions. Built with a luxury dark theme aesthetic with gold and electric blue accents, full Hebrew RTL support.

## Architecture
- **Frontend**: React + Tailwind CSS single-page application with smooth scroll navigation
- **Backend**: Express.js API server for contact form submissions
- **Database**: PostgreSQL (Neon) via Drizzle ORM
- **Animations**: Framer Motion for scroll-triggered animations and page transitions

## Key Features
- **RTL Hebrew Support**: Full right-to-left layout with Heebo font
- **Dark Mode**: Luxury dark theme with gold (#D4AF37) and electric blue (#3B82F6) accents
- **Sections**: Hero, Services (3 cards with interactive previews), Portfolio (filterable gallery), Contact Form
- **Contact Form**: Validated with Zod, persisted to PostgreSQL database
- **Responsive**: Mobile, tablet, and desktop breakpoints
- **Animations**: Scroll-triggered fade-in, hover effects on cards, floating elements

## Data Model
- `contactSubmissions` table: id, name, email, phone, service, message, createdAt

## File Structure
```
client/src/
  App.tsx           - Root component, dark mode initialization, routing
  pages/
    home.tsx        - Main landing page composing all sections
  components/
    navigation.tsx  - Fixed top nav with mobile hamburger menu
    hero-section.tsx - Hero with CTA and animated background
    services-section.tsx - Three service cards with interactive previews
    portfolio-section.tsx - Filterable project gallery
    contact-section.tsx - Contact form with validation
    footer.tsx      - Site footer with social links
server/
  db.ts            - PostgreSQL connection pool
  storage.ts       - Database storage interface
  routes.ts        - API routes (/api/contact, /api/contacts)
shared/
  schema.ts        - Drizzle schema + Zod validation for contacts
```

## API Endpoints
- `POST /api/contact` - Submit a contact form
- `GET /api/contacts` - List all contact submissions

## Design Tokens
- Font: Heebo (Hebrew-optimized)
- Primary: Electric blue (217 91% 50%)
- Accent: Gold (43 74% 49%)
- Background: Dark (225 15% 6%)
- Custom gold color scale in tailwind config
