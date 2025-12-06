import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui";
import { AffiliateOffers } from "@/components/affiliate-offers";
import {
  ProductHeader,
  ProductStats,
  SafetyProfile,
  StarIngredients,
  SkinBenefits,
  ProductConcerns,
  IngredientBreakdown,
  RelatedProducts,
} from "@/components/product";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { 
  getProductWithFullDetails, 
  getRelatedProductsForDisplay,
  type ProductWithFullDetails,
} from "@/lib/repositories/products";
import { 
  getOffersForProduct, 
  type AffiliateOfferSummary 
} from "@/lib/repositories/affiliate-offers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skintelect.com";

// ========================================
// FALLBACK DATA
// ========================================
// Used when database is not available

interface FallbackProduct {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: string;
  description: string;
  safetyScore: number;
  isFungalAcneSafe: boolean;
  isFragranceFree: boolean;
  isAlcoholFree: boolean;
  isParabenFree: boolean;
  isSulfateFree: boolean;
  isSiliconeFree: boolean;
  isOilFree: boolean;
  isVegan: boolean;
  isCrueltyFree: boolean;
  isReefSafe: boolean;
  ingredientCount: number;
  activeCount: number;
  triggerCount: number;
  averageRating: number | null;
  reviewCount: number;
  ingredients: Array<{
    position: number;
    isHighlighted: boolean;
    customNote: string | null;
    ingredient: {
      id: string;
      slug: string;
      name: string;
      inciName: string | null;
      functions: string[];
      isActive: boolean;
      comedogenicRating: number | null;
      irritationLevel: number | null;
      isFungalAcneTrigger: boolean;
      isAllergen: boolean;
      description: string | null;
    };
  }>;
  benefits: Array<{
    benefit: string;
    ingredientCount: number;
    description: string | null;
  }>;
  concerns: Array<{
    id: string;
    title: string;
    description: string | null;
    severity: string;
    ingredient: { id: string; slug: string; name: string } | null;
  }>;
}

const fallbackProductsData: Record<string, FallbackProduct> = {
  "cosrx-advanced-snail-92-cream": {
    id: "cosrx-snail-92",
    slug: "cosrx-advanced-snail-92-cream",
    brand: "COSRX",
    name: "Advanced Snail 92 All in One Cream",
    category: "moisturizer",
    description: "A lightweight, gel-type moisturizer that contains 92% snail secretion filtrate to nourish and repair damaged skin while providing intense hydration. Perfect for all skin types, including sensitive and acne-prone skin.",
    safetyScore: 9.2,
    isFungalAcneSafe: true,
    isFragranceFree: true,
    isAlcoholFree: true,
    isParabenFree: true,
    isSulfateFree: true,
    isSiliconeFree: true,
    isOilFree: true,
    isVegan: false,
    isCrueltyFree: true,
    isReefSafe: true,
    ingredientCount: 4,
    activeCount: 2,
    triggerCount: 0,
    averageRating: 4.5,
    reviewCount: 128,
    ingredients: [
      { 
        position: 1, 
        isHighlighted: true,
        customNote: "Main active ingredient at 92% concentration",
        ingredient: { 
          id: "1", 
          name: "Snail Secretion Filtrate", 
          slug: "snail-secretion-filtrate",
          inciName: "Snail Secretion Filtrate",
          functions: ["moisturizing", "soothing", "anti_aging"],
          isActive: true,
          comedogenicRating: 0,
          irritationLevel: 0,
          isFungalAcneTrigger: false,
          isAllergen: false,
          description: "A powerful multi-functional ingredient that promotes skin repair, hydration, and anti-aging benefits.",
        } 
      },
      { 
        position: 2, 
        isHighlighted: false,
        customNote: null,
        ingredient: { 
          id: "2", 
          name: "Betaine", 
          slug: "betaine",
          inciName: "Betaine",
          functions: ["moisturizing", "soothing"],
          isActive: false,
          comedogenicRating: 0,
          irritationLevel: 0,
          isFungalAcneTrigger: false,
          isAllergen: false,
          description: "A gentle humectant derived from sugar beets that helps retain moisture.",
        } 
      },
      { 
        position: 3, 
        isHighlighted: true,
        customNote: null,
        ingredient: { 
          id: "3", 
          name: "Hyaluronic Acid", 
          slug: "hyaluronic-acid",
          inciName: "Sodium Hyaluronate",
          functions: ["moisturizing", "humectant", "anti_aging"],
          isActive: true,
          comedogenicRating: 0,
          irritationLevel: 0,
          isFungalAcneTrigger: false,
          isAllergen: false,
          description: "Can hold up to 1000x its weight in water, providing deep and lasting hydration.",
        } 
      },
      { 
        position: 4, 
        isHighlighted: false,
        customNote: null,
        ingredient: { 
          id: "4", 
          name: "Allantoin", 
          slug: "allantoin",
          inciName: "Allantoin",
          functions: ["soothing", "moisturizing"],
          isActive: false,
          comedogenicRating: 0,
          irritationLevel: 0,
          isFungalAcneTrigger: false,
          isAllergen: false,
          description: "A gentle soothing agent that promotes skin healing and cell regeneration.",
        } 
      },
    ],
    benefits: [
      { benefit: "hydrating", ingredientCount: 4, description: "Deep moisture from multiple humectants" },
      { benefit: "anti_aging", ingredientCount: 2, description: "Promotes collagen and reduces fine lines" },
      { benefit: "soothing", ingredientCount: 3, description: "Calms irritation and redness" },
      { benefit: "barrier_repair", ingredientCount: 2, description: "Strengthens skin barrier" },
    ],
    concerns: [],
  },
  "paulas-choice-bha-liquid-exfoliant": {
    id: "paula-bha",
    slug: "paulas-choice-bha-liquid-exfoliant",
    brand: "Paula's Choice",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    category: "exfoliant",
    description: "A cult-favorite leave-on exfoliant with 2% salicylic acid that unclogs pores, smooths wrinkles, and evens skin tone. Suitable for all skin types including sensitive skin.",
    safetyScore: 8.5,
    isFungalAcneSafe: true,
    isFragranceFree: true,
    isAlcoholFree: false,
    isParabenFree: true,
    isSulfateFree: true,
    isSiliconeFree: true,
    isOilFree: true,
    isVegan: true,
    isCrueltyFree: true,
    isReefSafe: true,
    ingredientCount: 3,
    activeCount: 2,
    triggerCount: 0,
    averageRating: 4.7,
    reviewCount: 512,
    ingredients: [
      { 
        position: 1, 
        isHighlighted: true,
        customNote: "Main exfoliating active",
        ingredient: { 
          id: "13", 
          name: "Salicylic Acid", 
          slug: "salicylic-acid",
          inciName: "Salicylic Acid",
          functions: ["exfoliating", "acne_fighting"],
          isActive: true,
          comedogenicRating: 0,
          irritationLevel: 2,
          isFungalAcneTrigger: false,
          isAllergen: false,
          description: "A BHA that penetrates deep into pores to dissolve oil and dead skin cells.",
        } 
      },
      { 
        position: 2, 
        isHighlighted: true,
        customNote: null,
        ingredient: { 
          id: "14", 
          name: "Green Tea Extract", 
          slug: "green-tea-extract",
          inciName: "Camellia Sinensis Leaf Extract",
          functions: ["antioxidant", "soothing"],
          isActive: true,
          comedogenicRating: 0,
          irritationLevel: 0,
          isFungalAcneTrigger: false,
          isAllergen: false,
          description: "Rich in polyphenols that protect skin from environmental damage.",
        } 
      },
      { 
        position: 3, 
        isHighlighted: false,
        customNote: null,
        ingredient: { 
          id: "15", 
          name: "Methylpropanediol", 
          slug: "methylpropanediol",
          inciName: "Methylpropanediol",
          functions: ["solvent", "moisturizing"],
          isActive: false,
          comedogenicRating: 0,
          irritationLevel: 0,
          isFungalAcneTrigger: false,
          isAllergen: false,
          description: "A lightweight solvent that helps other ingredients penetrate the skin.",
        } 
      },
    ],
    benefits: [
      { benefit: "exfoliating", ingredientCount: 1, description: "Removes dead skin cells" },
      { benefit: "acne_fighting", ingredientCount: 1, description: "Unclogs pores and prevents breakouts" },
      { benefit: "pore_minimizing", ingredientCount: 1, description: "Reduces appearance of pores" },
      { benefit: "brightening", ingredientCount: 1, description: "Evens skin tone" },
    ],
    concerns: [
      {
        id: "concern-1",
        title: "May increase sun sensitivity",
        description: "BHA can make skin more sensitive to UV rays. Use SPF daily.",
        severity: "medium",
        ingredient: { id: "13", slug: "salicylic-acid", name: "Salicylic Acid" },
      },
    ],
  },
};

// ========================================
// TYPES
// ========================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface NormalizedOffer {
  id: string;
  retailerName: string;
  retailerSlug: string;
  currency: string;
  price: number | null;
  originalPrice: number | null;
  availability: "in_stock" | "low_stock" | "preorder" | "out_of_stock" | "unknown";
}

interface NormalizedProduct extends Omit<FallbackProduct, "brand"> {
  brand: string;
  offers: NormalizedOffer[];
}

// ========================================
// DATA FETCHING
// ========================================

function normalizeDbProduct(
  product: ProductWithFullDetails, 
  offers: AffiliateOfferSummary[]
): NormalizedProduct {
  return {
    id: product.id,
    slug: product.slug,
    brand: product.brand.name,
    name: product.name,
    category: product.category,
    description: product.description || "",
    safetyScore: product.safetyScore,
    isFungalAcneSafe: product.isFungalAcneSafe,
    isFragranceFree: product.isFragranceFree,
    isAlcoholFree: product.isAlcoholFree,
    isParabenFree: product.isParabenFree,
    isSulfateFree: product.isSulfateFree,
    isSiliconeFree: product.isSiliconeFree,
    isOilFree: product.isOilFree,
    isVegan: product.isVegan,
    isCrueltyFree: product.isCrueltyFree,
    isReefSafe: product.isReefSafe,
    ingredientCount: product.ingredientCount,
    activeCount: product.activeCount,
    triggerCount: product.triggerCount,
    averageRating: product.averageRating,
    reviewCount: product.reviewCount,
    ingredients: product.ingredients.map((pi) => ({
      position: pi.position,
      isHighlighted: pi.isHighlighted,
      customNote: pi.customNote,
      ingredient: {
        id: pi.ingredient.id,
        slug: pi.ingredient.slug,
        name: pi.ingredient.name,
        inciName: pi.ingredient.inciName,
        functions: pi.ingredient.functions as string[],
        isActive: pi.ingredient.isActive,
        comedogenicRating: pi.ingredient.comedogenicRating,
        irritationLevel: pi.ingredient.irritationLevel,
        isFungalAcneTrigger: pi.ingredient.isFungalAcneTrigger,
        isAllergen: pi.ingredient.isAllergen,
        description: pi.ingredient.description,
      },
    })),
    benefits: product.benefits.map((b) => ({
      benefit: b.benefit,
      ingredientCount: b.ingredientCount,
      description: b.description,
    })),
    concerns: product.concerns.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      severity: c.severity,
      ingredient: c.ingredient,
    })),
    offers: offers.map((offer) => ({
      id: offer.id,
      retailerName: offer.retailerName,
      retailerSlug: offer.retailerSlug,
      currency: offer.currency,
      price: offer.price ? Number(offer.price) : null,
      originalPrice: offer.originalPrice ? Number(offer.originalPrice) : null,
      availability: offer.availability as NormalizedOffer["availability"],
    })),
  };
}

async function getProduct(slug: string): Promise<NormalizedProduct | null> {
  try {
    const product = await getProductWithFullDetails(slug);
    if (product) {
      let offers: AffiliateOfferSummary[] = [];
      try {
        offers = await getOffersForProduct({ productId: product.id });
      } catch {
        // Offers not available - continue without them
      }
      return normalizeDbProduct(product, offers);
    }
    const fallback = fallbackProductsData[slug];
    return fallback ? { ...fallback, offers: [] } : null;
  } catch {
    console.log("Database not available, using fallback product data for:", slug);
    const fallback = fallbackProductsData[slug];
    return fallback ? { ...fallback, offers: [] } : null;
  }
}

// ========================================
// METADATA
// ========================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: "Product Not Found | Skintelect",
    };
  }

  const safetyInfo = product.isFungalAcneSafe 
    ? "Fungal acne safe" 
    : "Contains potential fungal acne triggers";

  return {
    title: `${product.name} by ${product.brand} – Ingredient Analysis | Skintelect`,
    description: `${product.description} ${safetyInfo}. Safety Score: ${product.safetyScore}/10.`,
    keywords: [
      product.name.toLowerCase(),
      product.brand.toLowerCase(),
      product.category.toLowerCase(),
      "skincare",
      "ingredient analysis",
      product.isFungalAcneSafe ? "fungal acne safe" : "fungal acne",
      "skintelect",
    ],
    openGraph: {
      title: `${product.name} by ${product.brand} | Skintelect`,
      description: product.description || "",
      type: "website",
      url: `${siteUrl}/products/${slug}`,
    },
    twitter: {
      card: "summary",
      title: `${product.name} by ${product.brand}`,
      description: product.description || "",
    },
  };
}

// ========================================
// PAGE COMPONENT
// ========================================

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products
  let relatedProducts: Awaited<ReturnType<typeof getRelatedProductsForDisplay>> = [];
  try {
    relatedProducts = await getRelatedProductsForDisplay(product.id);
  } catch {
    // Continue without related products
  }

  // Get star ingredients (highlighted or first active ingredients)
  const starIngredients = product.ingredients
    .filter((pi) => pi.isHighlighted || pi.ingredient.isActive)
    .slice(0, 4)
    .map((pi) => ({
      id: pi.ingredient.id,
      slug: pi.ingredient.slug,
      name: pi.ingredient.name,
      description: pi.ingredient.description || undefined,
      functions: pi.ingredient.functions,
    }));

  // Generate structured data for SEO
  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description || "",
    brandName: product.brand,
    slug: product.slug,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Products", url: `${siteUrl}/products` },
    { name: product.name },
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Page Header */}
      <section className="border-b border-slate-200 bg-white py-8">
        <Container size="lg">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/products" className="hover:text-slate-900 transition-colors">Products</Link>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 truncate">{product.name}</span>
          </nav>

          {/* Product Header */}
          <ProductHeader
            brand={product.brand}
            name={product.name}
            category={product.category}
            description={product.description}
            rating={product.averageRating}
            reviewCount={product.reviewCount}
            safetyScore={product.safetyScore}
            isFungalAcneSafe={product.isFungalAcneSafe}
          />
        </Container>
      </section>

      {/* Quick Stats */}
      <section className="py-6 bg-white border-b border-slate-200">
        <Container size="lg">
          <ProductStats
            ingredientCount={product.ingredientCount}
            triggerCount={product.triggerCount}
            activeCount={product.activeCount}
            isVegan={product.isVegan}
            isCrueltyFree={product.isCrueltyFree}
          />
        </Container>
      </section>

      {/* Safety Profile */}
      <section className="py-6">
        <Container size="lg">
          <SafetyProfile
            isFungalAcneSafe={product.isFungalAcneSafe}
            isFragranceFree={product.isFragranceFree}
            isAlcoholFree={product.isAlcoholFree}
            isParabenFree={product.isParabenFree}
            isSulfateFree={product.isSulfateFree}
            isSiliconeFree={product.isSiliconeFree}
            isOilFree={product.isOilFree}
            isVegan={product.isVegan}
            isCrueltyFree={product.isCrueltyFree}
            isReefSafe={product.isReefSafe}
          />
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-6">
        <Container size="lg">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Star Ingredients */}
              {starIngredients.length > 0 && (
                <StarIngredients ingredients={starIngredients} />
              )}

              {/* Full Ingredient Breakdown */}
              <IngredientBreakdown
                ingredients={product.ingredients}
              />
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Where to Buy */}
              <AffiliateOffers offers={product.offers} productName={product.name} />

              {/* Skin Benefits */}
              {product.benefits.length > 0 && (
                <SkinBenefits benefits={product.benefits} />
              )}

              {/* Product Concerns */}
              {product.concerns.length > 0 && (
                <ProductConcerns concerns={product.concerns} />
              )}

              {/* Actions */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                <Link href="/analyze" className="block">
                  <Button className="w-full justify-center">
                    Analyze Your Ingredients
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

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-6 border-t border-slate-200">
          <Container size="lg">
            <RelatedProducts products={relatedProducts} />
          </Container>
        </section>
      )}
    </div>
  );
}
