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

// Sends phones from the desktop page to /mobile/ before anything draws.
// Add ?desktop to the address to stay on the desktop page.
const mobileScript = `try{var p=location.pathname;if(!/\\/mobile\\/?$/.test(p)&&matchMedia("(max-width: 767px)").matches&&!/[?&]desktop/.test(location.search))location.replace(p.replace(/\\/?$/,"/")+"mobile/"+location.hash)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: mobileScript }} />
      </head>
      <body className="intro-running font-sans">{children}</body>
    </html>
  );
}
