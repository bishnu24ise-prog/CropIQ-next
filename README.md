# 🌱 CropIQ 2.0
**AI-Powered Smart Farming Platform for 140 Million Indian Farming Families.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://crop-iq-next-eeyv.vercel.app)
[![Version](https://img.shields.io/badge/Version-2.0.0-blue.svg)]()

CropIQ 2.0 is a comprehensive, AI-powered smart farming platform built specifically for Indian farmers. Our mission is to bridge the technology gap and provide actionable insights in regional languages to those who need it most.

---

## 🚨 The Problem
Indian farmers face a vicious cycle of challenges:
- **Debt Traps:** High-interest loans from local moneylenders lead to crippling financial burdens.
- **Climate Shocks:** Unpredictable weather ruins crops without early warning systems.
- **Middlemen Exploitation:** Farmers receive a fraction of the market price due to lack of direct market access.
- **Information Gap:** 80% of farmers miss out on government subsidies due to complex, English-only application processes.

## 💡 Our Solution
CropIQ 2.0 acts as a unified digital lifeline — AI crop diagnosis, smart irrigation scheduling, market price forecasting, a multilingual voice assistant, farm analytics, and personalized government scheme recommendations — all accessible in 9 Indian languages.

---

## 🔗 Links
- 🌐 **Live Demo:** [https://crop-iq-next-eeyv.vercel.app](https://crop-iq-next-eeyv.vercel.app)
- 💻 **Frontend GitHub:** [https://github.com/bishnu24ise-prog/CropIQ-next](https://github.com/bishnu24ise-prog/CropIQ-next)
- ⚙️ **Backend GitHub:** [https://github.com/bishnu24ise-prog/backend-cropIQ](https://github.com/bishnu24ise-prog/backend-cropIQ)
- 🖥️ **Backend API:** [https://backend-cropiq.onrender.com](https://backend-cropiq.onrender.com)

---

## 🚀 What's New in 2.0

### 🔬 AI Crop Disease Detection Pipeline
- Upload a leaf photo → AI identifies disease with confidence score
- Gemini Vision API analysis with offline fallback database (12 crop types)
- Animated confidence gauge, disease heatmap overlay
- Downloadable diagnosis report with treatment recommendations

### 🤖 Multilingual AI Farming Chatbot (KisaanBot 2.0)
- Ask farming questions in **9 Indian languages**: Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Punjabi, English
- Expanded knowledge base (20+ topics: organic farming, insurance, dairy, poultry, seeds)
- Per-message text-to-speech, copy, and WhatsApp sharing

### 🎙️ Voice Assistant with Indian Language Support
- Voice commands in English, Hindi, Tamil, Telugu, Kannada
- Navigate by voice: "मौसम दिखाओ" → Weather page
- Page reader in any selected language
- Expandable panel with recent command history

### 📈 Market Price Forecasting Dashboard
- AI-driven 30/60/90-day price predictions for 12 crops
- Interactive charts with confidence interval bands
- Best selling day recommendation
- KPI cards: current price, predicted price, confidence

### 🧪 Yield & Fertilizer Predictor (Powered by Wolfram Alpha)
- Dedicated computational engine for precision agriculture
- Input land area, soil pH, nitrogen levels, and weather
- Outputs highly accurate, location-specific fertilizer configurations
- Predicts expected harvest yield in quintals using Wolfram's datasets

### 💧 Smart Irrigation Recommendation Engine
- Weather-integrated watering schedules
- Penman-Monteith ET calculations with soil coefficients
- 7-day irrigation calendar with rain prediction
- Growth stage selector (5 stages per crop)
- Drought and waterlogging risk indicators

### 📊 Farmer Analytics Dashboard
- 4 interactive Chart.js visualizations
- Revenue vs Expenses, Crop Distribution, Expense Breakdown, Profit/Loss Timeline
- KPI cards with animated counters
- Period filtering: 3 months, 6 months, 1 year

### 🏛️ Government Scheme Recommendation System
- Profile-based matching across 12 national + state schemes
- Match score percentage for each scheme
- AI-powered advisory summaries
- Includes PM-KISAN, PMFBY, PMKSY, KCC, MahaDBT, Rythu Bandhu, KALIA

---

## 🛡️ Security & Intent Verification

Every financial transaction and order action is cryptographically verified against a declared intent before execution, with full audit logging — protecting farmers' loan, debt-fund, and marketplace data from unauthorized or unintended actions.

For full technical details (including protected routes, scoping, fail-closed behavior, and key rotation), please see the [**ArmorIQ Integration Docs**](https://github.com/bishnu24ise-prog/backend-cropIQ/blob/main/docs/ARMORIQ_INTEGRATION.md) in the backend repository.

---

## 🔧 Existing Features (v1.0)

### 🛒 Direct-to-Consumer Market & Advanced Analytics
- Zero-middlemen crop listing with real-time mandi rate syncing
- Smart unit multipliers (100g to 5 Quintals)
- Dynamic inventory management with atomic database operations

### 🌐 Universal Multilingual Support
- Google Translate widget across all pages
- AI Multilingual Chatbot in local dialects

### 🎓 Farmer Video Academy
- Searchable, dynamic library of curated agricultural video tutorials
- Embedded cinematic modal video player

### 🏛️ Scheme Notifier & Document Portal
- Personalized alerts with document upload portal

### 💬 Agricultural Community Hub
- Social feed with posts, likes, and comments

### 📊 Financial Dashboard & Debt Fund
- Loan tracker with EMI prediction
- Crowdfunded debt relief connecting donors with farmers

### 📦 Order Management System
- Incoming order tracking with fulfillment status updates

---

## 🧠 Architecture: The Computational Knowledge Engine

CropIQ 2.0 uses a unique hybrid-AI architecture. While **Google Gemini** handles natural language understanding and conversation, **Wolfram Alpha** acts as the core computational engine—performing hard agricultural calculations, yield estimations, and fertilizer recommendations.

*Note: The Financial Dashboard, Debt Fund, and Order Management write-paths are now protected by **ArmorIQ**. Every AI- or user-triggered financial/order action is verified against a signed intent plan before it's allowed to execute, with audit logging and fail-closed behavior if the ArmorIQ proxy is unreachable.*

```text
Farmer
   │
   ▼
CropIQ Frontend (Next.js)
   │
   ├── Gemini 1.5 Flash
   │      │
   │      ▼
   │  Natural Language Chatbot & Vision
   │
   └── Wolfram Alpha API
           │
           ├── Smart Fertilizer Recommendations
           ├── Crop Yield Estimation
           ├── Advanced Weather Computations
           └── Profit & Cost Projections
```

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS 3, PWA |
| **Backend** | Node.js, Express.js, REST APIs (Render) |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **AI Conversation & Vision** | Google Gemini 1.5 Flash |
| **Computational AI Engine** | **Wolfram Alpha API (Short Answers / Full API)** |
| **Security/Intent Verification** | ArmorIQ SDK (@armoriq/sdk) |
| **Voice** | Web Speech API (Recognition + Synthesis) |
| **Charts** | Chart.js |
| **Weather** | Open-Meteo API |
| **Localization** | Google Translate Widget + Gemini Translation |
| **Hosting** | Vercel (Frontend), Render (Backend) |

---

## 🛠️ Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/bishnu24ise-prog/CropIQ-next.git
cd cropiq-next
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file for the frontend, and a `.env` file for the backend:
```env
# Frontend (.env.local)
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_API_URL=https://backend-cropiq.onrender.com/api
WOLFRAM_APP_ID=your_wolfram_app_id_here

# Backend (.env) - Get your key from platform.armoriq.ai
ARMORIQ_API_KEY=your_armoriq_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
app/
├── api/                    # 6 API routes (chat, crop-scan, irrigation, forecast, schemes, translate)
├── components/             # 11 shared components
├── lib/                    # API utilities + voice commands
├── [15 page directories]   # Feature pages
├── layout.js               # Root layout
└── page.js                 # Landing page
docs/
├── ARCHITECTURE.md         # System architecture
└── CHANGELOG.md            # Version changelog
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for detailed architecture documentation.

---

## 🔮 Future Scope
- **IoT Integration:** Smart soil moisture sensors connected to the dashboard
- **Voice-First Navigation:** Fully voice-controlled UI for illiterate farmers
- **Drone Mapping:** Drone imagery for large-scale field health analysis
- **Real-time Mandi API:** Live government mandi price data integration
- **Offline AI:** On-device TFLite models for offline disease detection

## 👥 Team
Built with ❤️ by **Team PixelPirates**
- **Ansika Singh:** Frontend & AI Lead
- **Bishnu Sardar:** Backend & Full-Stack Lead
- **Pallavi M**:Ai research lead
