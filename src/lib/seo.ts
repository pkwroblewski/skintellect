/**
 * SEO Utilities
 * 
 * Helper functions for generating structured data (JSON-LD)
 * and other SEO-related functionality.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skintelect.com";

// ========================================
// TYPES
// ========================================

export interface WebsiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export interface ArticleSchema {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  author: {
    "@type": "Organization";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  datePublished?: string;
  dateModified?: string;
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
  };
}

export interface ProductSchema {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  brand: {
    "@type": "Brand";
    name: string;
  };
  image?: string;
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
  };
  offers?: {
    "@type": "Offer";
    url: string;
    priceCurrency: string;
    price: number;
    availability: string;
  };
}

export interface FAQSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }>;
}

// ========================================
// SCHEMA GENERATORS
// ========================================

/**
 * Generate WebSite schema for the homepage.
 */
export function generateWebsiteSchema(): WebsiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Skintelect",
    url: siteUrl,
    description:
      "Check products for comedogenic ingredients, allergens, and fungal acne triggers. Science-backed skincare ingredient analysis.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate Article schema for ingredient pages.
 */
export function generateIngredientArticleSchema(ingredient: {
  name: string;
  description: string;
  slug: string;
  updatedAt?: Date;
}): ArticleSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${ingredient.name} - Skincare Ingredient Guide`,
    description: ingredient.description,
    author: {
      "@type": "Organization",
      name: "Skintelect",
    },
    publisher: {
      "@type": "Organization",
      name: "Skintelect",
    },
    dateModified: ingredient.updatedAt?.toISOString() || new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/ingredients/${ingredient.slug}`,
    },
  };
}

/**
 * Generate Product schema for product pages.
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  brandName: string;
  slug: string;
  imageUrl?: string;
  averageRating?: number;
  reviewCount?: number;
  price?: number;
  currency?: string;
  availability?: "in_stock" | "out_of_stock" | "preorder";
}): ProductSchema {
  const schema: ProductSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brandName,
    },
  };

  if (product.imageUrl) {
    schema.image = product.imageUrl;
  }

  if (product.averageRating && product.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
    };
  }

  if (product.price && product.currency) {
    const availabilityMap: Record<string, string> = {
      in_stock: "https://schema.org/InStock",
      out_of_stock: "https://schema.org/OutOfStock",
      preorder: "https://schema.org/PreOrder",
    };

    schema.offers = {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: availabilityMap[product.availability || "in_stock"],
    };
  }

  return schema;
}

/**
 * Generate FAQ schema for ingredient pages.
 */
export function generateIngredientFAQSchema(ingredient: {
  name: string;
  isFungalAcneTrigger: boolean;
  isAllergen: boolean;
  comedogenicRating: number;
  functions: string[];
}): FAQSchema {
  const faqs: Array<{ question: string; answer: string }> = [];

  // FAQ: What is this ingredient?
  faqs.push({
    question: `What is ${ingredient.name} in skincare?`,
    answer: `${ingredient.name} is a skincare ingredient commonly used for ${ingredient.functions.join(", ")} purposes.`,
  });

  // FAQ: Fungal acne safe?
  faqs.push({
    question: `Is ${ingredient.name} safe for fungal acne?`,
    answer: ingredient.isFungalAcneTrigger
      ? `No, ${ingredient.name} is a known fungal acne trigger and should be avoided if you have fungal acne (malassezia folliculitis).`
      : `Yes, ${ingredient.name} is generally considered safe for fungal acne-prone skin as it is not known to feed the malassezia yeast.`,
  });

  // FAQ: Comedogenic?
  faqs.push({
    question: `Is ${ingredient.name} comedogenic?`,
    answer:
      ingredient.comedogenicRating >= 3
        ? `${ingredient.name} has a comedogenic rating of ${ingredient.comedogenicRating}/5, meaning it has a moderate to high likelihood of clogging pores.`
        : `${ingredient.name} has a comedogenic rating of ${ingredient.comedogenicRating}/5, meaning it has a low likelihood of clogging pores.`,
  });

  // FAQ: Allergen?
  if (ingredient.isAllergen) {
    faqs.push({
      question: `Can ${ingredient.name} cause allergic reactions?`,
      answer: `Yes, ${ingredient.name} is a known potential allergen. If you have sensitive skin or known allergies, perform a patch test before using products containing this ingredient.`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Breadcrumb schema.
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

// ========================================
// HELPER COMPONENTS
// ========================================

/**
 * Generate a JSON-LD script tag content.
 * Use in page components like:
 * 
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 * />
 */
export function schemaToJsonLd<T extends object>(schema: T): string {
  return JSON.stringify(schema);
}

