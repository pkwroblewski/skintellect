import type { Metadata } from "next";
import { AnalyzeClient } from "./analyze-client";

export const metadata: Metadata = {
  title: "Ingredient Checker - Analyze Skincare Ingredients",
  description:
    "Paste any skincare product's ingredient list and instantly check for fungal acne triggers, allergens, comedogenic ingredients, and irritants.",
  keywords: [
    "ingredient checker",
    "skincare analysis",
    "fungal acne safe",
    "comedogenic checker",
    "ingredient analyzer",
    "skincare ingredients",
  ],
  openGraph: {
    title: "Ingredient Checker - Analyze Skincare Ingredients | Skintelect",
    description:
      "Paste any skincare product's ingredient list and instantly check for fungal acne triggers, allergens, and comedogenic ingredients.",
    type: "website",
  },
};

interface PageProps {
  searchParams: Promise<{ ingredients?: string }>;
}

export default async function AnalyzePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialIngredients = params.ingredients || "";

  return <AnalyzeClient initialIngredients={initialIngredients} />;
}
