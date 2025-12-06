/**
 * Safety Profile Component
 * 
 * Grid of safety badges showing what the product is free from.
 */

interface SafetyProfileProps {
  isFungalAcneSafe: boolean;
  isFragranceFree: boolean;
  isAlcoholFree: boolean;
  isParabenFree: boolean;
  isSulfateFree: boolean;
  isSiliconeFree: boolean;
  isOilFree: boolean;
  isVegan: boolean;
  isCrueltyFree: boolean;
  isReefSafe: boolean;
}

export function SafetyProfile(props: SafetyProfileProps) {
  const badges = [
    { label: "Fungal Acne Safe", value: props.isFungalAcneSafe, icon: "🛡️" },
    { label: "Fragrance Free", value: props.isFragranceFree, icon: "🌸" },
    { label: "Alcohol Free", value: props.isAlcoholFree, icon: "💧" },
    { label: "Paraben Free", value: props.isParabenFree, icon: "✨" },
    { label: "Sulfate Free", value: props.isSulfateFree, icon: "🧴" },
    { label: "Silicone Free", value: props.isSiliconeFree, icon: "🌿" },
    { label: "Oil Free", value: props.isOilFree, icon: "💎" },
    { label: "Vegan", value: props.isVegan, icon: "🌱" },
    { label: "Cruelty Free", value: props.isCrueltyFree, icon: "🐰" },
    { label: "Reef Safe", value: props.isReefSafe, icon: "🐠" },
  ];

  // Count how many are true
  const trueCount = badges.filter(b => b.value).length;

  return (
    <div className="bg-slate-50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Safety Profile</h3>
        <span className="text-xs text-slate-500">{trueCount}/{badges.length} criteria met</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {badges.map(({ label, value, icon }) => (
          <div
            key={label}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              value
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-white text-slate-400 border border-slate-200"
            }`}
            role="status"
            aria-label={`${label}: ${value ? "Yes" : "No"}`}
          >
            <span className="text-base" aria-hidden="true">{icon}</span>
            <span className="truncate text-xs font-medium">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

