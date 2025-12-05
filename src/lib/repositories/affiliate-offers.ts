/**
 * Affiliate Offers Repository
 * 
 * Server-side functions for querying and managing affiliate offers.
 * Use only in Server Components, Route Handlers, or Server Actions.
 * 
 * SECURITY NOTES:
 * - Affiliate API keys should be stored in environment variables
 * - Click tracking stores aggregate counts only, no PII
 * - All external redirects go through /api/affiliate/click for tracking
 */

import { db } from "@/lib/db";
import type { AffiliateOffer, OfferAvailability } from "@prisma/client";

// ========================================
// TYPES
// ========================================

export type AffiliateOfferSummary = Pick<
  AffiliateOffer,
  | "id"
  | "retailerName"
  | "retailerSlug"
  | "countryCode"
  | "url"
  | "currency"
  | "price"
  | "originalPrice"
  | "availability"
>;

export interface GetOffersParams {
  productId: string;
  countryCode?: string;
  limit?: number;
}

// ========================================
// RETAILER PRIORITY
// ========================================
// Lower number = higher priority in display

const RETAILER_PRIORITIES: Record<string, number> = {
  amazon: 10,
  sephora: 20,
  ulta: 30,
  dermstore: 40,
  cultbeauty: 50,
  lookfantastic: 60,
  yesstyle: 70,
  iherb: 80,
  // Brand direct sites get lower priority
  default: 100,
};

function getRetailerPriority(retailerSlug: string): number {
  return RETAILER_PRIORITIES[retailerSlug] ?? RETAILER_PRIORITIES.default;
}

// ========================================
// QUERIES
// ========================================

/**
 * Get affiliate offers for a product.
 * Returns offers sorted by priority and price.
 */
export async function getOffersForProduct(
  params: GetOffersParams
): Promise<AffiliateOfferSummary[]> {
  const { productId, countryCode = "US", limit = 5 } = params;

  const offers = await db.affiliateOffer.findMany({
    where: {
      productId,
      countryCode,
      isActive: true,
    },
    select: {
      id: true,
      retailerName: true,
      retailerSlug: true,
      countryCode: true,
      url: true,
      currency: true,
      price: true,
      originalPrice: true,
      availability: true,
    },
    orderBy: [{ displayPriority: "asc" }, { price: "asc" }],
    take: limit,
  });

  return offers;
}

/**
 * Get the primary (best) offer for a product.
 * Selection criteria:
 * 1. In stock > low stock > out of stock
 * 2. Higher retailer priority
 * 3. Lower price
 */
export async function getPrimaryOfferForProduct(
  productId: string,
  countryCode = "US"
): Promise<AffiliateOfferSummary | null> {
  const offers = await db.affiliateOffer.findMany({
    where: {
      productId,
      countryCode,
      isActive: true,
    },
    select: {
      id: true,
      retailerName: true,
      retailerSlug: true,
      countryCode: true,
      url: true,
      currency: true,
      price: true,
      originalPrice: true,
      availability: true,
    },
    orderBy: [{ displayPriority: "asc" }, { price: "asc" }],
  });

  if (offers.length === 0) return null;

  // Sort by availability, then retailer priority, then price
  const availabilityOrder: Record<OfferAvailability, number> = {
    in_stock: 0,
    low_stock: 1,
    preorder: 2,
    unknown: 3,
    out_of_stock: 4,
  };

  const sorted = [...offers].sort((a, b) => {
    // First by availability
    const availDiff =
      availabilityOrder[a.availability] - availabilityOrder[b.availability];
    if (availDiff !== 0) return availDiff;

    // Then by retailer priority
    const priorityDiff =
      getRetailerPriority(a.retailerSlug) -
      getRetailerPriority(b.retailerSlug);
    if (priorityDiff !== 0) return priorityDiff;

    // Finally by price (null prices go last)
    if (a.price === null && b.price === null) return 0;
    if (a.price === null) return 1;
    if (b.price === null) return -1;
    return a.price - b.price;
  });

  return sorted[0];
}

/**
 * Get offers from multiple retailers for comparison.
 */
export async function getOfferComparison(
  productId: string,
  countryCode = "US"
): Promise<AffiliateOfferSummary[]> {
  return db.affiliateOffer.findMany({
    where: {
      productId,
      countryCode,
      isActive: true,
      availability: { in: ["in_stock", "low_stock", "preorder"] },
    },
    select: {
      id: true,
      retailerName: true,
      retailerSlug: true,
      countryCode: true,
      url: true,
      currency: true,
      price: true,
      originalPrice: true,
      availability: true,
    },
    orderBy: { price: "asc" },
  });
}

// ========================================
// CLICK TRACKING
// ========================================

/**
 * Record an affiliate link click.
 * Updates aggregate click count only - no PII stored.
 */
export async function recordClick(offerId: string): Promise<void> {
  await db.affiliateOffer.update({
    where: { id: offerId },
    data: {
      clickCount: { increment: 1 },
    },
  });
}

/**
 * Record a conversion (purchase).
 * Called via webhook from affiliate network.
 */
export async function recordConversion(offerId: string): Promise<void> {
  await db.affiliateOffer.update({
    where: { id: offerId },
    data: {
      conversionCount: { increment: 1 },
    },
  });
}

/**
 * Get the redirect URL for an affiliate offer.
 * Used by /api/affiliate/click route.
 */
export async function getOfferRedirectUrl(
  offerId: string
): Promise<string | null> {
  const offer = await db.affiliateOffer.findUnique({
    where: { id: offerId, isActive: true },
    select: { url: true, deepLinkParams: true },
  });

  if (!offer) return null;

  // Append any additional tracking params
  if (offer.deepLinkParams) {
    const separator = offer.url.includes("?") ? "&" : "?";
    return `${offer.url}${separator}${offer.deepLinkParams}`;
  }

  return offer.url;
}

// ========================================
// ADMIN / MANAGEMENT
// ========================================

/**
 * Update offer availability status.
 * Called by background job that checks retailer sites.
 */
export async function updateOfferAvailability(
  offerId: string,
  availability: OfferAvailability,
  price?: number
): Promise<void> {
  await db.affiliateOffer.update({
    where: { id: offerId },
    data: {
      availability,
      ...(price !== undefined && { price }),
      lastChecked: new Date(),
    },
  });
}

/**
 * Deactivate stale offers.
 * Called by cleanup job.
 */
export async function deactivateStaleOffers(
  olderThanDays: number
): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

  const result = await db.affiliateOffer.updateMany({
    where: {
      isActive: true,
      lastChecked: { lt: cutoffDate },
    },
    data: {
      isActive: false,
    },
  });

  return result.count;
}

