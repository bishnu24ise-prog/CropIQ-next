# 🌱 CropIQ
**Solving the core problems of 140 million Indian farming families.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://crop-iq-next-eeyv.vercel.app)

CropIQ is a comprehensive smart farming platform built specifically for Indian farmers. Our mission is to bridge the technology gap and provide actionable insights to those who need it most. 

---

## 🚨 The Problem
Indian farmers face a vicious cycle of challenges:
- **Debt Traps:** High-interest loans from local moneylenders lead to crippling financial burdens.
- **Climate Shocks:** Unpredictable weather ruins crops without early warning systems.
- **Middlemen Exploitation:** Farmers receive a fraction of the market price due to lack of direct market access.
- **Information Gap:** 80% of farmers miss out on government subsidies due to complex, English-only application processes.

## 💡 Our Solution
CropIQ acts as a unified digital lifeline. We provide a single platform that connects farmers to financial tracking tools, direct consumer markets, AI-powered agricultural insights, and localized government support—all accessible in regional languages.

---

## 🔗 Links
- 🌐 **Live Demo:** [https://crop-iq-next-eeyv.vercel.app](https://crop-iq-next-eeyv.vercel.app)
- 💻 **Frontend GitHub:** [https://github.com/bishnu24ise-prog/CropIQ-next](https://github.com/bishnu24ise-prog/CropIQ-next)
- ⚙️ **Backend GitHub:** [https://github.com/bishnu24ise-prog/backend-cropIQ](https://github.com/bishnu24ise-prog/backend-cropIQ)
- 🖥️ **Backend API:** [https://backend-cropiq.onrender.com](https://backend-cropiq.onrender.com)

---

## 📸 Live Demo
Check out the fully functional platform here: [https://crop-iq-next-eeyv.vercel.app](https://crop-iq-next-eeyv.vercel.app)

---

## 🚀 Key Features

### 🛒 Direct-to-Consumer Market & Advanced Analytics
- **Zero Middlemen Integration:** Farmers list their produce directly for consumers and bulk buyers to purchase.
- **Real-Time Market Rate Syncing:** When listing a crop, the platform pulls real-time average rates from `analyticsData.js` across various Mandis (markets) to suggest a fair starting price.
- **Smart Unit Multipliers:** Support for 11 distinct unit sizes (from 100g to 5 Quintals) with automatic backend price calculations.
- **Dynamic Inventory Management:** Purchasing instantly triggers an atomic database deduction. Items automatically enter a disabled "Out of Stock" state when inventory reaches zero.
- **Secure Escrow Concept:** A trust-building framework to guarantee payments and prevent exploitation.

### 🔬 AI Crop Doctor
- Snap a photo of a diseased crop, and our AI vision model detects the issue and suggests actionable organic and chemical treatments.

### 🌐 Universal Multilingual Support
- Built-in, floating language translation widget accessible across all 12 platform pages, ensuring zero language barriers for regional Indian farmers.
- **AI Multilingual Chatbot:** An intelligent assistant capable of answering complex farming queries in local dialects.

### 🎓 Farmer Video Academy
- A searchable, dynamic library of curated agricultural video tutorials (Tractor Maintenance, Hydroponics, Subsidies).
- Pulls live data from the backend, automatically extracting and rendering high-quality YouTube thumbnails and playing videos in an embedded cinematic modal.

### 🏛️ Scheme Notifier & Document Portal
- Personalized alerts and application guidance for verified government subsidies.
- Built-in mock document upload portal for submitting Aadhaar and Land Records directly from the dashboard.

### 💬 Agricultural Community Hub
- A dedicated social feed where farmers can create posts, share updates, and interact through likes and comments to build a robust support network.

### 📊 Financial Dashboard & Debt Fund
- **Loan Tracker:** A centralized agricultural command center for tracking debts and predicting EMI.
- **Crowdfunded Debt Relief:** A dedicated fund pool connecting urban donors with verified farmers in distress, complete with application tracking.

### 📦 Order Management System
- A dedicated "Farmer Orders" interface where farmers can view incoming direct market purchases, track quantities, and update fulfillment statuses (Pending, Processing, Shipped, Delivered).

## 💻 Tech Stack
- **Frontend:** Next.js 14 (App Router), React, Vanilla CSS, Progressive Web App (PWA) Offline Support
- **Backend:** Node.js, Express.js, REST APIs (Deployed on Render)
- **Database:** MongoDB Atlas (Mongoose ODM with strict atomic `$inc` queries)
- **AI Integration:** Google Gemini API for Chatbot & Vision Analysis
- **Localization:** Google Translate API Widget


## 🛠️ Local Setup

To run the application locally, follow these steps:

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd cropiq-next
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal) in your browser.

---

## 🔮 Future Scope
- **IoT Integration:** Connecting smart soil moisture sensors directly to the CropIQ dashboard.
- **Voice-First Navigation:** Fully voice-controlled UI for illiterate farmers.
- **Drone Mapping:** Integration with drone imagery for large-scale field health analysis.

## 👥 Team
Built with ❤️ by **Team PixelPirates**
- **Ansika Singh:** Frontend & AI Lead
- **Bishnu Sardar:** Backend & Full-Stack Lead
