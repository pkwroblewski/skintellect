/**
 * Ingredient Breakdown Component
 * 
 * Full ingredient list with detailed analysis for each ingredient.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui";

interface IngredientData {
  id: string;
  slug: string;
  name: string;
  inciName?: string | null;
  functions: string[];
  isActive: boolean;
  comedogenicRating: number | null;
  irritationLevel: number | null;
  isFungalAcneTrigger: boolean;
  isAllergen: boolean;
  description?: string | null;
}

interface ProductIngredient {
  position: number;
  isHighlighted: boolean;
  customNote?: string | null;
  ingredient: IngredientData;
}

interface IngredientBreakdownProps {
  ingredients: ProductIngredient[];
  ingredientsText?: string;
}

// Safety badge helpers
function getSafetyBadge(ingredient: IngredientData) {
  if (ingredient.isFungalAcneTrigger) {
    return { variant: "warning" as const, label: "FA Trigger" };
  }
  if (ingredient.isAllergen) {
    return { variant: "danger" as const, label: "Allergen" };
  }
  if ((ingredient.comedogenicRating ?? 0) >= 3) {
    return { variant: "warning" as const, label: `Comedogenic ${ingredient.comedogenicRating}` };
  }
  return { variant: "success" as const, label: "Safe" };
}

export function IngredientBreakdown({ ingredients, ingredientsText }: IngredientBreakdownProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState(false);

  // Show first 5 by default
  const displayedIngredients = showAll ? ingredients : ingredients.slice(0, 5);
  const hasMore = ingredients.length > 5;

  const handleCopy = async () => {
    const text = ingredientsText || ingredients.map(pi => pi.ingredient.name).join(", ");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Full Ingredient Breakdown</h3>
        <div className="text-center py-8 text-sm text-slate-500">
          Ingredient analysis coming soon
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Full Ingredient Breakdown
        </h3>
        <span className="text-xs text-slate-500">
          {ingredients.length} ingredients
        </span>
      </div>

      <div className="space-y-1">
        {displayedIngredients.map((pi) => {
          const isExpanded = expandedId === pi.ingredient.id;
          const safety = getSafetyBadge(pi.ingredient);
          
          return (
            <div
              key={pi.ingredient.id}
              className={`rounded-lg border transition-all ${
                isExpanded 
                  ? "border-rose-200 bg-rose-50/50" 
                  : "border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              {/* Main Row */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : pi.ingredient.id)}
                className="w-full flex items-center justify-between p-3 text-left"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-400 w-6 text-right">
                    #{pi.position}
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${pi.isHighlighted ? "text-rose-700" : "text-slate-900"}`}>
                      {pi.ingredient.name}
                      {pi.isHighlighted && (
                        <span className="ml-1.5 text-xs" aria-label="Star ingredient">⭐</span>
                      )}
                    </p>
                    {pi.ingredient.inciName && pi.ingredient.inciName !== pi.ingredient.name && (
                      <p className="text-[10px] text-slate-400">{pi.ingredient.inciName}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={safety.variant} size="sm">
                    {safety.label}
                  </Badge>
                  <svg 
                    className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-0 border-t border-rose-100">
                  <div className="pt-3 space-y-3">
                    {/* Functions */}
                    {pi.ingredient.functions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {pi.ingredient.functions.map((func) => (
                          <span
                            key={func}
                            className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 text-slate-600 capitalize"
                          >
                            {func.replace("_", " ")}
                          </span>
                        ))}
                        {pi.ingredient.isActive && (
                          <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-rose-100 text-rose-700">
                            Active
                          </span>
                        )}
                      </div>
                    )}

                    {/* Ratings */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {pi.ingredient.comedogenicRating !== null && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Comedogenic:</span>
                          <span className="font-medium">{pi.ingredient.comedogenicRating}/5</span>
                        </div>
                      )}
                      {pi.ingredient.irritationLevel !== null && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Irritation:</span>
                          <span className="font-medium">{pi.ingredient.irritationLevel}/5</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {pi.ingredient.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {pi.ingredient.description}
                      </p>
                    )}

                    {/* Custom Note */}
                    {pi.customNote && (
                      <p className="text-xs text-rose-600 italic">
                        Note: {pi.customNote}
                      </p>
                    )}

                    {/* Link to ingredient page */}
                    <Link
                      href={`/ingredients/${pi.ingredient.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700"
                    >
                      Learn more about {pi.ingredient.name}
                      <svg 
                        className="w-3 h-3" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show More / Show Less */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
        >
          {showAll ? "Show Less" : `Show All ${ingredients.length} Ingredients`}
        </button>
      )}

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="w-full mt-2 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        {copied ? "Copied!" : "Copy Full Ingredient List"}
      </button>
    </div>
  );
}

