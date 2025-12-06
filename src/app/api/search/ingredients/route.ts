/**
 * Ingredient Search Suggestions API Route
 * 
 * Returns autocomplete suggestions for ingredient names.
 * 
 * Usage:
 *   GET /api/search/ingredients?q=<query>
 *   Returns: JSON array of ingredient suggestions
 */

import { NextRequest, NextResponse } from "next/server";
import { getIngredientSuggestions } from "@/lib/repositories/ingredients";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  // Limit query length to prevent abuse
  const sanitizedQuery = query.slice(0, 100);

  try {
    const suggestions = await getIngredientSuggestions(sanitizedQuery, 10);
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Ingredient search error:", error);
    return NextResponse.json([]);
  }
}

