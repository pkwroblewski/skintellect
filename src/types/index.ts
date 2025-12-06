// ========================================
// SKINTELLECT TYPE DEFINITIONS
// ========================================

// Skin Types
export type SkinType = "oily" | "dry" | "combination" | "normal" | "sensitive";

// Ingredient function categories
export type IngredientFunction =
  | "moisturizing"
  | "antioxidant"
  | "exfoliating"
  | "soothing"
  | "brightening"
  | "acne-fighting"
  | "anti-aging"
  | "cleansing"
  | "preservative"
  | "fragrance"
  | "emulsifier"
  | "solvent"
  | "other";

// Base Ingredient type
export interface Ingredient {
  id: string;
  name: string;
  slug: string;
  inciName?: string;
  aliases?: string[];
  description?: string;
  functions: IngredientFunction[];
  comedogenicRating?: number; // 0-5
  irritationLevel?: number; // 0-5
  isFungalAcneTrigger: boolean;
  isAllergen: boolean;
  isReefUnsafe: boolean;
  benefits?: string[];
  concerns?: string[];
}

// Analysis result for a single ingredient
export interface AnalyzedIngredient {
  ingredient: Ingredient | null;
  originalText: string;
  position: number;
  isRecognized: boolean;
}

// Full analysis result
export interface AnalysisResult {
  ingredients: AnalyzedIngredient[];
  summary: {
    /** Total number of ingredients parsed */
    total: number;
    /** Number of ingredients found in the database */
    recognized: number;
    /** Number of ingredients not found in the database */
    unrecognized: number;
    /** Whether no fungal acne triggers were found */
    isFungalAcneSafe: boolean;
    /** Names of ingredients that trigger fungal acne */
    fungalAcneTriggers: string[];
    /** Names of ingredients with high irritation levels */
    potentialIrritants: string[];
    /** Names of ingredients flagged as potential allergens */
    potentialAllergens: string[];
    /** Names of ingredients with high comedogenic ratings */
    comedogenicIngredients: string[];
    /** Names of ingredients that are harmful to marine life */
    reefUnsafe?: string[];
  };
}

// Component prop types
export interface BadgeVariant {
  variant: "default" | "success" | "warning" | "danger" | "info" | "outline" | "rose";
  size?: "sm" | "md";
}

export interface ButtonVariant {
  variant: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

// ========================================
// DATA SOURCE DOCUMENTATION
// ========================================
// TODO: The following data sources need to be consolidated into a single
// Prisma database schema when the backend is implemented:
//
// 1. src/app/ingredients/page.tsx - `ingredients` array
//    Contains: id, name, slug, functions, description, isFungalAcneTrigger, isAllergen
//
// 2. src/app/ingredients/[slug]/page.tsx - `ingredientsData` object
//    Contains: id, name, slug, inciName, functions, description, benefits, concerns,
//              isFungalAcneTrigger, isAllergen, comedogenicRating, goodFor
//
// 3. src/app/analyze/page.tsx - `knownIngredients` map
//    Contains: name, functions, isFungalAcneTrigger, isAllergen, isReefUnsafe,
//              comedogenicRating, irritationLevel
//
// All three should map to the Ingredient interface defined above.
// The database schema should include all fields from the most complete source (ingredientsData)
// plus any additional fields from the other sources (isReefUnsafe, irritationLevel).
// ========================================

