import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#FAFAFA",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tactile.lakshitsoni.in"),
  title: "Tactile — Your Mac’s Missing Half",
  description:
    "Turn your phone into an instant auxiliary display, contextual Touch Bar, and tactile companion controller for Mac. Fast, native, and completely local-first.",
  keywords: [
    "Mac secondary display",
    "Mac Touch Bar companion",
    "tactile companion screen",
    "macOS developer tools",
    "local-first mac app",
    "Tactile",
    "Mac haptic trackpad",
  ],
  authors: [{ name: "Lakshit" }],
  openGraph: {
    title: "Tactile — Your Mac’s Missing Half",
    description:
      "Turn your phone into an auxiliary display, contextual Touch Bar, and precision companion controller for Mac. Fast, native, and completely local-first.",
    url: "https://tactile.lakshitsoni.in",
    siteName: "Tactile",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tactile — Your Mac’s Missing Half",
    description:
      "Turn your phone into an auxiliary display, contextual Touch Bar, and precision companion controller for Mac.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tactile",
  operatingSystem: "macOS 14.0+, Android 10.0+, iOS 17.0+",
  applicationCategory: "DeveloperApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Native companion app turning mobile devices into an auxiliary screen, contextual Touch Bar, and tactile controller for Mac.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} antialiased scroll-smooth`}
    >
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-black/[0.08] selection:text-black antialiased font-[family-name:var(--font-geist-sans)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
