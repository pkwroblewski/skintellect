/**
 * Product Stats Component
 * 
 * Quick stats cards showing ingredient count, FA triggers, actives, and vegan status.
 */

interface ProductStatsProps {
  ingredientCount: number;
  triggerCount: number;
  activeCount: number;
  isVegan: boolean;
  isCrueltyFree: boolean;
}

export function ProductStats({
  ingredientCount,
  triggerCount,
  activeCount,
  isVegan,
  isCrueltyFree,
}: ProductStatsProps) {
  const stats = [
    {
      value: ingredientCount,
      label: "Ingredients",
      color: "text-slate-700",
    },
    {
      value: triggerCount,
      label: "FA Triggers",
      color: triggerCount === 0 ? "text-emerald-600" : "text-amber-600",
    },
    {
      value: activeCount,
      label: "Actives",
      color: "text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-slate-200 rounded-xl p-4 text-center"
        >
          <div className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {stat.label}
          </div>
        </div>
      ))}
      
      {/* Vegan/Cruelty-Free Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-slate-700">
          {isVegan && isCrueltyFree ? "✓" : isVegan || isCrueltyFree ? "~" : "✗"}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          {isVegan && isCrueltyFree 
            ? "Vegan & CF" 
            : isVegan 
              ? "Vegan" 
              : isCrueltyFree 
                ? "Cruelty-Free" 
                : "Not Vegan"}
        </div>
      </div>
    </div>
  );
}

