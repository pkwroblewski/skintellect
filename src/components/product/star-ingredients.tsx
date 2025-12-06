/**
 * Star Ingredients Component
 * 
 * Highlights the key active ingredients in a product.
 */

import Link from "next/link";

interface StarIngredient {
  id: string;
  slug: string;
  name: string;
  description?: string;
  functions: string[];
}

interface StarIngredientsProps {
  ingredients: StarIngredient[];
}

// Function emoji mapping
const functionEmoji: Record<string, string> = {
  moisturizing: "💧",
  antioxidant: "🍇",
  exfoliating: "✨",
  soothing: "🌿",
  brightening: "🌟",
  acne_fighting: "🎯",
  anti_aging: "⏳",
  cleansing: "🧼",
  humectant: "💦",
  uv_filter: "☀️",
};

export function StarIngredients({ ingredients }: StarIngredientsProps) {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span aria-hidden="true">⭐</span>
        Star Ingredients
      </h3>
      <div className="space-y-3">
        {ingredients.map((ingredient) => {
          // Get first function for emoji
          const primaryFunction = ingredient.functions[0];
          const emoji = functionEmoji[primaryFunction] || "🔬";
          
          return (
            <Link
              key={ingredient.id}
              href={`/ingredients/${ingredient.slug}`}
              className="block p-3 rounded-lg bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 hover:border-rose-200 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-rose-700 transition-colors">
                      {ingredient.name}
                    </p>
                    <svg 
                      className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 transition-colors" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  {ingredient.description && (
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                      {ingredient.description}
                    </p>
                  )}
                  {ingredient.functions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ingredient.functions.slice(0, 3).map((func) => (
                        <span
                          key={func}
                          className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/70 text-slate-600 capitalize"
                        >
                          {func.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

