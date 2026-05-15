import localFont from "next/font/local";
import "./globals.css";
import PageLoader from "./components/PageLoader";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import SOSButton from "./components/SOSButton";
import TranslationWidget from "./components/TranslationWidget";
import VoiceNavigation from "./components/VoiceNavigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "CropIQ — AI Farming Platform for Indian Farmers",
  description: "One platform solving every farmer problem: debt tracking, AI crop diagnosis, direct market access, real-time weather alerts, and government scheme notifications.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "CropIQ" },
  openGraph: {
    title: "CropIQ — AI Farming Platform",
    description: "Empowering Indian farmers with AI, real-time data, and financial tools.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#064e3b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <style>{`
          /* Hide Google Translate Top Banner Globally */
          iframe.goog-te-banner-frame, iframe.skiptranslate { display: none !important; }
          body { top: 0 !important; margin-top: 0 !important; }
          .VIpgJd-ZVi9od-ORHb-OEVmcd { display: none !important; }

          body {
            background: #0a0f0a url('/images/background.webp') no-repeat center center fixed;
            background-size: cover;
            min-height: 100vh;
          }
          body::before {
            content: '';
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, rgba(10, 15, 10, 0.65), rgba(0, 0, 0, 0.4));
            z-index: -1;
            pointer-events: none;
          }
        `}</style>
        <PageLoader />
        {children}
        <SOSButton />
        <TranslationWidget />
        <VoiceNavigation />
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
