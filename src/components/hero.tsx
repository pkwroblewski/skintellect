"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

type SearchTab = "analyze" | "search";

const quickSearches = ["CeraVe", "The Ordinary", "Niacinamide", "Hyaluronic Acid"];

const featureTags = [
  { label: "Fungal Acne Safe", color: "green" },
  { label: "No Alcohol", color: "blue" },
  { label: "Vegan", color: "purple" },
] as const;

const tabs: { id: SearchTab; label: string }[] = [
  { id: "analyze", label: "Analyze Ingredients" },
  { id: "search", label: "Search Products" },
];

export function Hero() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>("analyze");
  const [ingredientInput, setIngredientInput] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Handle keyboard navigation for tabs (Arrow Left/Right, Home, End)
  const handleTabKeyDown = useCallback((e: KeyboardEvent<HTMLButtonElement>, currentTab: SearchTab) => {
    const currentIndex = tabs.findIndex(t => t.id === currentTab);
    let newIndex = currentIndex;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
        break;
      case "ArrowRight":
        e.preventDefault();
        newIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
        break;
      case "Home":
        e.preventDefault();
        newIndex = 0;
        break;
      case "End":
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    setActiveTab(tabs[newIndex].id);
    // Focus the new tab after state update
    setTimeout(() => {
      const tabElement = document.getElementById(`tab-${tabs[newIndex].id}`);
      tabElement?.focus();
    }, 0);
  }, []);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredientInput.trim()) {
      // Navigate to analyze page with ingredients as query param
      const params = new URLSearchParams({ ingredients: ingredientInput });
      router.push(`/analyze?${params.toString()}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Navigate to products page with search query
      const params = new URLSearchParams({ q: searchInput });
      router.push(`/products?${params.toString()}`);
    }
  };

  const handleQuickSearch = (term: string) => {
    // Navigate directly to products search
    const params = new URLSearchParams({ q: term });
    router.push(`/products?${params.toString()}`);
  };

  return (
    <section
      className="relative overflow-hidden pt-16 pb-12 lg:pt-24 lg:pb-20"
      aria-labelledby="hero-heading"
    >
      {/* Animated Background Blobs */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 -left-10 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute top-0 -right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />
      </div>

      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl">
          {/* Hero Heading */}
          <h1
            id="hero-heading"
            className="animate-fade-in-up text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Decode your skincare <br />
            <span className="text-rose-500">ingredients</span> instantly.
          </h1>

          {/* Hero Description */}
          <p
            className="animate-fade-in-up delay-100 mt-6 text-lg text-slate-500 leading-relaxed opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            Check products for comedogenic ingredients, allergens, and fungal
            acne triggers. Make informed decisions about what you put on your
            skin.
          </p>

          {/* Premium Search Bar (Glassmorphism) */}
          <div className="mt-10 relative mx-auto max-w-2xl group">
            {/* Soft Glow effect */}
            <div
              className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-rose-300/50 via-purple-300/50 to-rose-300/50 opacity-70 blur-2xl group-hover:opacity-90 transition duration-700"
              aria-hidden="true"
            />

            {/* Search Card */}
            <div className="relative rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl shadow-slate-200/50 ring-1 ring-white/80 overflow-hidden">
              {/* Tab Navigation */}
              <div
                className="flex bg-white/50 backdrop-blur-sm border-b border-slate-200/60"
                role="tablist"
                aria-label="Search options"
              >
                <button
                  type="button"
                  role="tab"
                  id="tab-analyze"
                  aria-selected={activeTab === "analyze"}
                  aria-controls="panel-analyze"
                  tabIndex={activeTab === "analyze" ? 0 : -1}
                  className={`search-tab flex-1 flex items-center justify-center gap-2 py-3.5 ${
                    activeTab === "analyze"
                      ? "text-slate-900"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                  onClick={() => setActiveTab("analyze")}
                  onKeyDown={(e) => handleTabKeyDown(e, "analyze")}
                >
                  <svg
                    className="w-[18px] h-[18px]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  <span>Analyze Ingredients</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-search"
                  aria-selected={activeTab === "search"}
                  aria-controls="panel-search"
                  tabIndex={activeTab === "search" ? 0 : -1}
                  className={`search-tab flex-1 flex items-center justify-center gap-2 py-3.5 ${
                    activeTab === "search"
                      ? "text-slate-900"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                  onClick={() => setActiveTab("search")}
                  onKeyDown={(e) => handleTabKeyDown(e, "search")}
                >
                  <svg
                    className="w-[18px] h-[18px]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Search Products</span>
                </button>
              </div>

              {/* Tab Panels */}
              <div className="p-3">
                {/* Analyze Panel */}
                <div
                  role="tabpanel"
                  id="panel-analyze"
                  aria-labelledby="tab-analyze"
                  className={activeTab === "analyze" ? "" : "hidden"}
                >
                  <form
                    onSubmit={handleAnalyze}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-1 relative">
                      <label htmlFor="ingredient-input" className="sr-only">
                        Paste ingredients list
                      </label>
                      <div
                        className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"
                        aria-hidden="true"
                      >
                        <svg
                          className="w-[18px] h-[18px] text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="ingredient-input"
                        name="ingredients"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        className="block w-full rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-sm py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 focus:bg-white transition-all"
                        placeholder="Paste ingredients list here..."
                        autoComplete="off"
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30 hover:from-rose-600 hover:to-rose-700 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 whitespace-nowrap"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      <span>Analyze</span>
                    </button>
                  </form>
                </div>

                {/* Search Panel */}
                <div
                  role="tabpanel"
                  id="panel-search"
                  aria-labelledby="tab-search"
                  className={activeTab === "search" ? "" : "hidden"}
                >
                  <form
                    onSubmit={handleSearch}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-1 relative">
                      <label htmlFor="search-input" className="sr-only">
                        Search products
                      </label>
                      <div
                        className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"
                        aria-hidden="true"
                      >
                        <svg
                          className="w-[18px] h-[18px] text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <input
                        type="search"
                        id="search-input"
                        name="query"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="block w-full rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-sm py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-300 focus:bg-white transition-all"
                        placeholder="Search by product name, brand, or ingredient..."
                        autoComplete="off"
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30 hover:from-rose-600 hover:to-rose-700 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 whitespace-nowrap"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                      <span>Search</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions / Popular Searches */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-2 text-sm">
            <span className="text-slate-400">Popular:</span>
            {quickSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleQuickSearch(term)}
                className="rounded-full bg-white/60 backdrop-blur-sm px-3 py-1 text-slate-600 ring-1 ring-slate-200/80 hover:bg-white hover:ring-rose-200 hover:text-rose-600 transition-all"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Feature Tags */}
          <div
            className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-medium"
            role="list"
            aria-label="Product safety features"
          >
            {featureTags.map((tag) => {
              const colorClasses = {
                green: "text-green-600 ring-green-200/60 hover:ring-green-300",
                blue: "text-blue-600 ring-blue-200/60 hover:ring-blue-300",
                purple: "text-purple-600 ring-purple-200/60 hover:ring-purple-300",
              }[tag.color];

              const icons = {
                green: (
                  <svg
                    className="w-3.5 h-3.5"
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
                blue: (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                ),
                purple: (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                ),
              }[tag.color];

              return (
                <span
                  key={tag.label}
                  className={`flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-sm px-3 py-1.5 ring-1 transition-all cursor-default ${colorClasses}`}
                  role="listitem"
                >
                  {icons}
                  {tag.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
