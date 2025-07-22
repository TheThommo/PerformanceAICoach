# Red2Blue AI Mental Performance Platform

## Overview
Red2Blue is a comprehensive AI-powered mental performance coaching platform designed for elite golfers and high performers. The platform helps users transition from "Red Head" (stressed, reactive state) to "Blue Head" (calm, focused performance state) through personalized coaching, assessments, and proven psychological techniques.

## Features
- AI Coach "Flo" with personalized coaching
- Mental performance assessments and tracking
- Stripe-integrated payment tiers ($490 Premium, $2190 Ultimate)
- Comprehensive Red2Blue certification curriculum
- Emergency relief techniques and guided practice sessions

## Technology Stack
- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Google Gemini AI API
- **Payments**: Stripe integration
- **Deployment**: Vercel

## Environment Variables
Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `GEMINI_API_KEY` - Google AI API key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `VITE_STRIPE_PUBLIC_KEY` - Stripe public key
- `SESSION_SECRET` - Session encryption secret

## Local Development
```bash
npm install
npm run dev
```

## Deployment
This app is configured for Vercel deployment with automatic builds.