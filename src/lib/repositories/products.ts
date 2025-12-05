/**
 * Product Repository
 * 
 * Server-side functions for querying product data.
 * Use only in Server Components, Route Handlers, or Server Actions.
 */

import { db } from "@/lib/db";
import type { Product, ProductCategory, Brand, Prisma } from "@prisma/client";

// ========================================
// TYPES
// ========================================

export type ProductWithBrand = Product & {
  brand: Pick<Brand, "id" | "slug" | "name">;
};

export type ProductWithIngredients = Product & {
  brand: Pick<Brand, "id" | "slug" | "name">;
  ingredients: Array<{
    position: number;
    ingredient: {
      id: string;
      slug: string;
      name: string;
      functions: string[];
      isFungalAcneTrigger: boolean;
      isAllergen: boolean;
    };
  }>;
};

export type ProductSummary = Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "category"
  | "imageUrl"
  | "safetyScore"
  | "isFungalAcneSafe"
  | "averageRating"
> & {
  brand: Pick<Brand, "id" | "slug" | "name">;
};

export interface ProductSearchParams {
  query?: string;
  brandSlug?: string;
  category?: ProductCategory;
  isFungalAcneSafe?: boolean;
  minRating?: number;
  ingredientSlug?: string;
  excludeIngredientSlug?: string;
  sortBy?: "name" | "rating" | "newest";
  limit?: number;
  offset?: number;
}

// ========================================
// QUERIES
// ========================================

/**
 * Get a single product by its URL slug with full details.
 */
export async function getProductBySlug(
  slug: string
): Promise<ProductWithIngredients | null> {
  return db.product.findUnique({
    where: { slug },
    include: {
      brand: {
        select: { id: true, slug: true, name: true },
      },
      ingredients: {
        orderBy: { position: "asc" },
        include: {
          ingredient: {
            select: {
              id: true,
              slug: true,
              name: true,
              functions: true,
              isFungalAcneTrigger: true,
              isAllergen: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Get a single product by ID.
 */
export async function getProductById(
  id: string
): Promise<ProductWithBrand | null> {
  return db.product.findUnique({
    where: { id },
    include: {
      brand: {
        select: { id: true, slug: true, name: true },
      },
    },
  });
}

/**
 * Search products with filters.
 */
export async function searchProducts(
  params: ProductSearchParams
): Promise<{ products: ProductSummary[]; total: number }> {
  const {
    query,
    brandSlug,
    category,
    isFungalAcneSafe,
    minRating,
    ingredientSlug,
    excludeIngredientSlug,
    sortBy = "name",
    limit = 20,
    offset = 0,
  } = params;

  // Build where clause
  const where: Prisma.ProductWhereInput = {
    isDiscontinued: false,
  };

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { brand: { name: { contains: query, mode: "insensitive" } } },
    ];
  }

  if (brandSlug) {
    where.brand = { slug: brandSlug };
  }

  if (category) {
    where.category = category;
  }

  if (isFungalAcneSafe === true) {
    where.isFungalAcneSafe = true;
  }

  if (minRating !== undefined) {
    where.averageRating = { gte: minRating };
  }

  if (ingredientSlug) {
    where.ingredients = {
      some: {
        ingredient: { slug: ingredientSlug },
      },
    };
  }

  if (excludeIngredientSlug) {
    where.ingredients = {
      none: {
        ingredient: { slug: excludeIngredientSlug },
      },
    };
  }

  // Build orderBy
  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sortBy === "rating"
      ? { averageRating: "desc" }
      : sortBy === "newest"
      ? { createdAt: "desc" }
      : { name: "asc" };

  // Execute query with count
  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        imageUrl: true,
        safetyScore: true,
        isFungalAcneSafe: true,
        averageRating: true,
        brand: {
          select: { id: true, slug: true, name: true },
        },
      },
      orderBy,
      take: limit,
      skip: offset,
    }),
    db.product.count({ where }),
  ]);

  return { products, total };
}

/**
 * List products by category.
 */
export async function listProductsByCategory(
  category: ProductCategory,
  limit = 50
): Promise<ProductSummary[]> {
  return db.product.findMany({
    where: {
      category,
      isDiscontinued: false,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      imageUrl: true,
      safetyScore: true,
      isFungalAcneSafe: true,
      averageRating: true,
      brand: {
        select: { id: true, slug: true, name: true },
      },
    },
    orderBy: { averageRating: "desc" },
    take: limit,
  });
}

/**
 * List products containing a specific ingredient.
 */
export async function listProductsByIngredientSlug(
  ingredientSlug: string,
  limit = 20
): Promise<ProductSummary[]> {
  return db.product.findMany({
    where: {
      isDiscontinued: false,
      ingredients: {
        some: {
          ingredient: { slug: ingredientSlug },
        },
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      imageUrl: true,
      safetyScore: true,
      isFungalAcneSafe: true,
      averageRating: true,
      brand: {
        select: { id: true, slug: true, name: true },
      },
    },
    orderBy: { averageRating: "desc" },
    take: limit,
  });
}

/**
 * List fungal acne safe products.
 */
export async function listFungalAcneSafeProducts(
  category?: ProductCategory,
  limit = 50
): Promise<ProductSummary[]> {
  return db.product.findMany({
    where: {
      isDiscontinued: false,
      isFungalAcneSafe: true,
      ...(category && { category }),
    },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      imageUrl: true,
      safetyScore: true,
      isFungalAcneSafe: true,
      averageRating: true,
      brand: {
        select: { id: true, slug: true, name: true },
      },
    },
    orderBy: { averageRating: "desc" },
    take: limit,
  });
}

/**
 * Get product suggestions for autocomplete.
 */
export async function getProductSuggestions(
  query: string,
  limit = 10
): Promise<Pick<Product, "id" | "slug" | "name">[]> {
  if (!query || query.length < 2) {
    return [];
  }

  return db.product.findMany({
    where: {
      isDiscontinued: false,
      OR: [
        { name: { startsWith: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
        { brand: { name: { startsWith: query, mode: "insensitive" } } },
      ],
    },
    select: {
      id: true,
      slug: true,
      name: true,
    },
    orderBy: { name: "asc" },
    take: limit,
  });
}

/**
 * Get related products (same category, similar safety profile).
 */
export async function getRelatedProducts(
  productId: string,
  limit = 6
): Promise<ProductSummary[]> {
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { category: true, isFungalAcneSafe: true },
  });

  if (!product) return [];

  return db.product.findMany({
    where: {
      id: { not: productId },
      isDiscontinued: false,
      category: product.category,
      isFungalAcneSafe: product.isFungalAcneSafe,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      imageUrl: true,
      safetyScore: true,
      isFungalAcneSafe: true,
      averageRating: true,
      brand: {
        select: { id: true, slug: true, name: true },
      },
    },
    orderBy: { averageRating: "desc" },
    take: limit,
  });
}

