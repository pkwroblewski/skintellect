import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card, CardContent, Badge, Input } from "@/components/ui";

// Sample ingredients
const ingredients = [
  { id: "1", name: "Niacinamide", slug: "niacinamide", functions: ["brightening", "anti-aging"], description: "A form of vitamin B3 that helps minimize pores, improve skin texture, and brighten skin tone.", isFungalAcneTrigger: false, isAllergen: false },
  { id: "2", name: "Hyaluronic Acid", slug: "hyaluronic-acid", functions: ["moisturizing"], description: "A powerful humectant that can hold up to 1000x its weight in water.", isFungalAcneTrigger: false, isAllergen: false },
  { id: "3", name: "Salicylic Acid", slug: "salicylic-acid", functions: ["exfoliating", "acne-fighting"], description: "A beta-hydroxy acid (BHA) that penetrates pores to dissolve oil and dead skin cells.", isFungalAcneTrigger: false, isAllergen: false },
  { id: "4", name: "Retinol", slug: "retinol", functions: ["anti-aging"], description: "A vitamin A derivative that promotes cell turnover and collagen production.", isFungalAcneTrigger: false, isAllergen: false },
  { id: "5", name: "Glycerin", slug: "glycerin", functions: ["moisturizing"], description: "A humectant that draws moisture from the air into the skin.", isFungalAcneTrigger: false, isAllergen: false },
  { id: "6", name: "Vitamin C", slug: "vitamin-c", functions: ["antioxidant", "brightening"], description: "A powerful antioxidant that brightens skin and protects against free radicals.", isFungalAcneTrigger: false, isAllergen: false },
  { id: "7", name: "Ceramides", slug: "ceramides", functions: ["moisturizing"], description: "Lipid molecules that help restore the skin barrier and retain moisture.", isFungalAcneTrigger: false, isAllergen: false },
  { id: "8", name: "Centella Asiatica", slug: "centella-asiatica", functions: ["soothing"], description: "Also known as Cica, it calms irritation and helps repair damaged skin.", isFungalAcneTrigger: false, isAllergen: false },
  { id: "9", name: "Isopropyl Palmitate", slug: "isopropyl-palmitate", functions: ["emulsifier"], description: "An emollient that helps products spread smoothly but may clog pores.", isFungalAcneTrigger: true, isAllergen: false },
  { id: "10", name: "Coconut Oil", slug: "coconut-oil", functions: ["moisturizing"], description: "A natural oil that deeply moisturizes but is highly comedogenic.", isFungalAcneTrigger: true, isAllergen: false },
  { id: "11", name: "Fragrance", slug: "fragrance", functions: ["fragrance"], description: "A catch-all term for scent additives that may cause irritation.", isFungalAcneTrigger: false, isAllergen: true },
  { id: "12", name: "Azelaic Acid", slug: "azelaic-acid", functions: ["brightening", "acne-fighting"], description: "A gentle acid that brightens skin and fights acne.", isFungalAcneTrigger: false, isAllergen: false },
];

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
};

const filterTags = ["All", "Moisturizing", "Anti-aging", "Brightening", "Acne-fighting", "FA Safe"];

export default function IngredientsPage() {
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
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                type="search"
                placeholder="Search ingredients..."
                className="pl-9 h-10"
              />
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {filterTags.map((tag, index) => (
              <button
                key={tag}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  index === 0 
                    ? "bg-mint-600 text-white" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Grid */}
      <section className="py-10">
        <Container>
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

                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                      {ingredient.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {ingredient.functions.map((fn) => (
                        <span
                          key={fn}
                          className={`inline-flex px-1.5 py-0.5 rounded text-xs ${
                            functionColors[fn] || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {fn}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
