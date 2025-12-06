/**
 * Product Search Suggestions API Route
 * 
 * Returns autocomplete suggestions for product names.
 * 
 * Usage:
 *   GET /api/search/products?q=<query>
 *   Returns: JSON array of product suggestions
 */

import { NextRequest, NextResponse } from "next/server";
import { getProductSuggestions } from "@/lib/repositories/products";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  // Limit query length to prevent abuse
  const sanitizedQuery = query.slice(0, 100);

  try {
    const suggestions = await getProductSuggestions(sanitizedQuery, 10);
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Product search error:", error);
    return NextResponse.json([]);
  }
}

