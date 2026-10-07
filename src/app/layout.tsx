import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/motion/PageTransition";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { site } from "@/content/site";
import "./globals.css";
import "@/styles/motion.css";

const redaction35 = localFont({
  src: "./fonts/redaction-35-400.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-redaction-35",
});

const redaction10 = localFont({
  src: "./fonts/redaction-10-400.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-redaction-10",
  // Usato solo per poche righe "statement": niente preload, così non toglie banda all'hero.
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Listening bar a Bari`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: site.name,
    images: [{ url: "/og.jpg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${redaction35.variable} ${redaction10.variable}`} suppressHydrationWarning>
      <body>
        {/* Con JS attivo gli elementi animati partono nascosti; senza JS si vede tutto. */}
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add("js")`}
        </Script>
        <a href="#contenuto" className="skip-link">
          Vai al contenuto
        </a>
        <Header />
        <main id="contenuto">{children}</main>
        <Footer />
        <RevealObserver />
        <PageTransition />
      </body>
    </html>
  );
}
