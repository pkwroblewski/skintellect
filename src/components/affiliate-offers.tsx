"use client";

import { Card, CardContent, Badge } from "@/components/ui";

// Types for affiliate offers display
interface AffiliateOffer {
  id: string;
  retailerName: string;
  retailerSlug: string;
  currency: string;
  price: number | null;
  originalPrice: number | null;
  availability: "in_stock" | "low_stock" | "preorder" | "out_of_stock" | "unknown";
}

interface AffiliateOffersProps {
  offers: AffiliateOffer[];
  productName: string;
}

// Availability badge styling and text
const availabilityConfig = {
  in_stock: { label: "In Stock", variant: "success" as const },
  low_stock: { label: "Low Stock", variant: "warning" as const },
  preorder: { label: "Pre-order", variant: "info" as const },
  out_of_stock: { label: "Out of Stock", variant: "danger" as const },
  unknown: { label: "Check Site", variant: "default" as const },
};

// Format price with currency
function formatPrice(price: number | null, currency: string): string {
  if (price === null) return "See price";
  
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 2,
  });
  
  return formatter.format(price);
}

export function AffiliateOffers({ offers, productName }: AffiliateOffersProps) {
  if (!offers || offers.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <h2 className="text-sm font-semibold text-slate-900 mb-3">Where to Buy</h2>
          <div className="p-4 rounded-lg bg-slate-50 text-center">
            <p className="text-sm text-slate-500">
              Pricing information coming soon
            </p>
          </div>
          <p className="text-[10px] text-slate-400 mt-3">
            Links may be affiliate links. We may earn a commission at no extra cost to you.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Where to Buy</h2>
        <div className="space-y-2">
          {offers.map((offer, index) => {
            const availability = availabilityConfig[offer.availability];
            const isOutOfStock = offer.availability === "out_of_stock";
            
            return (
              <a
                key={offer.id}
                href={`/api/affiliate/click?offerId=${offer.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  index === 0 && !isOutOfStock
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : isOutOfStock
                    ? "border border-slate-200 text-slate-400 cursor-not-allowed pointer-events-none"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
                aria-label={`Shop ${productName} at ${offer.retailerName}`}
                onClick={(e) => {
                  if (isOutOfStock) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span>{offer.retailerName}</span>
                  <Badge variant={availability.variant} size="sm">
                    {availability.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className={index === 0 && !isOutOfStock ? "text-white" : "text-slate-900"}>
                      {formatPrice(offer.price, offer.currency)}
                    </div>
                    {offer.originalPrice && offer.price && offer.originalPrice > offer.price && (
                      <div className="text-xs text-slate-400 line-through">
                        {formatPrice(offer.originalPrice, offer.currency)}
                      </div>
                    )}
                  </div>
                  {!isOutOfStock && (
                    <svg 
                      className="w-4 h-4 flex-shrink-0" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </div>
              </a>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-400 mt-3">
          Links are affiliate links. We may earn a commission at no extra cost to you.
        </p>
      </CardContent>
    </Card>
  );
}

