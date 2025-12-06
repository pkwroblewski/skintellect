import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, Badge, Input } from "@/components/ui";
import { searchProducts } from "@/lib/repositories/products";

export const metadata: Metadata = {
  title: "Browse Skincare Products - Analyzed for Safety | Skintelect",
  description:
    "Explore our database of skincare products analyzed for comedogenic ingredients, allergens, and fungal acne triggers. Find safe products for your skin type.",
  keywords: [
    "skincare products",
    "fungal acne safe products",
    "non-comedogenic products",
    "product ingredient analysis",
    "skincare database",
    "moisturizers",
    "cleansers",
    "serums",
  ],
  openGraph: {
    title: "Browse Skincare Products | Skintelect",
    description:
      "Explore our database of skincare products analyzed for comedogenic ingredients, allergens, and fungal acne triggers.",
    type: "website",
  },
};

// Simplified product type for display
interface DisplayProduct {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: string;
  isFungalAcneSafe: boolean;
  ingredientCount: number;
}

// Fallback data when database is not available
const fallbackProducts: DisplayProduct[] = [
  {
    id: "cosrx-snail-92",
    slug: "cosrx-advanced-snail-92-cream",
    brand: "COSRX",
    name: "Advanced Snail 92 All in One Cream",
    category: "moisturizer",
    isFungalAcneSafe: true,
    ingredientCount: 15,
  },
  {
    id: "ordinary-nmf",
    slug: "the-ordinary-natural-moisturizing-factors",
    brand: "The Ordinary",
    name: "Natural Moisturizing Factors + HA",
    category: "moisturizer",
    isFungalAcneSafe: true,
    ingredientCount: 20,
  },
  {
    id: "lrp-toleriane",
    slug: "la-roche-posay-toleriane-double-repair",
    brand: "La Roche-Posay",
    name: "Toleriane Double Repair Face Moisturizer",
    category: "moisturizer",
    isFungalAcneSafe: false,
    ingredientCount: 25,
  },
  {
    id: "cerave-daily",
    slug: "cerave-daily-moisturizing-lotion",
    brand: "CeraVe",
    name: "Daily Moisturizing Lotion",
    category: "moisturizer",
    isFungalAcneSafe: true,
    ingredientCount: 18,
  },
  {
    id: "paula-bha",
    slug: "paulas-choice-bha-liquid-exfoliant",
    brand: "Paula's Choice",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    category: "exfoliant",
    isFungalAcneSafe: true,
    ingredientCount: 12,
  },
  {
    id: "cerave-cleanser",
    slug: "cerave-hydrating-facial-cleanser",
    brand: "CeraVe",
    name: "Hydrating Facial Cleanser",
    category: "cleanser",
    isFungalAcneSafe: true,
    ingredientCount: 22,
  },
];

// Map database category to display string
const categoryDisplayNames: Record<string, string> = {
  cleanser: "Cleanser",
  moisturizer: "Moisturizer",
  serum: "Serum",
  exfoliant: "Exfoliant",
  sunscreen: "Sunscreen",
  toner: "Toner",
  mask: "Mask",
  eye_care: "Eye Care",
  lip_care: "Lip Care",
  other: "Other",
};

// Category filter options
const categoryFilters = [
  { label: "All", value: "" },
  { label: "Cleansers", value: "cleanser" },
  { label: "Moisturizers", value: "moisturizer" },
  { label: "Serums", value: "serum" },
  { label: "Exfoliants", value: "exfoliant" },
  { label: "Sunscreens", value: "sunscreen" },
];

interface SearchParams {
  q?: string;
  category?: string;
  fa?: string;
  sort?: string;
}

/**
 * Fetches products from the database with fallback to static data.
 */
async function getProducts(searchParams: SearchParams): Promise<DisplayProduct[]> {
  const { q, category, fa, sort } = searchParams;
  
  try {
    const result = await searchProducts({
      query: q || undefined,
      category: category as "cleanser" | "moisturizer" | "serum" | "exfoliant" | "sunscreen" | "toner" | "mask" | "eye_care" | "lip_care" | "other" | undefined,
      isFungalAcneSafe: fa === "true" ? true : undefined,
      sortBy: sort === "rating" ? "rating" : sort === "newest" ? "newest" : "name",
      limit: 50,
    });
    
    if (result.products.length > 0) {
      return result.products.map(p => ({
        id: p.id,
        slug: p.slug,
        brand: p.brand.name,
        name: p.name,
        category: p.category,
        isFungalAcneSafe: p.isFungalAcneSafe,
        ingredientCount: 0,
      }));
    }
    return filterFallbackProducts(fallbackProducts, searchParams);
  } catch {
    console.log("Database not available, using fallback product data");
    return filterFallbackProducts(fallbackProducts, searchParams);
  }
}

/**
 * Filters fallback products based on search params.
 */
function filterFallbackProducts(products: DisplayProduct[], params: SearchParams): DisplayProduct[] {
  let filtered = [...products];
  
  if (params.q) {
    const query = params.q.toLowerCase();
    filtered = filtered.filter(
      p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)
    );
  }
  
  if (params.category) {
    filtered = filtered.filter(p => p.category === params.category);
  }
  
  if (params.fa === "true") {
    filtered = filtered.filter(p => p.isFungalAcneSafe);
  }
  
  return filtered;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

function ProductsContent({
  products,
  searchParams,
}: {
  products: DisplayProduct[];
  searchParams: SearchParams;
}) {
  const currentCategory = searchParams.category || "";
  const currentSort = searchParams.sort || "name";
  const currentFa = searchParams.fa === "true";
  const currentQuery = searchParams.q || "";

  // Build URL with query params
  const buildUrl = (params: Record<string, string>) => {
    const urlParams = new URLSearchParams();
    const merged = { q: currentQuery, category: currentCategory, fa: currentFa ? "true" : "", sort: currentSort, ...params };
    
    Object.entries(merged).forEach(([key, value]) => {
      if (value) urlParams.set(key, String(value));
    });
    
    const queryString = urlParams.toString();
    return queryString ? `/products?${queryString}` : "/products";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="border-b border-slate-100 bg-gradient-subtle py-10">
        <Container>
          <div className="max-w-xl mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
              Skincare Products
            </h1>
            <p className="text-slate-600">
              Browse products analyzed for ingredient safety, fungal acne triggers, and more.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md">
            <form action="/products" method="GET">
              {/* Preserve other params */}
              {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
              {currentFa && <input type="hidden" name="fa" value="true" />}
              {currentSort && <input type="hidden" name="sort" value={currentSort} />}
              
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
                  placeholder="Search products or brands..."
                  className="pl-9 h-10"
                  aria-label="Search products"
                />
              </div>
            </form>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-5" role="group" aria-label="Filter by category">
            {categoryFilters.map((cat) => (
              <Link
                key={cat.value}
                href={buildUrl({ category: cat.value })}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  currentCategory === cat.value
                    ? "bg-rose-500 text-white" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
                aria-current={currentCategory === cat.value ? "page" : undefined}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Link
              href={buildUrl({ fa: currentFa ? "" : "true" })}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
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

            {/* Sort dropdown */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Sort:</span>
              <Link
                href={buildUrl({ sort: "name" })}
                className={`px-2 py-1 rounded ${currentSort === "name" || !currentSort ? "bg-slate-100 font-medium" : "hover:bg-slate-50"}`}
              >
                A-Z
              </Link>
              <Link
                href={buildUrl({ sort: "rating" })}
                className={`px-2 py-1 rounded ${currentSort === "rating" ? "bg-slate-100 font-medium" : "hover:bg-slate-50"}`}
              >
                Rating
              </Link>
              <Link
                href={buildUrl({ sort: "newest" })}
                className={`px-2 py-1 rounded ${currentSort === "newest" ? "bg-slate-100 font-medium" : "hover:bg-slate-50"}`}
              >
                Newest
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Results info */}
      {(currentQuery || currentCategory || currentFa) && (
        <section className="border-b border-slate-100 py-3">
          <Container>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {products.length} {products.length === 1 ? "product" : "products"} found
                {currentQuery && <span> for &quot;{currentQuery}&quot;</span>}
              </p>
              {(currentQuery || currentCategory || currentFa) && (
                <Link
                  href="/products"
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
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">No products found matching your criteria.</p>
              <Link
                href="/products"
                className="text-rose-600 hover:text-rose-700 text-sm font-medium"
              >
                Clear filters and try again
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card hover className="h-full">
                    <CardContent>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                            {product.brand}
                          </p>
                          <h3 className="text-sm font-semibold text-slate-900">
                            {product.name}
                          </h3>
                        </div>
                        <Badge 
                          variant={product.isFungalAcneSafe ? "success" : "warning"} 
                          size="sm"
                        >
                          {product.isFungalAcneSafe ? "FA Safe" : "FA Risk"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
                        <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {categoryDisplayNames[product.category] || product.category}
                        </span>
                        {product.ingredientCount > 0 && (
                          <span>{product.ingredientCount} ingredients</span>
                        )}
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

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const products = await getProducts(params);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent products={products} searchParams={params} />
    </Suspense>
  );
}
