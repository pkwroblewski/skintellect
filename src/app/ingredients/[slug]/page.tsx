import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Card, CardContent, Badge, Button } from "@/components/ui";

const ingredientsData: Record<string, {
  id: string;
  name: string;
  slug: string;
  inciName?: string;
  functions: string[];
  description: string;
  benefits?: string[];
  concerns?: string[];
  isFungalAcneTrigger: boolean;
  isAllergen?: boolean;
  comedogenicRating: number;
  goodFor?: string[];
}> = {
  niacinamide: {
    id: "1",
    name: "Niacinamide",
    slug: "niacinamide",
    inciName: "Niacinamide",
    functions: ["brightening", "anti-aging"],
    description: "Niacinamide, also known as nicotinamide, is a form of vitamin B3. It's one of the most researched and versatile skincare ingredients, offering multiple benefits for various skin concerns.",
    benefits: ["Minimizes enlarged pores", "Improves uneven skin tone", "Strengthens skin barrier", "Reduces fine lines", "Regulates oil production"],
    concerns: [],
    isFungalAcneTrigger: false,
    comedogenicRating: 0,
    goodFor: ["All skin types", "Oily skin", "Acne-prone", "Aging skin"],
  },
  "hyaluronic-acid": {
    id: "2",
    name: "Hyaluronic Acid",
    slug: "hyaluronic-acid",
    inciName: "Sodium Hyaluronate",
    functions: ["moisturizing"],
    description: "Hyaluronic acid is a powerful humectant naturally found in the skin. It can hold up to 1,000 times its weight in water, making it exceptional for hydration.",
    benefits: ["Intense hydration", "Plumps skin", "Reduces fine lines", "Non-comedogenic", "Suitable for all skin types"],
    concerns: [],
    isFungalAcneTrigger: false,
    comedogenicRating: 0,
    goodFor: ["All skin types", "Dry skin", "Dehydrated skin"],
  },
  "salicylic-acid": {
    id: "3",
    name: "Salicylic Acid",
    slug: "salicylic-acid",
    inciName: "Salicylic Acid",
    functions: ["exfoliating", "acne-fighting"],
    description: "Salicylic acid is a beta-hydroxy acid (BHA) derived from willow bark. It's oil-soluble, allowing it to penetrate pores and dissolve debris.",
    benefits: ["Unclogs pores", "Fights acne", "Exfoliates dead skin", "Anti-inflammatory"],
    concerns: ["May cause dryness", "Increases sun sensitivity"],
    isFungalAcneTrigger: false,
    comedogenicRating: 0,
    goodFor: ["Oily skin", "Acne-prone skin"],
  },
  retinol: {
    id: "4",
    name: "Retinol",
    slug: "retinol",
    inciName: "Retinol",
    functions: ["anti-aging"],
    description: "Retinol is a derivative of vitamin A and one of the most proven anti-aging ingredients. It accelerates cell turnover and boosts collagen.",
    benefits: ["Reduces wrinkles", "Improves texture", "Boosts collagen", "Fades dark spots"],
    concerns: ["Can cause irritation initially", "Increases sun sensitivity", "Not for pregnancy"],
    isFungalAcneTrigger: false,
    comedogenicRating: 0,
    goodFor: ["Aging skin", "Uneven skin tone"],
  },
  "isopropyl-palmitate": {
    id: "9",
    name: "Isopropyl Palmitate",
    slug: "isopropyl-palmitate",
    inciName: "Isopropyl Palmitate",
    functions: ["emulsifier"],
    description: "Isopropyl palmitate is an emollient commonly used in cosmetics. While it helps products spread smoothly, it's known to be problematic for many skin types.",
    benefits: ["Smooth texture", "Helps products spread"],
    concerns: ["Highly comedogenic (4/5)", "Fungal acne trigger", "Can clog pores"],
    isFungalAcneTrigger: true,
    comedogenicRating: 4,
    goodFor: [],
  },
};

const functionColors: Record<string, string> = {
  moisturizing: "bg-sky-50 text-sky-700",
  antioxidant: "bg-emerald-50 text-emerald-700",
  exfoliating: "bg-amber-50 text-amber-700",
  soothing: "bg-violet-50 text-violet-700",
  brightening: "bg-pink-50 text-pink-700",
  "acne-fighting": "bg-rose-50 text-rose-700",
  "anti-aging": "bg-indigo-50 text-indigo-700",
  emulsifier: "bg-slate-100 text-slate-600",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function IngredientDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const ingredient = ingredientsData[slug];

  if (!ingredient) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="border-b border-slate-100 bg-gradient-subtle py-8">
        <Container size="md">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-5">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/ingredients" className="hover:text-slate-900 transition-colors">Ingredients</Link>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900">{ingredient.name}</span>
          </nav>

          {/* Title and Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-1">
                {ingredient.name}
              </h1>
              {ingredient.inciName && (
                <p className="text-sm text-slate-500">INCI: {ingredient.inciName}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {ingredient.functions.map((fn) => (
                  <span
                    key={fn}
                    className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      functionColors[fn] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {fn}
                  </span>
                ))}
              </div>
            </div>

            {/* Safety Badges */}
            <div className="flex flex-wrap gap-2">
              {ingredient.isFungalAcneTrigger ? (
                <Badge variant="danger">FA Trigger</Badge>
              ) : (
                <Badge variant="success">FA Safe</Badge>
              )}
              <Badge variant={ingredient.comedogenicRating >= 3 ? "warning" : "success"}>
                Comedogenic: {ingredient.comedogenicRating}/5
              </Badge>
            </div>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-8">
        <Container size="md">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-5">
              {/* About */}
              <Card variant="outlined">
                <CardContent>
                  <h2 className="text-sm font-semibold text-slate-900 mb-2">About</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{ingredient.description}</p>
                </CardContent>
              </Card>

              {/* Benefits */}
              {ingredient.benefits && ingredient.benefits.length > 0 && (
                <Card className="border-emerald-100 bg-emerald-50/30">
                  <CardContent>
                    <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Benefits
                    </h2>
                    <ul className="space-y-1.5">
                      {ingredient.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Concerns */}
              {ingredient.concerns && ingredient.concerns.length > 0 && (
                <Card className="border-amber-100 bg-amber-50/30">
                  <CardContent>
                    <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Things to Know
                    </h2>
                    <ul className="space-y-1.5">
                      {ingredient.concerns.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-amber-500 mt-0.5">•</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Good For */}
              {ingredient.goodFor && ingredient.goodFor.length > 0 && (
                <Card variant="outlined">
                  <CardContent>
                    <h2 className="text-sm font-semibold text-slate-900 mb-3">Best For</h2>
                    <div className="flex flex-wrap gap-1.5">
                      {ingredient.goodFor.map((type) => (
                        <Badge key={type} variant="mint" size="sm">{type}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <Link href="/analyze" className="block">
                  <Button className="w-full justify-center">
                    Check Your Products
                  </Button>
                </Link>
                <Link href="/ingredients" className="block">
                  <Button variant="outline" className="w-full justify-center">
                    Browse More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
