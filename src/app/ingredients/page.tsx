import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, Badge, Input } from "@/components/ui";
import { searchIngredients } from "@/lib/repositories/ingredients";

export const metadata: Metadata = {
  title: "Ingredients Dictionary - Learn About Skincare Ingredients",
  description:
    "Explore our comprehensive database of skincare ingredients. Learn about their functions, safety ratings, and whether they're right for your skin type.",
  keywords: [
    "skincare ingredients",
    "ingredient dictionary",
    "cosmetic ingredients",
    "fungal acne triggers",
    "comedogenic ingredients",
    "skincare education",
  ],
  openGraph: {
    title: "Ingredients Dictionary | Skintelect",
    description:
      "Explore our comprehensive database of skincare ingredients. Learn about their functions and safety ratings.",
    type: "website",
  },
};

// Display type for ingredient cards
interface DisplayIngredient {
  id: string;
  name: string;
  slug: string;
  functions: string[];
  isFungalAcneTrigger: boolean;
  isAllergen: boolean;
}

// Fallback data when database is not available
const fallbackIngredients: DisplayIngredient[] = [
  { id: "1", name: "Niacinamide", slug: "niacinamide", functions: ["brightening", "anti_aging"], isFungalAcneTrigger: false, isAllergen: false },
  { id: "2", name: "Hyaluronic Acid", slug: "hyaluronic-acid", functions: ["moisturizing"], isFungalAcneTrigger: false, isAllergen: false },
  { id: "3", name: "Salicylic Acid", slug: "salicylic-acid", functions: ["exfoliating", "acne_fighting"], isFungalAcneTrigger: false, isAllergen: false },
  { id: "4", name: "Retinol", slug: "retinol", functions: ["anti_aging"], isFungalAcneTrigger: false, isAllergen: false },
  { id: "5", name: "Glycerin", slug: "glycerin", functions: ["moisturizing"], isFungalAcneTrigger: false, isAllergen: false },
  { id: "6", name: "Vitamin C", slug: "vitamin-c", functions: ["antioxidant", "brightening"], isFungalAcneTrigger: false, isAllergen: false },
  { id: "7", name: "Ceramides", slug: "ceramides", functions: ["moisturizing"], isFungalAcneTrigger: false, isAllergen: false },
  { id: "8", name: "Centella Asiatica", slug: "centella-asiatica", functions: ["soothing"], isFungalAcneTrigger: false, isAllergen: false },
  { id: "9", name: "Isopropyl Palmitate", slug: "isopropyl-palmitate", functions: ["emulsifier"], isFungalAcneTrigger: true, isAllergen: false },
  { id: "10", name: "Coconut Oil", slug: "coconut-oil", functions: ["moisturizing"], isFungalAcneTrigger: true, isAllergen: false },
  { id: "11", name: "Fragrance", slug: "fragrance", functions: ["fragrance"], isFungalAcneTrigger: false, isAllergen: true },
  { id: "12", name: "Azelaic Acid", slug: "azelaic-acid", functions: ["brightening", "acne_fighting"], isFungalAcneTrigger: false, isAllergen: false },
];

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
  fragrance: "bg-orange-50 text-orange-700",
  emulsifier: "bg-slate-100 text-slate-600",
  preservative: "bg-slate-100 text-slate-600",
  cleansing: "bg-cyan-50 text-cyan-700",
  humectant: "bg-sky-50 text-sky-700",
  occlusive: "bg-slate-100 text-slate-600",
  emollient: "bg-slate-100 text-slate-600",
  surfactant: "bg-slate-100 text-slate-600",
  solvent: "bg-slate-50 text-slate-500",
  other: "bg-slate-50 text-slate-500",
};

// Function filter options
const functionFilters = [
  { label: "All", value: "" },
  { label: "Moisturizing", value: "moisturizing" },
  { label: "Anti-aging", value: "anti_aging" },
  { label: "Brightening", value: "brightening" },
  { label: "Acne-fighting", value: "acne_fighting" },
  { label: "Soothing", value: "soothing" },
];

interface SearchParams {
  q?: string;
  fn?: string;
  fa?: string;
}

/**
 * Fetches ingredients from the database with fallback to static data.
 */
async function getIngredients(searchParams: SearchParams): Promise<DisplayIngredient[]> {
  const { q, fn, fa } = searchParams;
  
  try {
    const result = await searchIngredients({
      query: q || undefined,
      functions: fn ? [fn as "moisturizing" | "antioxidant" | "exfoliating" | "soothing" | "brightening" | "acne_fighting" | "anti_aging" | "cleansing" | "preservative" | "fragrance" | "emulsifier" | "solvent" | "surfactant" | "humectant" | "occlusive" | "emollient" | "other"] : undefined,
      isFungalAcneSafe: fa === "true" ? true : undefined,
      limit: 50,
    });
    
    if (result.ingredients.length > 0) {
      return result.ingredients.map(ing => ({
        id: ing.id,
        name: ing.name,
        slug: ing.slug,
        functions: ing.functions,
        isFungalAcneTrigger: ing.isFungalAcneTrigger,
        isAllergen: ing.isAllergen,
      }));
    }
    return filterFallbackIngredients(fallbackIngredients, searchParams);
  } catch {
    console.log("Database not available, using fallback ingredient data");
    return filterFallbackIngredients(fallbackIngredients, searchParams);
  }
}

/**
 * Filters fallback ingredients based on search params.
 */
function filterFallbackIngredients(ingredients: DisplayIngredient[], params: SearchParams): DisplayIngredient[] {
  let filtered = [...ingredients];
  
  if (params.q) {
    const query = params.q.toLowerCase();
    filtered = filtered.filter(i => i.name.toLowerCase().includes(query));
  }
  
  if (params.fn) {
    filtered = filtered.filter(i => i.functions.includes(params.fn!));
  }
  
  if (params.fa === "true") {
    filtered = filtered.filter(i => !i.isFungalAcneTrigger);
  }
  
  return filtered;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

function IngredientsContent({
  ingredients,
  searchParams,
}: {
  ingredients: DisplayIngredient[];
  searchParams: SearchParams;
}) {
  const currentFunction = searchParams.fn || "";
  const currentFa = searchParams.fa === "true";
  const currentQuery = searchParams.q || "";

  // Build URL with query params
  const buildUrl = (params: Record<string, string>) => {
    const urlParams = new URLSearchParams();
    const merged = { q: currentQuery, fn: currentFunction, fa: currentFa ? "true" : "", ...params };
    
    Object.entries(merged).forEach(([key, value]) => {
      if (value) urlParams.set(key, String(value));
    });
    
    const queryString = urlParams.toString();
    return queryString ? `/ingredients?${queryString}` : "/ingredients";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="border-b border-slate-100 bg-gradient-subtle py-10">
        <Container>
          <div className="max-w-xl mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
              Ingredients Dictionary
            </h1>
            <p className="text-slate-600">
              Learn about cosmetic ingredients. Understand what they do and whether they&apos;re right for your skin.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md">
            <form action="/ingredients" method="GET">
              {/* Preserve other params */}
              {currentFunction && <input type="hidden" name="fn" value={currentFunction} />}
              {currentFa && <input type="hidden" name="fa" value="true" />}
              
              <div className="relative">
                <svg 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                  type="search"
                  name="q"
                  defaultValue={currentQuery}
                  placeholder="Search ingredients..."
                  className="pl-9 h-10"
                  aria-label="Search ingredients"
                />
              </div>
            </form>
          </div>

          {/* Function Filter Tags */}
          <div className="flex flex-wrap gap-2 mt-5" role="group" aria-label="Filter by function">
            {functionFilters.map((filter) => (
              <Link
                key={filter.value}
                href={buildUrl({ fn: filter.value })}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  currentFunction === filter.value
                    ? "bg-rose-500 text-white" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
                aria-current={currentFunction === filter.value ? "page" : undefined}
              >
                {filter.label}
              </Link>
            ))}
          </div>

          {/* FA Safe Filter */}
          <div className="mt-4">
            <Link
              href={buildUrl({ fa: currentFa ? "" : "true" })}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                currentFa
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              FA Safe Only
            </Link>
          </div>
        </Container>
      </section>

      {/* Results info */}
      {(currentQuery || currentFunction || currentFa) && (
        <section className="border-b border-slate-100 py-3">
          <Container>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {ingredients.length} {ingredients.length === 1 ? "ingredient" : "ingredients"} found
                {currentQuery && <span> for &quot;{currentQuery}&quot;</span>}
              </p>
              {(currentQuery || currentFunction || currentFa) && (
                <Link
                  href="/ingredients"
                  className="text-sm text-rose-600 hover:text-rose-700"
                >
                  Clear filters
                </Link>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Grid */}
      <section className="py-10">
        <Container>
          {ingredients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">No ingredients found matching your criteria.</p>
              <Link
                href="/ingredients"
                className="text-rose-600 hover:text-rose-700 text-sm font-medium"
              >
                Clear filters and try again
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ingredients.map((ingredient) => (
                <Link key={ingredient.id} href={`/ingredients/${ingredient.slug}`}>
                  <Card hover className="h-full">
                    <CardContent>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {ingredient.name}
                        </h3>
                        {ingredient.isFungalAcneTrigger ? (
                          <Badge variant="danger" size="sm">FA Risk</Badge>
                        ) : ingredient.isAllergen ? (
                          <Badge variant="warning" size="sm">Allergen</Badge>
                        ) : (
                          <Badge variant="success" size="sm">Safe</Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {ingredient.functions.map((fn) => {
                          const displayName = functionDisplayNames[fn] || fn;
                          return (
                            <span
                              key={fn}
                              className={`inline-flex px-1.5 py-0.5 rounded text-xs ${
                                functionColors[displayName] || "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {displayName}
                            </span>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

export default async function IngredientsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const ingredients = await getIngredients(params);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IngredientsContent ingredients={ingredients} searchParams={params} />
    </Suspense>
  );
}
