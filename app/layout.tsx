import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Dhruv — Portfolio",
  description: "Selected work, experience and education of Dhruv Patil.",
};

// Lets the page use the full screen on phones with a notch / home bar.
export const viewport: Viewport = { viewportFit: "cover" };

// Applies the saved theme before first paint so there's no flash.
const themeScript = `try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.add("light")}catch(e){}`;

// The greeting intro plays once per browser session; hide it before first
// paint on later loads (see components/Intro.tsx).
const introScript = `try{if(sessionStorage.getItem("intro-seen"))document.documentElement.classList.add("intro-skip")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="intro-running font-sans">{children}</body>
    </html>
  );
}
