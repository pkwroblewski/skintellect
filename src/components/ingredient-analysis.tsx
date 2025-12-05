"use client";

import { useState } from "react";

export type SafetyRating = "safe" | "caution" | "warning";

export interface IngredientData {
  id: string;
  name: string;
  function: string;
  safetyRating: SafetyRating;
  explanation: string;
}

interface IngredientRowProps {
  ingredient: IngredientData;
  isExpanded: boolean;
  onToggle: () => void;
}

const safetyBadgeStyles: Record<SafetyRating, string> = {
  safe: "bg-emerald-50 text-emerald-700",
  caution: "bg-amber-50 text-amber-700",
  warning: "bg-red-50 text-red-700",
};

const safetyLabels: Record<SafetyRating, string> = {
  safe: "Safe",
  caution: "Caution",
  warning: "Avoid",
};

function IngredientRow({ ingredient, isExpanded, onToggle }: IngredientRowProps) {
  const badgeStyle = safetyBadgeStyles[ingredient.safetyRating];
  const label = safetyLabels[ingredient.safetyRating];

  return (
    <div className="mb-3 last:mb-0">
      {/* Row Card */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left ${
          isExpanded ? "rounded-b-none border-b-0" : ""
        }`}
        aria-expanded={isExpanded}
      >
        {/* Left Side: Name & Function */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="min-w-0">
            <span className="font-medium text-zinc-900 block">
              {ingredient.name}
            </span>
            <span className="text-sm text-zinc-500">
              {ingredient.function}
            </span>
          </div>
        </div>

        {/* Right Side: Badge & Chevron */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Safety Pill Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
            {label}
          </span>
          
          {/* Expand Icon */}
          <svg
            className={`w-5 h-5 text-zinc-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Content (Accordion) */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 bg-zinc-50 border border-t-0 border-zinc-100 rounded-b-xl">
          <p className="text-zinc-600 leading-relaxed text-sm">
            {ingredient.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}

interface IngredientAnalysisProps {
  ingredients: IngredientData[];
  title?: string;
}

export function IngredientAnalysis({ ingredients, title = "Ingredient Analysis" }: IngredientAnalysisProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Calculate summary stats
  const safeCount = ingredients.filter((i) => i.safetyRating === "safe").length;
  const cautionCount = ingredients.filter((i) => i.safetyRating === "caution").length;
  const warningCount = ingredients.filter((i) => i.safetyRating === "warning").length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
        
        {/* Summary Pills */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            {safeCount} Safe
          </span>
          {cautionCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
              {cautionCount} Caution
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold">
              {warningCount} Avoid
            </span>
          )}
        </div>
      </div>

      {/* Ingredients List - Div Rows */}
      <div>
        {ingredients.map((ingredient) => (
          <IngredientRow
            key={ingredient.id}
            ingredient={ingredient}
            isExpanded={expandedId === ingredient.id}
            onToggle={() => handleToggle(ingredient.id)}
          />
        ))}
      </div>
    </div>
  );
}
