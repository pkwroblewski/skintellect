import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Analytics } from "@/components/analytics";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skintelect.com";

export const metadata: Metadata = {
  title: {
    default: "Skintelect - Decode Your Skincare Ingredients",
    template: "%s | Skintelect",
  },
  description:
    "Check products for comedogenic ingredients, allergens, and fungal acne triggers. Make informed decisions about what you put on your skin.",
  keywords: [
    "skincare",
    "ingredient analyzer",
    "fungal acne safe",
    "comedogenic",
    "skincare routine",
    "allergens",
    "skincare ingredients",
    "product analysis",
  ],
  authors: [{ name: "Skintelect" }],
  creator: "Skintelect",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Skintelect",
    title: "Skintelect - Decode Your Skincare Ingredients",
    description:
      "Check products for comedogenic ingredients, allergens, and fungal acne triggers. Science-backed analysis for custom routines.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Skintelect - Skincare Ingredient Analyzer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Skintelect - Decode Your Skincare Ingredients",
    description:
      "Check products for comedogenic ingredients, allergens, and fungal acne triggers.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-slate-50 text-slate-600 antialiased selection:bg-rose-100 selection:text-rose-900">
        <Header />
        <main>
          {children}
        </main>
        {/* Analytics - loads in production only */}
        <Analytics />
      </body>
    </html>
  );
}
