/**
 * Product Concerns Component
 * 
 * Displays warnings and concerns about a product.
 */

import Link from "next/link";

interface Concern {
  id: string;
  title: string;
  description?: string | null;
  severity: string;
  ingredient?: {
    id: string;
    slug: string;
    name: string;
  } | null;
}

interface ProductConcernsProps {
  concerns: Concern[];
}

// Severity configuration
const severityConfig: Record<string, { color: string; bgColor: string; icon: string }> = {
  low: { 
    color: "text-slate-600", 
    bgColor: "bg-slate-50 border-slate-200", 
    icon: "ℹ️" 
  },
  medium: { 
    color: "text-amber-700", 
    bgColor: "bg-amber-50 border-amber-200", 
    icon: "⚠️" 
  },
  high: { 
    color: "text-red-700", 
    bgColor: "bg-red-50 border-red-200", 
    icon: "🚨" 
  },
};

export function ProductConcerns({ concerns }: ProductConcernsProps) {
  if (!concerns || concerns.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span aria-hidden="true">⚠️</span>
        Watch Out For
      </h3>
      <div className="space-y-2">
        {concerns.map((concern) => {
          const config = severityConfig[concern.severity] || severityConfig.low;
          
          return (
            <div
              key={concern.id}
              className={`p-3 rounded-lg border ${config.bgColor}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-base flex-shrink-0" aria-hidden="true">
                  {config.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${config.color}`}>
                    {concern.title}
                  </p>
                  {concern.description && (
                    <p className="text-xs text-slate-600 mt-0.5">
                      {concern.description}
                    </p>
                  )}
                  {concern.ingredient && (
                    <Link
                      href={`/ingredients/${concern.ingredient.slug}`}
                      className="inline-flex items-center gap-1 mt-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium"
                    >
                      Learn about {concern.ingredient.name}
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
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

