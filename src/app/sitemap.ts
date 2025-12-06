import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skintelect.com";

/**
 * Sitemap generation for search engine indexing.
 * 
 * Currently uses static arrays for ingredient and product slugs.
 * 
 * To switch to database-backed slugs:
 * 1. Import { getAllIngredientSlugs } from "@/lib/repositories/ingredients"
 * 2. Import { getAllProductSlugs } from "@/lib/repositories/products"
 * 3. Make this function async: export default async function sitemap()
 * 4. Replace static arrays with: const ingredientSlugs = await getAllIngredientSlugs()
 * 
 * Note: Consider caching or ISR strategies if the database grows large,
 * as sitemap generation happens on every request in production.
 */

// Static ingredient slugs (will be replaced with database query)
const ingredientSlugs = [
  "niacinamide",
  "hyaluronic-acid",
  "salicylic-acid",
  "retinol",
  "isopropyl-palmitate",
  "glycerin",
  "vitamin-c",
  "ceramides",
  "centella-asiatica",
  "coconut-oil",
  "fragrance",
  "azelaic-acid",
];

// Static product slugs (will be replaced with database query)
const productSlugs = [
  "cosrx-advanced-snail-92-cream",
  "the-ordinary-natural-moisturizing-factors",
  "la-roche-posay-toleriane-double-repair",
  "cerave-daily-moisturizing-lotion",
  "paulas-choice-bha-liquid-exfoliant",
  "cerave-hydrating-facial-cleanser",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/analyze`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/ingredients`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/routines`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Ingredient pages
  const ingredientPages: MetadataRoute.Sitemap = ingredientSlugs.map((slug) => ({
    url: `${siteUrl}/ingredients/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Product pages
  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${siteUrl}/products/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...ingredientPages, ...productPages];
}

