# Changelog

## [2.0.0] - 2026-06-14

### 🚀 Major Features

#### feat(ai): add advanced crop disease detection pipeline
- New `/api/crop-scan` route with Gemini Vision API integration
- Offline fallback database for 12 crop types with detailed disease data
- `ConfidenceGauge` component — animated SVG gauge showing diagnosis confidence
- `DiseaseHeatmap` component — severity-based overlay visualization
- Upgraded crop doctor page with camera capture, report generation, and premium UI
- Text-to-speech diagnosis report narration
- Downloadable text report with disease details

#### feat(chatbot): implement multilingual farming assistant
- Enhanced KisaanBot 2.0 with 9 Indian language support
- Language selector: English, Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Gujarati, Punjabi
- Expanded knowledge base from 12 to 20+ entries (organic farming, dairy, poultry, insurance)
- New `/api/chat/translate` route for text translation via Gemini
- `ChatMessage` component with per-message TTS, copy, and share
- Voice input in selected language using Web Speech API
- Deeper system prompt with seasonal awareness and structured responses

#### feat(voice): add multilingual voice assistant with Indian language recognition
- `VoiceAssistant` component replacing legacy `VoiceNavigation`
- Voice command routing in English, Hindi, Tamil, Telugu, and Kannada
- Expandable panel with language selection and recent commands
- Page reader with multi-language TTS
- `voiceCommands.js` — multilingual command parser with fuzzy matching
- Floating orb UI with pulse animation and state indicators

#### feat(market): add AI-powered price forecasting with interactive charts
- New `/market-forecast` page with Chart.js visualizations
- `/api/market-forecast` route with algorithmic trend analysis + Gemini insights
- 30/60/90-day forecast periods with confidence intervals
- KPI cards: current price, predicted price, best selling day, confidence
- Upper/lower band chart with gradient fills

#### feat(irrigation): add water optimization recommendations
- New `/irrigation` page with smart scheduling
- `/api/irrigation` route with ET-based calculations
- Penman-Monteith simplified formula with soil coefficients
- 7-day irrigation calendar with weather integration
- Growth stage selector (5 stages per crop)
- Drought and waterlogging risk indicators
- Real-time GPS weather data injection
- Crop-specific water requirements for 8 crops

#### feat(analytics): build farmer insights dashboard
- New `/farmer-analytics` page with 4 interactive charts
- Revenue vs Expenses line chart
- Crop distribution doughnut chart
- Expense breakdown stacked bar chart
- Profit/Loss timeline with conditional coloring
- KPI cards: total revenue, expenses, net profit, ROI
- Period filtering: 3 months, 6 months, 1 year

#### feat(schemes): add AI-powered scheme recommendations
- New `/api/scheme-recommend` route with profile-based matching
- Database of 12 government schemes (national + state-level)
- Match scoring algorithm based on state, land area, category
- Gemini-powered advisory summaries
- Includes PM-KISAN, PMFBY, PMKSY, KCC, SMAM, MahaDBT, Rythu Bandhu, KALIA

### 🔧 Improvements

#### feat(ui): upgrade global design system and navigation
- Updated root layout with CropIQ 2.0 branding and metadata
- Added 3 new dashboard feature tiles (Irrigation, Price Forecast, Farm Analytics)
- Updated middleware with 3 new protected routes
- Version bumped to 2.0.0

### 📝 Documentation
- `docs/ARCHITECTURE.md` — Complete system architecture documentation
- `docs/CHANGELOG.md` — This changelog

### Previous Version (1.x)
- Landing page with problem/solution/features sections
- Dashboard with loan tracker, market, weather, schemes
- AI Crop Doctor with Gemini Vision (basic)
- KisaanBot chatbot (English only)
- Community forum
- Debt fund
- Market analytics
- Knowledge base (video academy)
- PWA offline support
- Google Translate widget
- SOS button
- WhatsApp sharing
