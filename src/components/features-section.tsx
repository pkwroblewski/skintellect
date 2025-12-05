"use client";

const features = [
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Comedogenic Rating",
    description: "Identify ingredients that are likely to clog pores.",
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    title: "Allergen Detection",
    description: "Automatic flagging of common skin allergens and irritants.",
  },
];

const analysisResults = [
  { name: "Glycerin", type: "Humectant", color: "green" },
  { name: "Fragrance (Parfum)", type: "Irritant", color: "rose", highlight: true },
  { name: "Niacinamide", type: "Brightening", color: "blue" },
];

export function FeaturesSection() {
  return (
    <section
      id="ingredients"
      className="bg-slate-900 py-16 text-white relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Background Glow */}
      <div
        className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div>
            <h2
              id="features-heading"
              className="text-3xl font-semibold tracking-tight"
            >
              Know exactly what&apos;s inside.
            </h2>
            <p className="mt-4 text-slate-400">
              Our algorithm analyzes thousands of scientific papers to break down
              complex chemical names into simple, actionable insights.
            </p>

            <ul className="mt-8 space-y-4" role="list">
              {features.map((feature, index) => (
                <li key={index} className="flex gap-4 group">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 transition-colors group-hover:border-rose-500/50 group-hover:bg-rose-500/10 text-rose-500"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-medium group-hover:text-rose-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Content - Analysis Demo */}
          <div className="relative group">
            {/* Glow Effect */}
            <div
              className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-500 opacity-20 blur transition-all duration-1000 group-hover:opacity-40"
              aria-hidden="true"
            />

            {/* Demo Card */}
            <div className="relative rounded-xl border border-slate-700 bg-slate-950 p-6 shadow-2xl transition-transform duration-300 group-hover:-translate-y-1">
              {/* Window Controls */}
              <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2" aria-hidden="true">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs font-mono text-slate-500">
                  analysis_result.json
                </span>
              </div>

              {/* Analysis Results */}
              <div
                className="space-y-3 font-mono text-sm"
                role="list"
                aria-label="Ingredient analysis results"
              >
                {analysisResults.map((result, index) => {
                  const typeColorClass = {
                    green: "bg-green-500/10 text-green-400",
                    rose: "bg-rose-500/10 text-rose-400",
                    blue: "bg-blue-500/10 text-blue-400",
                  }[result.color];

                  return (
                    <div
                      key={index}
                      className={`flex items-start justify-between rounded p-2 transition hover:bg-slate-800 hover:translate-x-1 duration-200 ${
                        result.highlight
                          ? "bg-slate-900 border border-rose-900/30"
                          : "bg-slate-900"
                      }`}
                      role="listitem"
                    >
                      <span
                        className={
                          result.highlight ? "text-rose-200" : "text-slate-300"
                        }
                      >
                        {result.name}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] ${typeColorClass}`}
                      >
                        {result.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

