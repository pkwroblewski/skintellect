"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Button, Textarea, Card, CardContent, Badge } from "@/components/ui";
import type { AnalysisResult, AnalyzedIngredient } from "@/types";

// Mock analysis function
function analyzeIngredients(text: string): AnalysisResult {
  const lines = text
    .split(/,|\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const knownIngredients: Record<string, Partial<AnalyzedIngredient["ingredient"]>> = {
    water: { name: "Water", functions: ["solvent"], isFungalAcneTrigger: false, isAllergen: false, isReefUnsafe: false },
    aqua: { name: "Water", functions: ["solvent"], isFungalAcneTrigger: false, isAllergen: false, isReefUnsafe: false },
    glycerin: { name: "Glycerin", functions: ["moisturizing"], isFungalAcneTrigger: false, isAllergen: false, isReefUnsafe: false, comedogenicRating: 0 },
    niacinamide: { name: "Niacinamide", functions: ["brightening", "anti-aging"], isFungalAcneTrigger: false, isAllergen: false, isReefUnsafe: false },
    "hyaluronic acid": { name: "Hyaluronic Acid", functions: ["moisturizing"], isFungalAcneTrigger: false, isAllergen: false, isReefUnsafe: false },
    "salicylic acid": { name: "Salicylic Acid", functions: ["exfoliating", "acne-fighting"], isFungalAcneTrigger: false, isAllergen: false, isReefUnsafe: false },
    retinol: { name: "Retinol", functions: ["anti-aging"], isFungalAcneTrigger: false, isAllergen: false, isReefUnsafe: false, irritationLevel: 3 },
    fragrance: { name: "Fragrance", functions: ["fragrance"], isFungalAcneTrigger: false, isAllergen: true, isReefUnsafe: false },
    parfum: { name: "Fragrance", functions: ["fragrance"], isFungalAcneTrigger: false, isAllergen: true, isReefUnsafe: false },
    "isopropyl palmitate": { name: "Isopropyl Palmitate", functions: ["emulsifier"], isFungalAcneTrigger: true, isAllergen: false, isReefUnsafe: false, comedogenicRating: 4 },
    "coconut oil": { name: "Coconut Oil", functions: ["moisturizing"], isFungalAcneTrigger: true, isAllergen: false, isReefUnsafe: false, comedogenicRating: 4 },
    "cetyl alcohol": { name: "Cetyl Alcohol", functions: ["emulsifier"], isFungalAcneTrigger: false, isAllergen: false, isReefUnsafe: false, comedogenicRating: 2 },
    phenoxyethanol: { name: "Phenoxyethanol", functions: ["preservative"], isFungalAcneTrigger: false, isAllergen: false, isReefUnsafe: false },
  };

  const analyzedIngredients: AnalyzedIngredient[] = lines.map((line, index) => {
    const normalized = line.toLowerCase().replace(/[^a-z\s]/g, "").trim();
    const match = knownIngredients[normalized];

    return {
      originalText: line,
      position: index + 1,
      isRecognized: !!match,
      ingredient: match
        ? {
            id: normalized,
            name: match.name!,
            slug: normalized.replace(/\s+/g, "-"),
            functions: match.functions as AnalyzedIngredient["ingredient"]["functions"],
            isFungalAcneTrigger: match.isFungalAcneTrigger ?? false,
            isAllergen: match.isAllergen ?? false,
            isReefUnsafe: match.isReefUnsafe ?? false,
            comedogenicRating: match.comedogenicRating,
            irritationLevel: match.irritationLevel,
          }
        : null,
    };
  });

  const fungalTriggers = analyzedIngredients
    .filter((i) => i.ingredient?.isFungalAcneTrigger)
    .map((i) => i.ingredient!.name);

  const allergens = analyzedIngredients
    .filter((i) => i.ingredient?.isAllergen)
    .map((i) => i.ingredient!.name);

  const irritants = analyzedIngredients
    .filter((i) => (i.ingredient?.irritationLevel ?? 0) >= 3)
    .map((i) => i.ingredient!.name);

  const comedogenic = analyzedIngredients
    .filter((i) => (i.ingredient?.comedogenicRating ?? 0) >= 3)
    .map((i) => i.ingredient!.name);

  return {
    ingredients: analyzedIngredients,
    summary: {
      total: analyzedIngredients.length,
      recognized: analyzedIngredients.filter((i) => i.isRecognized).length,
      unrecognized: analyzedIngredients.filter((i) => !i.isRecognized).length,
      isFungalAcneSafe: fungalTriggers.length === 0,
      fungalAcneTriggers: fungalTriggers,
      potentialAllergens: allergens,
      potentialIrritants: irritants,
      comedogenicIngredients: comedogenic,
    },
  };
}

const functionColors: Record<string, string> = {
  moisturizing: "bg-sky-50 text-sky-700",
  antioxidant: "bg-emerald-50 text-emerald-700",
  exfoliating: "bg-amber-50 text-amber-700",
  soothing: "bg-violet-50 text-violet-700",
  brightening: "bg-pink-50 text-pink-700",
  "acne-fighting": "bg-rose-50 text-rose-700",
  "anti-aging": "bg-indigo-50 text-indigo-700",
  cleansing: "bg-cyan-50 text-cyan-700",
  preservative: "bg-slate-100 text-slate-600",
  fragrance: "bg-orange-50 text-orange-700",
  emulsifier: "bg-slate-100 text-slate-600",
  solvent: "bg-slate-50 text-slate-500",
};

function IngredientRow({ item }: { item: AnalyzedIngredient }) {
  const { ingredient, originalText, position, isRecognized } = item;

  return (
    <div className={`flex items-start gap-4 p-4 ${
      !isRecognized ? "bg-amber-50/50" : ""
    }`}>
      {/* Position */}
      <div className="flex-shrink-0 w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500">
        {position}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-medium text-slate-900">
              {ingredient?.name || originalText}
            </h4>
            {!isRecognized && (
              <p className="text-xs text-amber-600 mt-0.5">Not in database</p>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1 justify-end">
            {ingredient?.isFungalAcneTrigger && (
              <Badge variant="danger" size="sm">FA Trigger</Badge>
            )}
            {ingredient?.isAllergen && (
              <Badge variant="warning" size="sm">Allergen</Badge>
            )}
            {(ingredient?.comedogenicRating ?? 0) >= 3 && (
              <Badge variant="warning" size="sm">Comedogenic</Badge>
            )}
          </div>
        </div>

        {/* Function Tags */}
        {ingredient?.functions && (
          <div className="flex flex-wrap gap-1 mt-2">
            {ingredient.functions.map((fn) => (
              <span
                key={fn}
                className={`inline-flex px-1.5 py-0.5 rounded text-xs ${
                  functionColors[fn] || "bg-slate-100 text-slate-600"
                }`}
              >
                {fn}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const analysisResult = analyzeIngredients(inputText);
      setResult(analysisResult);
      setIsAnalyzing(false);
    }, 400);
  };

  const handleClear = () => {
    setInputText("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="border-b border-slate-100 bg-gradient-subtle py-10">
        <Container size="md">
          <div className="max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
              Ingredient Checker
            </h1>
            <p className="text-slate-600">
              Paste your product&apos;s ingredient list below to get instant analysis.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <Container size="md">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Input Column */}
            <div className="lg:col-span-2">
              <Card variant="outlined">
                <CardContent>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Ingredient List
                  </label>
                  <Textarea
                    placeholder="Paste ingredient list here...

Example:
Water, Glycerin, Niacinamide, Hyaluronic Acid, Cetyl Alcohol"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="min-h-[200px] text-sm resize-none"
                  />
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleAnalyze}
                      disabled={!inputText.trim() || isAnalyzing}
                      className="flex-1"
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze"}
                    </Button>
                    {result && (
                      <Button variant="outline" onClick={handleClear}>
                        Clear
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-3">
              {!result ? (
                <div className="h-full flex items-center justify-center text-center py-16">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-500">
                      Your analysis results will appear here
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                      <div className="text-xl font-semibold text-slate-900">{result.summary.total}</div>
                      <div className="text-xs text-slate-500">Total</div>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-center">
                      <div className="text-xl font-semibold text-emerald-600">{result.summary.recognized}</div>
                      <div className="text-xs text-emerald-600">Known</div>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-center">
                      <div className="text-xl font-semibold text-amber-600">{result.summary.unrecognized}</div>
                      <div className="text-xs text-amber-600">Unknown</div>
                    </div>
                    <div className={`p-3 rounded-lg border text-center ${
                      result.summary.isFungalAcneSafe 
                        ? "bg-emerald-50 border-emerald-100" 
                        : "bg-red-50 border-red-100"
                    }`}>
                      <div className={`text-xl font-semibold ${
                        result.summary.isFungalAcneSafe ? "text-emerald-600" : "text-red-600"
                      }`}>
                        {result.summary.isFungalAcneSafe ? "Safe" : "Risk"}
                      </div>
                      <div className={`text-xs ${
                        result.summary.isFungalAcneSafe ? "text-emerald-600" : "text-red-600"
                      }`}>
                        FA Status
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {(result.summary.fungalAcneTriggers.length > 0 ||
                    result.summary.potentialAllergens.length > 0 ||
                    result.summary.comedogenicIngredients.length > 0) && (
                    <Card className="border-amber-200 bg-amber-50/50">
                      <CardContent className="space-y-2">
                        <h3 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                          <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Ingredients to Note
                        </h3>
                        
                        {result.summary.fungalAcneTriggers.length > 0 && (
                          <div className="flex items-start gap-2 text-sm">
                            <Badge variant="danger" size="sm">FA</Badge>
                            <span className="text-slate-700">{result.summary.fungalAcneTriggers.join(", ")}</span>
                          </div>
                        )}
                        {result.summary.potentialAllergens.length > 0 && (
                          <div className="flex items-start gap-2 text-sm">
                            <Badge variant="warning" size="sm">Allergen</Badge>
                            <span className="text-slate-700">{result.summary.potentialAllergens.join(", ")}</span>
                          </div>
                        )}
                        {result.summary.comedogenicIngredients.length > 0 && (
                          <div className="flex items-start gap-2 text-sm">
                            <Badge variant="warning" size="sm">Pore</Badge>
                            <span className="text-slate-700">{result.summary.comedogenicIngredients.join(", ")}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Ingredient Breakdown */}
                  <Card variant="outlined">
                    <div className="px-5 py-3 border-b border-slate-100">
                      <h3 className="text-sm font-medium text-slate-900">All Ingredients</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {result.ingredients.map((item, index) => (
                        <IngredientRow key={index} item={item} />
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
