# CropIQ 2.0 Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    CropIQ 2.0 Frontend                   │
│              Next.js 14 (App Router) + React 18          │
├───────────┬──────────┬──────────┬──────────┬────────────┤
│  Landing  │Dashboard │ Features │   AI     │  Shared    │
│  Page     │          │  Pages   │  Pages   │ Components │
├───────────┴──────────┴──────────┴──────────┴────────────┤
│                   Next.js API Routes                     │
│  /api/chat  /api/crop-scan  /api/irrigation              │
│  /api/market-forecast  /api/scheme-recommend /api/yield  │
│  /api/chat/translate                                     │
├──────────────────────────────────────────────────────────┤
│              External Services                           │
│  Google Gemini API │ Wolfram Alpha │ Backend (Render)    │
│  Web Speech API    │ Open-Meteo    │ MongoDB Atlas       │
└──────────────────────────────────────────────────────────┘
```

## Directory Structure

```
app/
├── api/
│   ├── chat/
│   │   ├── route.js          # KisaanBot 2.0 chat API
│   │   └── translate/
│   │       └── route.js      # Translation API
│   ├── crop-scan/
│   │   └── route.js          # AI disease detection
│   ├── irrigation/
│   │   └── route.js          # Smart irrigation engine
│   ├── market-forecast/
│   │   └── route.js          # Price forecasting
│   └── scheme-recommend/
│       └── route.js          # Scheme matcher
├── components/
│   ├── ChatMessage.js        # Reusable chat message
│   ├── ConfidenceGauge.js    # Animated confidence gauge
│   ├── CropHealthScore.js    # Crop health indicator
│   ├── DiseaseHeatmap.js     # Leaf disease overlay
│   ├── PageLoader.js         # Page transition loader
│   ├── PWAInstallPrompt.js   # PWA install prompt
│   ├── SOSButton.js          # Emergency SOS button
│   ├── TranslationWidget.js  # Google Translate widget
│   ├── VoiceAssistant.js     # Multilingual voice assistant
│   ├── VoiceNavigation.js    # Legacy voice nav (deprecated)
│   └── WhatsAppShare.js      # WhatsApp sharing
├── lib/
│   ├── api.js                # Backend API functions
│   └── voiceCommands.js      # Voice command parser
├── analytics/                # Market analytics page
├── chatbot/                  # AI chatbot page
├── community/                # Community forum
├── crop-doctor/              # AI crop diagnosis
├── dashboard/                # Main dashboard
├── debt-fund/                # Crowdfunded debt relief
├── farmer-analytics/         # Farm analytics charts
├── farmer-orders/            # Order management
├── irrigation/               # Smart irrigation advisor
├── knowledge/                # Video academy
├── loan-tracker/             # Loan management
├── login/                    # Authentication
├── market/                   # Direct market
├── market-forecast/          # Price forecasting
├── offline/                  # Offline mode
├── profile/                  # User profile
├── schemes/                  # Government schemes
├── weather/                  # Weather & crop impact
├── globals.css
├── layout.js                 # Root layout
└── page.js                   # Landing page
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chat` | POST | KisaanBot multilingual chat |
| `/api/chat/translate` | POST | Text translation |
| `/api/crop-scan` | POST | AI crop disease detection |
| `/api/irrigation` | POST | Irrigation recommendations |
| `/api/market-forecast` | POST | Price forecasting |
| `/api/scheme-recommend` | POST | Scheme matching |
| `/api/yield` | POST | Wolfram-powered Yield & Fertilizer computations |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS 3 |
| AI | Google Gemini 1.5 Flash |
| Weather | Open-Meteo API |
| Voice | Web Speech API |
| Charts | Chart.js (CDN) |
| Backend | Express.js on Render |
| Database | MongoDB Atlas |
| Hosting | Vercel |
| PWA | Service Worker |

## Authentication Flow

1. User registers/logs in via `/login`
2. JWT token stored in localStorage + cookie
3. Middleware checks cookie on protected routes
4. API calls include `Authorization: Bearer <token>` header

## New Features in 2.0

1. **AI Crop Disease Detection** — Gemini Vision API analyzes leaf images
2. **Multilingual Chatbot** — KisaanBot 2.0 speaks 9 Indian languages
3. **Voice Assistant** — Navigate and query by voice in any language
4. **Market Price Forecast** — AI-driven 30/60/90-day predictions
5. **Smart Irrigation** — Weather-integrated watering schedules
6. **Farmer Analytics** — Interactive revenue, expense, and crop charts
7. **Scheme Recommendations** — Profile-based scheme matching with scores
