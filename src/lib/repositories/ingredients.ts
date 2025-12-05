/**
 * Ingredient Repository
 * 
 * Server-side functions for querying ingredient data.
 * Use only in Server Components, Route Handlers, or Server Actions.
 */

import { db } from "@/lib/db";
import type { Ingredient, IngredientFunction, Prisma } from "@prisma/client";

// ========================================
// TYPES
// ========================================

export type IngredientWithDetails = Ingredient;

export type IngredientSummary = Pick<
  Ingredient,
  | "id"
  | "slug"
  | "name"
  | "functions"
  | "isFungalAcneTrigger"
  | "isAllergen"
  | "comedogenicRating"
>;

export interface IngredientSearchParams {
  query?: string;
  functions?: IngredientFunction[];
  isFungalAcneSafe?: boolean;
  isAllergenFree?: boolean;
  maxComedogenicRating?: number;
  limit?: number;
  offset?: number;
}

// ========================================
// QUERIES
// ========================================

/**
 * Get a single ingredient by its URL slug.
 */
export async function getIngredientBySlug(
  slug: string
): Promise<IngredientWithDetails | null> {
  return db.ingredient.findUnique({
    where: { slug },
  });
}

/**
 * Get a single ingredient by ID.
 */
export async function getIngredientById(
  id: string
): Promise<IngredientWithDetails | null> {
  return db.ingredient.findUnique({
    where: { id },
  });
}

/**
 * Search ingredients with filters.
 */
export async function searchIngredients(
  params: IngredientSearchParams
): Promise<{ ingredients: IngredientSummary[]; total: number }> {
  const {
    query,
    functions,
    isFungalAcneSafe,
    isAllergenFree,
    maxComedogenicRating,
    limit = 20,
    offset = 0,
  } = params;

  // Build where clause
  const where: Prisma.IngredientWhereInput = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { inciName: { contains: query, mode: "insensitive" } },
      { aliases: { has: query.toLowerCase() } },
    ];
  }

  if (functions && functions.length > 0) {
    where.functions = { hasSome: functions };
  }

  if (isFungalAcneSafe === true) {
    where.isFungalAcneTrigger = false;
  }

  if (isAllergenFree === true) {
    where.isAllergen = false;
  }

  if (maxComedogenicRating !== undefined) {
    where.comedogenicRating = { lte: maxComedogenicRating };
  }

  // Execute query with count
  const [ingredients, total] = await Promise.all([
    db.ingredient.findMany({
      where,
      select: {
        id: true,
        slug: true,
        name: true,
        functions: true,
        isFungalAcneTrigger: true,
        isAllergen: true,
        comedogenicRating: true,
      },
      orderBy: { name: "asc" },
      take: limit,
      skip: offset,
    }),
    db.ingredient.count({ where }),
  ]);

  return { ingredients, total };
}

/**
 * List ingredients by function category.
 */
export async function listIngredientsByFunction(
  func: IngredientFunction,
  limit = 50
): Promise<IngredientSummary[]> {
  return db.ingredient.findMany({
    where: {
      functions: { has: func },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      functions: true,
      isFungalAcneTrigger: true,
      isAllergen: true,
      comedogenicRating: true,
    },
    orderBy: { name: "asc" },
    take: limit,
  });
}

/**
 * List all fungal acne triggers.
 */
export async function listFungalAcneTriggers(): Promise<IngredientSummary[]> {
  return db.ingredient.findMany({
    where: { isFungalAcneTrigger: true },
    select: {
      id: true,
      slug: true,
      name: true,
      functions: true,
      isFungalAcneTrigger: true,
      isAllergen: true,
      comedogenicRating: true,
    },
    orderBy: { name: "asc" },
  });
}

/**
 * List all common allergens.
 */
export async function listAllergens(): Promise<IngredientSummary[]> {
  return db.ingredient.findMany({
    where: { isAllergen: true },
    select: {
      id: true,
      slug: true,
      name: true,
      functions: true,
      isFungalAcneTrigger: true,
      isAllergen: true,
      comedogenicRating: true,
    },
    orderBy: { name: "asc" },
  });
}

/**
 * Get multiple ingredients by their slugs.
 * Useful for batch lookups during ingredient analysis.
 */
export async function getIngredientsBySlugs(
  slugs: string[]
): Promise<Map<string, IngredientWithDetails>> {
  const ingredients = await db.ingredient.findMany({
    where: { slug: { in: slugs } },
  });

  return new Map(ingredients.map((ing) => [ing.slug, ing]));
}

/**
 * Get ingredient suggestions for autocomplete.
 */
export async function getIngredientSuggestions(
  query: string,
  limit = 10
): Promise<Pick<Ingredient, "id" | "slug" | "name">[]> {
  if (!query || query.length < 2) {
    return [];
  }

  return db.ingredient.findMany({
    where: {
      OR: [
        { name: { startsWith: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
        { inciName: { startsWith: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      slug: true,
      name: true,
    },
    orderBy: [
      // Prioritize exact prefix matches
      { name: "asc" },
    ],
    take: limit,
  });
}

