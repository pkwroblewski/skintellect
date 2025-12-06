import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Card, CardContent, Badge, Button } from "@/components/ui";
import {
  generateIngredientArticleSchema,
  generateIngredientFAQSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo";
import { getIngredientBySlug } from "@/lib/repositories/ingredients";

// Display type for ingredient detail page
interface DisplayIngredient {
  id: string;
  slug: string;
  name: string;
  inciName: string | null;
  description: string | null;
  functions: string[];
  comedogenicRating: number | null;
  irritationLevel: number | null;
  isFungalAcneTrigger: boolean;
  isAllergen: boolean;
  isReefUnsafe: boolean;
  benefits: string[];
  concerns: string[];
  goodFor: string[];
}

// Fallback data when database is not available
const fallbackIngredientsData: Record<string, DisplayIngredient> = {
  niacinamide: {
    id: "1",
    slug: "niacinamide",
    name: "Niacinamide",
    inciName: "Niacinamide",
    description: "Niacinamide, also known as nicotinamide, is a form of vitamin B3. It's one of the most researched and versatile skincare ingredients, offering multiple benefits for various skin concerns.",
    functions: ["brightening", "anti_aging"],
    comedogenicRating: 0,
    irritationLevel: 0,
    isFungalAcneTrigger: false,
    isAllergen: false,
    isReefUnsafe: false,
    benefits: ["Minimizes enlarged pores", "Improves uneven skin tone", "Strengthens skin barrier", "Reduces fine lines", "Regulates oil production"],
    concerns: [],
    goodFor: ["All skin types", "Oily skin", "Acne-prone", "Aging skin"],
  },
  "hyaluronic-acid": {
    id: "2",
    slug: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    inciName: "Sodium Hyaluronate",
    description: "Hyaluronic acid is a powerful humectant naturally found in the skin. It can hold up to 1,000 times its weight in water, making it exceptional for hydration.",
    functions: ["moisturizing"],
    comedogenicRating: 0,
    irritationLevel: 0,
    isFungalAcneTrigger: false,
    isAllergen: false,
    isReefUnsafe: false,
    benefits: ["Intense hydration", "Plumps skin", "Reduces fine lines", "Non-comedogenic", "Suitable for all skin types"],
    concerns: [],
    goodFor: ["All skin types", "Dry skin", "Dehydrated skin"],
  },
  "salicylic-acid": {
    id: "3",
    slug: "salicylic-acid",
    name: "Salicylic Acid",
    inciName: "Salicylic Acid",
    description: "Salicylic acid is a beta-hydroxy acid (BHA) derived from willow bark. It's oil-soluble, allowing it to penetrate pores and dissolve debris.",
    functions: ["exfoliating", "acne_fighting"],
    comedogenicRating: 0,
    irritationLevel: 1,
    isFungalAcneTrigger: false,
    isAllergen: false,
    isReefUnsafe: false,
    benefits: ["Unclogs pores", "Fights acne", "Exfoliates dead skin", "Anti-inflammatory"],
    concerns: ["May cause dryness", "Increases sun sensitivity"],
    goodFor: ["Oily skin", "Acne-prone skin"],
  },
  retinol: {
    id: "4",
    slug: "retinol",
    name: "Retinol",
    inciName: "Retinol",
    description: "Retinol is a derivative of vitamin A and one of the most proven anti-aging ingredients. It accelerates cell turnover and boosts collagen.",
    functions: ["anti_aging"],
    comedogenicRating: 0,
    irritationLevel: 3,
    isFungalAcneTrigger: false,
    isAllergen: false,
    isReefUnsafe: false,
    benefits: ["Reduces wrinkles", "Improves texture", "Boosts collagen", "Fades dark spots"],
    concerns: ["Can cause irritation initially", "Increases sun sensitivity", "Not for pregnancy"],
    goodFor: ["Aging skin", "Uneven skin tone"],
  },
  "isopropyl-palmitate": {
    id: "9",
    slug: "isopropyl-palmitate",
    name: "Isopropyl Palmitate",
    inciName: "Isopropyl Palmitate",
    description: "Isopropyl palmitate is an emollient commonly used in cosmetics. While it helps products spread smoothly, it's known to be problematic for many skin types.",
    functions: ["emulsifier"],
    comedogenicRating: 4,
    irritationLevel: 0,
    isFungalAcneTrigger: true,
    isAllergen: false,
    isReefUnsafe: false,
    benefits: ["Smooth texture", "Helps products spread"],
    concerns: ["Highly comedogenic (4/5)", "Fungal acne trigger", "Can clog pores"],
    goodFor: [],
  },
};

// Map database function enums to display strings
const functionDisplayNames: Record<string, string> = {
  moisturizing: "moisturizing",
  antioxidant: "antioxidant",
  exfoliating: "exfoliating",
  soothing: "soothing",
  brightening: "brightening",
  acne_fighting: "acne-fighting",
  anti_aging: "anti-aging",
  cleansing: "cleansing",
  preservative: "preservative",
  fragrance: "fragrance",
  emulsifier: "emulsifier",
  solvent: "solvent",
  surfactant: "surfactant",
  humectant: "humectant",
  occlusive: "occlusive",
  emollient: "emollient",
  other: "other",
};

const functionColors: Record<string, string> = {
  moisturizing: "bg-sky-50 text-sky-700",
  antioxidant: "bg-emerald-50 text-emerald-700",
  exfoliating: "bg-amber-50 text-amber-700",
  soothing: "bg-violet-50 text-violet-700",
  brightening: "bg-pink-50 text-pink-700",
  "acne-fighting": "bg-rose-50 text-rose-700",
  "anti-aging": "bg-indigo-50 text-indigo-700",
  emulsifier: "bg-slate-100 text-slate-600",
  preservative: "bg-slate-100 text-slate-600",
  fragrance: "bg-orange-50 text-orange-700",
  cleansing: "bg-cyan-50 text-cyan-700",
  humectant: "bg-sky-50 text-sky-700",
  occlusive: "bg-slate-100 text-slate-600",
  emollient: "bg-slate-100 text-slate-600",
  surfactant: "bg-slate-100 text-slate-600",
  solvent: "bg-slate-50 text-slate-500",
  other: "bg-slate-50 text-slate-500",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skintelect.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Fetches an ingredient from the database with fallback to static data.
 */
async function getIngredient(slug: string): Promise<DisplayIngredient | null> {
  try {
    const ingredient = await getIngredientBySlug(slug);
    if (ingredient) {
      return {
        id: ingredient.id,
        slug: ingredient.slug,
        name: ingredient.name,
        inciName: ingredient.inciName,
        description: ingredient.description,
        functions: ingredient.functions,
        comedogenicRating: ingredient.comedogenicRating,
        irritationLevel: ingredient.irritationLevel,
        isFungalAcneTrigger: ingredient.isFungalAcneTrigger,
        isAllergen: ingredient.isAllergen,
        isReefUnsafe: ingredient.isReefUnsafe,
        benefits: ingredient.benefits || [],
        concerns: ingredient.concerns || [],
        goodFor: ingredient.goodFor || [],
      };
    }
    // Try fallback data
    return fallbackIngredientsData[slug] || null;
  } catch {
    // Database not available, use fallback data
    console.log("Database not available, using fallback ingredient data for:", slug);
    return fallbackIngredientsData[slug] || null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ingredient = await getIngredient(slug);

  if (!ingredient) {
    return {
      title: "Ingredient Not Found",
    };
  }

  const safetyStatus = ingredient.isFungalAcneTrigger
    ? "fungal acne trigger"
    : "fungal acne safe";

  return {
    title: `${ingredient.name} - Skincare Ingredient Guide & Safety`,
    description: `Learn about ${ingredient.name} in skincare: ${ingredient.description?.slice(0, 120) || ""}... Is it ${safetyStatus}? Comedogenic rating: ${ingredient.comedogenicRating || 0}/5.`,
    keywords: [
      ingredient.name.toLowerCase(),
      ingredient.inciName?.toLowerCase() || "",
      "skincare ingredient",
      ...ingredient.functions.map(f => functionDisplayNames[f] || f),
      ingredient.isFungalAcneTrigger ? "fungal acne trigger" : "fungal acne safe",
    ].filter(Boolean),
    openGraph: {
      title: `${ingredient.name} - Ingredient Profile | Skintelect`,
      description: `${ingredient.description?.slice(0, 150) || ""}...`,
      type: "article",
    },
  };
}

export default async function IngredientDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const ingredient = await getIngredient(slug);

  if (!ingredient) {
    notFound();
  }

  // Generate structured data
  const articleSchema = generateIngredientArticleSchema({
    name: ingredient.name,
    description: ingredient.description || "",
    slug: ingredient.slug,
  });

  const faqSchema = generateIngredientFAQSchema({
    name: ingredient.name,
    isFungalAcneTrigger: ingredient.isFungalAcneTrigger,
    isAllergen: ingredient.isAllergen,
    comedogenicRating: ingredient.comedogenicRating || 0,
    functions: ingredient.functions.map(f => functionDisplayNames[f] || f),
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Ingredients", url: `${siteUrl}/ingredients` },
    { name: ingredient.name },
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data: Article schema for ingredient educational content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* JSON-LD Structured Data: FAQ schema for common ingredient questions */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* JSON-LD Structured Data: Breadcrumb navigation for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Page Header */}
      <section className="border-b border-slate-100 bg-gradient-subtle py-8">
        <Container size="md">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/ingredients" className="hover:text-slate-900 transition-colors">Ingredients</Link>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900">{ingredient.name}</span>
          </nav>

          {/* Title and Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-1">
                {ingredient.name}
              </h1>
              {ingredient.inciName && (
                <p className="text-sm text-slate-500">INCI: {ingredient.inciName}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {ingredient.functions.map((fn) => {
                  const displayName = functionDisplayNames[fn] || fn;
                  return (
                    <span
                      key={fn}
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        functionColors[displayName] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {displayName}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Safety Badges */}
            <div className="flex flex-wrap gap-2">
              {ingredient.isFungalAcneTrigger ? (
                <Badge variant="danger">FA Trigger</Badge>
              ) : (
                <Badge variant="success">FA Safe</Badge>
              )}
              <Badge variant={(ingredient.comedogenicRating || 0) >= 3 ? "warning" : "success"}>
                Comedogenic: {ingredient.comedogenicRating || 0}/5
              </Badge>
            </div>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-8">
        <Container size="md">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-5">
              {/* About */}
              {ingredient.description && (
                <Card variant="outlined">
                  <CardContent>
                    <h2 className="text-sm font-semibold text-slate-900 mb-2">About</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{ingredient.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {ingredient.benefits && ingredient.benefits.length > 0 && (
                <Card className="border-emerald-100 bg-emerald-50/30">
                  <CardContent>
                    <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Benefits
                    </h2>
                    <ul className="space-y-1.5">
                      {ingredient.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-emerald-500 mt-0.5" aria-hidden="true">•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Concerns */}
              {ingredient.concerns && ingredient.concerns.length > 0 && (
                <Card className="border-amber-100 bg-amber-50/30">
                  <CardContent>
                    <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Things to Know
                    </h2>
                    <ul className="space-y-1.5">
                      {ingredient.concerns.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-amber-500 mt-0.5" aria-hidden="true">•</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Good For */}
              {ingredient.goodFor && ingredient.goodFor.length > 0 && (
                <Card variant="outlined">
                  <CardContent>
                    <h2 className="text-sm font-semibold text-slate-900 mb-3">Best For</h2>
                    <div className="flex flex-wrap gap-1.5">
                      {ingredient.goodFor.map((type) => (
                        <Badge key={type} variant="rose" size="sm">{type}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <Link href="/analyze" className="block">
                  <Button className="w-full justify-center">
                    Check Your Products
                  </Button>
                </Link>
                <Link href="/ingredients" className="block">
                  <Button variant="outline" className="w-full justify-center">
                    Browse More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
