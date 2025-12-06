/**
 * Product Header Component
 * 
 * Hero section displaying product name, brand, rating, and safety score.
 */

import { Badge } from "@/components/ui";

interface ProductHeaderProps {
  brand: string;
  name: string;
  category: string;
  description: string;
  rating: number | null;
  reviewCount: number;
  safetyScore: number;
  isFungalAcneSafe: boolean;
}

export function ProductHeader({
  brand,
  name,
  category,
  description,
  rating,
  reviewCount,
  safetyScore,
  isFungalAcneSafe,
}: ProductHeaderProps) {
  const displayRating = rating ?? 0;
  const scoreColor = safetyScore >= 8 
    ? "text-emerald-500" 
    : safetyScore >= 6 
      ? "text-amber-500" 
      : "text-red-500";
  
  const scoreBgColor = safetyScore >= 8 
    ? "bg-emerald-50 border-emerald-200" 
    : safetyScore >= 6 
      ? "bg-amber-50 border-amber-200" 
      : "bg-red-50 border-red-200";

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
      <div className="flex-1">
        <p className="text-sm font-medium text-rose-500 uppercase tracking-wider">
          {brand}
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1">
          {name}
        </h1>
        
        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5" role="img" aria-label={`${displayRating.toFixed(1)} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(displayRating) ? "text-amber-400" : i < displayRating ? "text-amber-300" : "text-slate-200"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-slate-600">
              {displayRating.toFixed(1)} · {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          </div>
        )}

        <p className="text-sm text-slate-500 capitalize mt-1">{category.replace("_", " ")}</p>
        
        {description && (
          <p className="text-slate-600 mt-3 max-w-xl leading-relaxed">{description}</p>
        )}
      </div>

      {/* Safety Score Card */}
      <div className={`flex-shrink-0 border rounded-xl p-4 text-center min-w-[140px] ${scoreBgColor}`}>
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
          Safety Score
        </div>
        <div className={`text-3xl font-bold ${scoreColor}`}>
          {safetyScore.toFixed(1)}
        </div>
        <div className="text-xs text-slate-400">/10</div>
        <div className="mt-2">
          <Badge variant={isFungalAcneSafe ? "success" : "warning"} size="sm">
            {isFungalAcneSafe ? "✓ FA Safe" : "⚠ FA Risk"}
          </Badge>
        </div>
      </div>
    </div>
  );
}

