import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui";

export const metadata: Metadata = {
  title: "Skincare Routines | Skintelect",
  description:
    "Build and share skincare routines tailored to your skin type. Get personalized recommendations based on ingredient analysis.",
};

const sampleRoutines = [
  {
    id: "1",
    name: "Fungal Acne Safe AM Routine",
    description: "A gentle morning routine with no FA triggers",
    steps: 4,
    skinTypes: ["Oily", "Acne-Prone"],
    author: "Skintelect Team",
  },
  {
    id: "2",
    name: "Hydrating PM Routine",
    description: "Deep hydration for dry and dehydrated skin",
    steps: 5,
    skinTypes: ["Dry", "Normal"],
    author: "Community",
  },
  {
    id: "3",
    name: "Anti-Aging Essentials",
    description: "Retinol-based routine for mature skin",
    steps: 6,
    skinTypes: ["Mature", "Normal"],
    author: "Skintelect Team",
  },
];

export default function RoutinesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white py-10">
        <Container>
          <div className="max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
              Skincare Routines
            </h1>
            <p className="text-slate-600">
              Discover curated routines or build your own with ingredient-safe products.
            </p>
          </div>
        </Container>
      </section>

      {/* Routines Grid */}
      <section className="py-10">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {sampleRoutines.map((routine) => (
              <Card key={routine.id} hover className="h-full">
                <CardContent>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {routine.name}
                    </h3>
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700">
                      {routine.steps} steps
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mb-3">{routine.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {routine.skinTypes.map((type) => (
                      <span
                        key={type}
                        className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400">By {routine.author}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-rose-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Routine Builder Coming Soon
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              We&apos;re building a powerful routine builder that lets you create, save, and
              share skincare routines with automatic ingredient safety checks.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors"
              >
                Analyze Ingredients
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

