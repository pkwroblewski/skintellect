/**
 * Affiliate Click Tracking API Route
 * 
 * Handles affiliate link clicks with safe redirects.
 * 
 * Security:
 * - Only redirects to known affiliate URLs stored in the database
 * - Never redirects to arbitrary user-supplied URLs
 * - Records aggregate click counts only (no PII)
 * 
 * Usage:
 *   GET /api/affiliate/click?offerId=<offer-id>
 *   Returns: 302 redirect to retailer URL, or 404 if offer not found
 */

import { NextRequest, NextResponse } from "next/server";
import { getOfferRedirectUrl, recordClick } from "@/lib/repositories/affiliate-offers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const offerId = searchParams.get("offerId");

  // Validate offerId parameter
  if (!offerId || typeof offerId !== "string" || offerId.length === 0) {
    return NextResponse.json(
      { error: "Missing or invalid offerId parameter" },
      { status: 400 }
    );
  }

  // Basic UUID-like validation (prevent obvious injection)
  const uuidPattern = /^[a-zA-Z0-9_-]+$/;
  if (!uuidPattern.test(offerId)) {
    return NextResponse.json(
      { error: "Invalid offerId format" },
      { status: 400 }
    );
  }

  try {
    // Get the redirect URL from the database
    const redirectUrl = await getOfferRedirectUrl(offerId);

    if (!redirectUrl) {
      // Offer not found or not active
      return NextResponse.json(
        { error: "Offer not found or no longer available" },
        { status: 404 }
      );
    }

    // Validate the redirect URL is a valid HTTP(S) URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(redirectUrl);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      console.error(`Invalid redirect URL for offer ${offerId}:`, redirectUrl);
      return NextResponse.json(
        { error: "Invalid redirect URL configuration" },
        { status: 500 }
      );
    }

    // Record the click (aggregate count only, no PII)
    // Fire and forget - don't block the redirect
    recordClick(offerId).catch((err) => {
      console.error("Failed to record click:", err);
    });

    // Return a redirect response to the affiliate URL
    return NextResponse.redirect(redirectUrl, 302);
  } catch (error) {
    console.error("Affiliate click error:", error);

    // Return a generic error without leaking details
    return NextResponse.json(
      { error: "Unable to process request" },
      { status: 500 }
    );
  }
}

// Explicitly disallow other methods
export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

