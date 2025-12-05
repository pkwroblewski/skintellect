import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skintelect - Decode Your Skincare Ingredients",
  description:
    "Check products for comedogenic ingredients, allergens, and fungal acne triggers. Make informed decisions about what you put on your skin.",
  keywords: [
    "skincare",
    "ingredient analyzer",
    "fungal acne",
    "comedogenic",
    "skincare routine",
    "allergens",
  ],
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
      </body>
    </html>
  );
}
