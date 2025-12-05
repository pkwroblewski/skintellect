"use client";

import { useState } from "react";

// Sample products data
const sampleProducts = [
  {
    id: "cosrx-snail-92",
    brand: "COSRX",
    name: "Advanced Snail 92 All in One Cream",
    matchScore: 98,
    attributes: ["Sulfate-Free", "Alcohol-Free"],
    safetyScore: "Excellent",
    safetyColor: "emerald",
    image: "bottle1",
  },
  {
    id: "ordinary-nmf",
    brand: "The Ordinary",
    name: "Natural Moisturizing Factors + HA",
    matchScore: 85,
    attributes: ["Vegan", "Silicone-Free"],
    safetyScore: "Good",
    safetyColor: "emerald",
    image: "tube",
  },
  {
    id: "lrp-toleriane",
    brand: "La Roche-Posay",
    name: "Toleriane Double Repair Face Moisturizer",
    matchScore: 92,
    attributes: ["Fragrance-Free", "Non-Comedogenic"],
    safetyScore: "Fair",
    safetyColor: "yellow",
    image: "pump",
  },
  {
    id: "cerave-daily",
    brand: "CeraVe",
    name: "Daily Moisturizing Lotion",
    matchScore: 95,
    attributes: ["Ceramides", "Oil-Free"],
    safetyScore: "Excellent",
    safetyColor: "emerald",
    image: "round",
  },
];

// Product SVG placeholders
const ProductSVG = ({ type }: { type: string }) => {
  const svgs: Record<string, React.ReactNode> = {
    bottle1: (
      <svg
        className="h-full w-auto text-slate-200 transition duration-500 group-hover:scale-110 group-hover:text-slate-300"
        viewBox="0 0 100 160"
        fill="currentColor"
      >
        <path d="M30 10 H70 V30 H30 Z M30 30 C15 30 10 50 10 70 V140 C10 155 20 160 50 160 C80 160 90 155 90 140 V70 C90 50 85 30 70 30 Z" />
      </svg>
    ),
    tube: (
      <svg
        className="h-full w-auto text-slate-200 transition duration-500 group-hover:scale-110 group-hover:text-slate-300"
        viewBox="0 0 100 160"
        fill="currentColor"
      >
        <rect x="20" y="40" width="60" height="110" rx="5" />
        <rect x="35" y="10" width="30" height="30" rx="2" />
      </svg>
    ),
    pump: (
      <svg
        className="h-full w-auto text-slate-200 transition duration-500 group-hover:scale-110 group-hover:text-slate-300"
        viewBox="0 0 100 160"
        fill="currentColor"
      >
        <path d="M50 10 C30 10 20 30 20 60 V150 H80 V60 C80 30 70 10 50 10 Z" />
      </svg>
    ),
    round: (
      <svg
        className="h-full w-auto text-slate-200 transition duration-500 group-hover:scale-110 group-hover:text-slate-300"
        viewBox="0 0 100 160"
        fill="currentColor"
      >
        <circle cx="50" cy="90" r="50" />
        <rect x="35" y="10" width="30" height="30" />
      </svg>
    ),
  };
  return <>{svgs[type] || svgs.bottle1}</>;
};

// Filter checkbox component
function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 group cursor-pointer w-full text-left"
    >
      <div className="relative flex items-center">
        <div
          className={`h-4 w-4 rounded border transition-all flex items-center justify-center ${
            checked
              ? "bg-slate-900 border-slate-900"
              : "bg-white border-slate-300"
          }`}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </button>
  );
}

// Toggle switch component
function FilterToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${
          checked ? "bg-rose-500" : "bg-slate-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white border border-gray-300 shadow-sm transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function ProductGrid() {
  // Filter states
  const [productTypes, setProductTypes] = useState({
    cleansers: false,
    moisturizers: true,
    serums: false,
  });

  const [freeOf, setFreeOf] = useState({
    parabens: false,
    sulfates: true,
    alcohol: false,
  });

  const [priceRange, setPriceRange] = useState(50);
  const [sortBy, setSortBy] = useState("match");

  return (
    <section
      id="browse"
      className="border-t border-slate-200 bg-white py-12"
      aria-labelledby="products-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-10">
          {/* Sidebar Filters */}
          <aside
            className="hidden lg:block space-y-8"
            aria-labelledby="filters-heading"
          >
            <div>
              <h3
                id="filters-heading"
                className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4"
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
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Filters
              </h3>

              {/* Product Type Filter */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Product Type
                </legend>
                <FilterCheckbox
                  label="Cleansers"
                  checked={productTypes.cleansers}
                  onChange={(checked) =>
                    setProductTypes((prev) => ({ ...prev, cleansers: checked }))
                  }
                />
                <FilterCheckbox
                  label="Moisturizers"
                  checked={productTypes.moisturizers}
                  onChange={(checked) =>
                    setProductTypes((prev) => ({ ...prev, moisturizers: checked }))
                  }
                />
                <FilterCheckbox
                  label="Serums"
                  checked={productTypes.serums}
                  onChange={(checked) =>
                    setProductTypes((prev) => ({ ...prev, serums: checked }))
                  }
                />
              </fieldset>

              {/* Free-Of Filter */}
              <fieldset className="mt-6 space-y-3">
                <legend className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Must Be Free Of
                </legend>
                <FilterToggle
                  label="Parabens"
                  checked={freeOf.parabens}
                  onChange={(checked) =>
                    setFreeOf((prev) => ({ ...prev, parabens: checked }))
                  }
                />
                <FilterToggle
                  label="Sulfates"
                  checked={freeOf.sulfates}
                  onChange={(checked) =>
                    setFreeOf((prev) => ({ ...prev, sulfates: checked }))
                  }
                />
                <FilterToggle
                  label="Alcohol"
                  checked={freeOf.alcohol}
                  onChange={(checked) =>
                    setFreeOf((prev) => ({ ...prev, alcohol: checked }))
                  }
                />
              </fieldset>

              {/* Price Range Slider */}
              <fieldset className="mt-6">
                <legend className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                  Price Range
                </legend>
                <div className="space-y-2">
                  <label htmlFor="price-range" className="sr-only">
                    Select maximum price
                  </label>
                  <input
                    type="range"
                    id="price-range"
                    name="price-range"
                    min="0"
                    max="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>$0</span>
                    <span>${priceRange}</span>
                    <span>$100+</span>
                  </div>
                </div>
              </fieldset>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="col-span-3">
            {/* Grid Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="products-heading"
                className="text-lg font-semibold text-slate-900"
              >
                Trending Moisturizers
              </h2>
              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-xs text-slate-500">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  name="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-medium text-slate-900 bg-transparent border-0 cursor-pointer hover:text-rose-600 transition-colors focus:ring-0"
                >
                  <option value="match">Match Score</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              role="list"
              aria-label="Product list"
            >
              {sampleProducts.map((product) => {
                const matchBgClass =
                  product.matchScore >= 90
                    ? "bg-green-50 text-green-700 ring-green-600/20"
                    : "bg-yellow-50 text-yellow-700 ring-yellow-600/20";

                const gradientClass =
                  {
                    bottle1: "from-rose-100/40",
                    tube: "from-yellow-100/40",
                    pump: "from-blue-100/40",
                    round: "from-emerald-100/40",
                  }[product.image] || "from-rose-100/40";

                return (
                  <article
                    key={product.id}
                    className="product-card group"
                    role="listitem"
                  >
                    {/* Match Badge */}
                    <div className="absolute right-3 top-3 z-10">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ring-1 ring-inset ${matchBgClass}`}
                      >
                        {product.matchScore}% MATCH
                      </span>
                    </div>

                    {/* Image Area */}
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-slate-50 p-6 flex items-center justify-center relative">
                      <div
                        className={`absolute inset-0 bg-gradient-to-tr ${gradientClass} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                        aria-hidden="true"
                      />
                      <div className="relative z-10 h-full">
                        <ProductSVG type={product.image} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-medium text-slate-400">
                        {product.brand}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-rose-600 transition-colors">
                        <a
                          href={`/product/${product.id}`}
                          className="after:absolute after:inset-0"
                        >
                          {product.name}
                        </a>
                      </h3>

                      {/* Attributes */}
                      <div
                        className="mt-4 flex flex-wrap gap-1.5"
                        role="list"
                        aria-label="Product attributes"
                      >
                        {product.attributes.map((attr) => (
                          <span
                            key={attr}
                            className="inline-flex items-center rounded bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200"
                            role="listitem"
                          >
                            {attr}
                          </span>
                        ))}
                      </div>

                      {/* Safety Score */}
                      <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            product.safetyColor === "emerald"
                              ? "bg-emerald-500"
                              : "bg-yellow-400"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="text-xs text-slate-500">
                          Safety Score:{" "}
                          <span className="font-medium text-slate-700">
                            {product.safetyScore}
                          </span>
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Pagination */}
            <nav
              className="mt-10 flex items-center justify-center border-t border-slate-200 pt-8"
              aria-label="Pagination"
            >
              <ul className="flex items-center gap-1">
                <li>
                  <button className="rounded px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                </li>
                <li>
                  <button
                    className="rounded bg-rose-500 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-600 transition-colors"
                    aria-current="page"
                  >
                    1
                  </button>
                </li>
                <li>
                  <button className="rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                    2
                  </button>
                </li>
                <li>
                  <button className="rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                    3
                  </button>
                </li>
                <li>
                  <span className="px-3 py-2 text-sm text-slate-400">...</span>
                </li>
                <li>
                  <button className="rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                    12
                  </button>
                </li>
                <li>
                  <button className="rounded px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

