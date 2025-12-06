/**
 * Skin Benefits Component
 * 
 * Lists the skin benefits of a product with ingredient counts.
 */

interface Benefit {
  benefit: string;
  ingredientCount: number;
  description?: string | null;
}

interface SkinBenefitsProps {
  benefits: Benefit[];
}

// Benefit display configuration
const benefitConfig: Record<string, { label: string; emoji: string; color: string }> = {
  hydrating: { label: "Hydrating", emoji: "💧", color: "bg-sky-50 text-sky-700" },
  anti_aging: { label: "Anti-Aging", emoji: "⏳", color: "bg-purple-50 text-purple-700" },
  brightening: { label: "Brightening", emoji: "✨", color: "bg-amber-50 text-amber-700" },
  acne_fighting: { label: "Acne Fighting", emoji: "🎯", color: "bg-rose-50 text-rose-700" },
  soothing: { label: "Soothing", emoji: "🌿", color: "bg-emerald-50 text-emerald-700" },
  pore_minimizing: { label: "Pore Minimizing", emoji: "🔍", color: "bg-indigo-50 text-indigo-700" },
  barrier_repair: { label: "Barrier Repair", emoji: "🛡️", color: "bg-blue-50 text-blue-700" },
  exfoliating: { label: "Exfoliating", emoji: "💫", color: "bg-orange-50 text-orange-700" },
  dark_spot_fading: { label: "Dark Spot Fading", emoji: "🌙", color: "bg-violet-50 text-violet-700" },
  redness_reducing: { label: "Redness Reducing", emoji: "🩹", color: "bg-pink-50 text-pink-700" },
  firming: { label: "Firming", emoji: "💪", color: "bg-teal-50 text-teal-700" },
  mattifying: { label: "Mattifying", emoji: "🪞", color: "bg-slate-50 text-slate-700" },
  uv_protection: { label: "UV Protection", emoji: "☀️", color: "bg-yellow-50 text-yellow-700" },
  nourishing: { label: "Nourishing", emoji: "🌸", color: "bg-fuchsia-50 text-fuchsia-700" },
  other: { label: "Other", emoji: "✓", color: "bg-gray-50 text-gray-700" },
};

export function SkinBenefits({ benefits }: SkinBenefitsProps) {
  if (!benefits || benefits.length === 0) {
    return null;
  }

  // Sort by ingredient count (descending)
  const sortedBenefits = [...benefits].sort((a, b) => b.ingredientCount - a.ingredientCount);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Skin Benefits</h3>
      <div className="space-y-2">
        {sortedBenefits.map((item) => {
          const config = benefitConfig[item.benefit] || benefitConfig.other;
          
          return (
            <div
              key={item.benefit}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${config.color}`}
                  aria-hidden="true"
                >
                  {config.emoji}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900">{config.label}</p>
                  {item.description && (
                    <p className="text-xs text-slate-500">{item.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-500">
                  {item.ingredientCount}
                </span>
                <span className="text-[10px] text-slate-400">
                  {item.ingredientCount === 1 ? "ingredient" : "ingredients"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

