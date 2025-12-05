import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Card, CardContent, Badge, Button } from "@/components/ui";

// Sample products data (to be replaced with database)
const productsData: Record<string, {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: string;
  description: string;
  isFungalAcneSafe: boolean;
  safetyScore: string;
  attributes: string[];
  ingredients: Array<{
    name: string;
    slug: string;
    function: string;
    isSafe: boolean;
  }>;
}> = {
  "cosrx-advanced-snail-92-cream": {
    id: "cosrx-snail-92",
    slug: "cosrx-advanced-snail-92-cream",
    brand: "COSRX",
    name: "Advanced Snail 92 All in One Cream",
    category: "Moisturizer",
    description: "A lightweight, gel-type moisturizer that contains 92% snail secretion filtrate to nourish and repair damaged skin while providing intense hydration.",
    isFungalAcneSafe: true,
    safetyScore: "Excellent",
    attributes: ["Sulfate-Free", "Alcohol-Free", "Lightweight", "Hydrating"],
    ingredients: [
      { name: "Snail Secretion Filtrate", slug: "snail-secretion-filtrate", function: "Healing", isSafe: true },
      { name: "Betaine", slug: "betaine", function: "Moisturizing", isSafe: true },
      { name: "Hyaluronic Acid", slug: "hyaluronic-acid", function: "Moisturizing", isSafe: true },
      { name: "Allantoin", slug: "allantoin", function: "Soothing", isSafe: true },
    ],
  },
  "the-ordinary-natural-moisturizing-factors": {
    id: "ordinary-nmf",
    slug: "the-ordinary-natural-moisturizing-factors",
    brand: "The Ordinary",
    name: "Natural Moisturizing Factors + HA",
    category: "Moisturizer",
    description: "A non-greasy moisturizer that offers direct support to the skin barrier with amino acids, fatty acids, triglycerides, urea, ceramides, and more.",
    isFungalAcneSafe: true,
    safetyScore: "Good",
    attributes: ["Vegan", "Silicone-Free", "Affordable", "Barrier Support"],
    ingredients: [
      { name: "Glycerin", slug: "glycerin", function: "Moisturizing", isSafe: true },
      { name: "Hyaluronic Acid", slug: "hyaluronic-acid", function: "Moisturizing", isSafe: true },
      { name: "Urea", slug: "urea", function: "Exfoliating", isSafe: true },
      { name: "Ceramide NP", slug: "ceramide-np", function: "Barrier Support", isSafe: true },
    ],
  },
  "la-roche-posay-toleriane-double-repair": {
    id: "lrp-toleriane",
    slug: "la-roche-posay-toleriane-double-repair",
    brand: "La Roche-Posay",
    name: "Toleriane Double Repair Face Moisturizer",
    category: "Moisturizer",
    description: "A daily face moisturizer that helps restore the skin's natural protective barrier while providing 48-hour hydration.",
    isFungalAcneSafe: false,
    safetyScore: "Fair",
    attributes: ["Fragrance-Free", "Non-Comedogenic", "Dermatologist Tested"],
    ingredients: [
      { name: "Niacinamide", slug: "niacinamide", function: "Brightening", isSafe: true },
      { name: "Glycerin", slug: "glycerin", function: "Moisturizing", isSafe: true },
      { name: "Shea Butter", slug: "shea-butter", function: "Moisturizing", isSafe: false },
      { name: "Ceramide 3", slug: "ceramide-3", function: "Barrier Support", isSafe: true },
    ],
  },
  "cerave-daily-moisturizing-lotion": {
    id: "cerave-daily",
    slug: "cerave-daily-moisturizing-lotion",
    brand: "CeraVe",
    name: "Daily Moisturizing Lotion",
    category: "Moisturizer",
    description: "A lightweight, oil-free moisturizer with essential ceramides and hyaluronic acid to help restore the skin's natural barrier.",
    isFungalAcneSafe: true,
    safetyScore: "Excellent",
    attributes: ["Ceramides", "Oil-Free", "Non-Comedogenic", "Fragrance-Free"],
    ingredients: [
      { name: "Ceramide AP", slug: "ceramide-ap", function: "Barrier Support", isSafe: true },
      { name: "Ceramide EOP", slug: "ceramide-eop", function: "Barrier Support", isSafe: true },
      { name: "Hyaluronic Acid", slug: "hyaluronic-acid", function: "Moisturizing", isSafe: true },
      { name: "Niacinamide", slug: "niacinamide", function: "Brightening", isSafe: true },
    ],
  },
  "paulas-choice-bha-liquid-exfoliant": {
    id: "paula-bha",
    slug: "paulas-choice-bha-liquid-exfoliant",
    brand: "Paula's Choice",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    category: "Exfoliant",
    description: "A leave-on exfoliant with salicylic acid that unclogs pores, smooths wrinkles, and evens skin tone.",
    isFungalAcneSafe: true,
    safetyScore: "Excellent",
    attributes: ["Fragrance-Free", "Alcohol-Free", "Non-Abrasive"],
    ingredients: [
      { name: "Salicylic Acid", slug: "salicylic-acid", function: "Exfoliating", isSafe: true },
      { name: "Green Tea Extract", slug: "green-tea-extract", function: "Antioxidant", isSafe: true },
      { name: "Methylpropanediol", slug: "methylpropanediol", function: "Solvent", isSafe: true },
    ],
  },
  "cerave-hydrating-facial-cleanser": {
    id: "cerave-cleanser",
    slug: "cerave-hydrating-facial-cleanser",
    brand: "CeraVe",
    name: "Hydrating Facial Cleanser",
    category: "Cleanser",
    description: "A gentle, non-foaming cleanser that removes dirt and makeup while maintaining the skin's natural moisture barrier.",
    isFungalAcneSafe: true,
    safetyScore: "Excellent",
    attributes: ["Non-Comedogenic", "Fragrance-Free", "Gentle"],
    ingredients: [
      { name: "Ceramide AP", slug: "ceramide-ap", function: "Barrier Support", isSafe: true },
      { name: "Hyaluronic Acid", slug: "hyaluronic-acid", function: "Moisturizing", isSafe: true },
      { name: "Glycerin", slug: "glycerin", function: "Moisturizing", isSafe: true },
    ],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = productsData[slug];
  
  if (!product) {
    return {
      title: "Product Not Found | Skintelect",
    };
  }

  return {
    title: `${product.name} by ${product.brand} – Ingredient Analysis | Skintelect`,
    description: product.description,
    openGraph: {
      title: `${product.name} – ${product.brand}`,
      description: product.description,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = productsData[slug];

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="border-b border-slate-100 bg-gradient-subtle py-8">
        <Container size="md">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-5">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/products" className="hover:text-slate-900 transition-colors">Products</Link>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 truncate">{product.name}</span>
          </nav>

          {/* Product Info */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                {product.brand}
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-1 mt-1">
                {product.name}
              </h1>
              <p className="text-sm text-slate-500">{product.category}</p>
              
              <div className="flex flex-wrap gap-1.5 mt-3">
                {product.attributes.map((attr) => (
                  <span
                    key={attr}
                    className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>

            {/* Safety Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={product.isFungalAcneSafe ? "success" : "warning"}>
                {product.isFungalAcneSafe ? "FA Safe" : "FA Risk"}
              </Badge>
              <Badge variant={product.safetyScore === "Excellent" ? "success" : product.safetyScore === "Good" ? "info" : "warning"}>
                Safety: {product.safetyScore}
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
              <Card variant="outlined">
                <CardContent>
                  <h2 className="text-sm font-semibold text-slate-900 mb-2">About</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>

              {/* Key Ingredients */}
              <Card variant="outlined">
                <CardContent>
                  <h2 className="text-sm font-semibold text-slate-900 mb-4">Key Ingredients</h2>
                  <div className="space-y-3">
                    {product.ingredients.map((ingredient) => (
                      <Link
                        key={ingredient.slug}
                        href={`/ingredients/${ingredient.slug}`}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">{ingredient.name}</p>
                          <p className="text-xs text-slate-500">{ingredient.function}</p>
                        </div>
                        <Badge variant={ingredient.isSafe ? "success" : "warning"} size="sm">
                          {ingredient.isSafe ? "Safe" : "Caution"}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Coming Soon: Full Ingredient List */}
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                <p className="text-sm text-slate-500">
                  Full ingredient analysis coming soon
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Where to Buy (Affiliate placeholder) */}
              <Card variant="outlined">
                <CardContent>
                  <h2 className="text-sm font-semibold text-slate-900 mb-3">Where to Buy</h2>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors">
                      <span>Shop at Amazon</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors">
                      <span>Shop at Sephora</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3">
                    Links may be affiliate links. We may earn a commission at no extra cost to you.
                  </p>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="space-y-2">
                <Link href="/analyze" className="block">
                  <Button className="w-full justify-center">
                    Analyze Full Ingredients
                  </Button>
                </Link>
                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full justify-center">
                    Browse More Products
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

