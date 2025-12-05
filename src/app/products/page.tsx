import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Card, CardContent, Input } from "@/components/ui";

export const metadata: Metadata = {
  title: "Browse Skincare Products | Skintelect",
  description:
    "Explore our database of skincare products analyzed for comedogenic ingredients, allergens, and fungal acne triggers.",
};

// Sample products (to be replaced with database)
const sampleProducts = [
  {
    id: "cosrx-snail-92",
    slug: "cosrx-advanced-snail-92-cream",
    brand: "COSRX",
    name: "Advanced Snail 92 All in One Cream",
    category: "Moisturizer",
    matchScore: 98,
    attributes: ["Sulfate-Free", "Alcohol-Free"],
    safetyScore: "Excellent",
    isFungalAcneSafe: true,
  },
  {
    id: "ordinary-nmf",
    slug: "the-ordinary-natural-moisturizing-factors",
    brand: "The Ordinary",
    name: "Natural Moisturizing Factors + HA",
    category: "Moisturizer",
    matchScore: 85,
    attributes: ["Vegan", "Silicone-Free"],
    safetyScore: "Good",
    isFungalAcneSafe: true,
  },
  {
    id: "lrp-toleriane",
    slug: "la-roche-posay-toleriane-double-repair",
    brand: "La Roche-Posay",
    name: "Toleriane Double Repair Face Moisturizer",
    category: "Moisturizer",
    matchScore: 92,
    attributes: ["Fragrance-Free", "Non-Comedogenic"],
    safetyScore: "Fair",
    isFungalAcneSafe: false,
  },
  {
    id: "cerave-daily",
    slug: "cerave-daily-moisturizing-lotion",
    brand: "CeraVe",
    name: "Daily Moisturizing Lotion",
    category: "Moisturizer",
    matchScore: 95,
    attributes: ["Ceramides", "Oil-Free"],
    safetyScore: "Excellent",
    isFungalAcneSafe: true,
  },
  {
    id: "paula-bha",
    slug: "paulas-choice-bha-liquid-exfoliant",
    brand: "Paula's Choice",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    category: "Exfoliant",
    matchScore: 97,
    attributes: ["Fragrance-Free", "Alcohol-Free"],
    safetyScore: "Excellent",
    isFungalAcneSafe: true,
  },
  {
    id: "cerave-cleanser",
    slug: "cerave-hydrating-facial-cleanser",
    brand: "CeraVe",
    name: "Hydrating Facial Cleanser",
    category: "Cleanser",
    matchScore: 94,
    attributes: ["Non-Comedogenic", "Fragrance-Free"],
    safetyScore: "Excellent",
    isFungalAcneSafe: true,
  },
];

const categories = ["All", "Moisturizers", "Cleansers", "Serums", "Exfoliants", "Sunscreens"];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white py-10">
        <Container>
          <div className="max-w-xl mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
              Browse Products
            </h1>
            <p className="text-slate-600">
              Explore our database of skincare products, analyzed for safety and efficacy.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-9 h-10"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-5">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  index === 0
                    ? "bg-rose-500 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Product Grid */}
      <section className="py-10">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <Card hover className="h-full">
                  <CardContent>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                          {product.brand}
                        </p>
                        <h3 className="text-sm font-semibold text-slate-900 mt-0.5">
                          {product.name}
                        </h3>
                      </div>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          product.isFungalAcneSafe
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {product.isFungalAcneSafe ? "FA Safe" : "FA Risk"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-3">{product.category}</p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.attributes.map((attr) => (
                        <span
                          key={attr}
                          className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600"
                        >
                          {attr}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        Match: <span className="font-medium text-slate-700">{product.matchScore}%</span>
                      </span>
                      <span className="text-xs text-slate-500">
                        Safety: <span className="font-medium text-slate-700">{product.safetyScore}</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Coming Soon Note */}
          <div className="mt-12 text-center py-8 border border-dashed border-slate-200 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              More products coming soon. We&apos;re continuously expanding our database with
              ingredient analysis for popular skincare products.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}

