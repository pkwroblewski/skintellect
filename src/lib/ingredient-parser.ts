/**
 * Ingredient Parsing Utilities
 * 
 * A collection of helper functions for parsing ingredient lists from product labels.
 * These functions handle various formatting quirks commonly found in cosmetic ingredient lists.
 * 
 * @example
 * const ingredients = parseIngredientText("INGREDIENTS: Water, Glycerin, Niacinamide");
 * // Returns: ["water", "glycerin", "niacinamide"]
 */

// ========================================
// CONSTANTS
// ========================================

/**
 * Common prefixes that should be stripped from ingredient text.
 * These are typically found at the beginning of ingredient lists on product labels.
 */
const INGREDIENT_PREFIXES = [
  /^ingredients?\s*:\s*/i,
  /^active\s+ingredients?\s*:\s*/i,
  /^inactive\s+ingredients?\s*:\s*/i,
  /^other\s+ingredients?\s*:\s*/i,
  /^may\s+contain\s*:\s*/i,
  /^contains?\s*:\s*/i,
];

/**
 * Characters used to separate ingredients in a list.
 * Common delimiters include commas, semicolons, and line breaks.
 */
const DELIMITER_REGEX = /[,;\n\r]+/;

/**
 * Characters to remove during normalization.
 * Includes parenthetical notes like "(and)", "(may contain)", asterisks, etc.
 */
const NOISE_PATTERNS = [
  /\([^)]*\)/g,        // Parenthetical content
  /\[[^\]]*\]/g,       // Bracketed content
  /\*+/g,              // Asterisks (often footnote markers)
  /\d+%/g,             // Percentage values
  /[®™©]/g,            // Trademark symbols
];

/**
 * Maximum number of ingredients to analyze.
 * Prevents performance issues with extremely long lists.
 */
export const MAX_INGREDIENTS = 100;

/**
 * Maximum input text length in characters.
 * Prevents issues with extremely long input.
 */
export const MAX_INPUT_LENGTH = 10000;

// ========================================
// PARSING FUNCTIONS
// ========================================

/**
 * Strips common ingredient list prefixes from the text.
 * 
 * @param text - Raw ingredient text from a product label
 * @returns Text with prefixes removed
 * 
 * @example
 * stripPrefixes("INGREDIENTS: Water, Glycerin")
 * // Returns: "Water, Glycerin"
 */
export function stripPrefixes(text: string): string {
  let result = text.trim();
  
  for (const prefix of INGREDIENT_PREFIXES) {
    result = result.replace(prefix, "");
  }
  
  return result.trim();
}

/**
 * Removes noise patterns (parentheticals, asterisks, percentages) from text.
 * 
 * @param text - Text to clean
 * @returns Cleaned text
 * 
 * @example
 * removeNoise("Retinol* (Vitamin A)")
 * // Returns: "Retinol  "
 */
export function removeNoise(text: string): string {
  let result = text;
  
  for (const pattern of NOISE_PATTERNS) {
    result = result.replace(pattern, " ");
  }
  
  return result;
}

/**
 * Normalizes an ingredient name for comparison and lookup.
 * Converts to lowercase, removes special characters, and trims whitespace.
 * 
 * @param name - Raw ingredient name
 * @returns Normalized ingredient name suitable for database lookup
 * 
 * @example
 * normalizeIngredientName("  Hyaluronic Acid  ")
 * // Returns: "hyaluronic acid"
 * 
 * @example
 * normalizeIngredientName("Niacinamide (Vitamin B3)")
 * // Returns: "niacinamide"
 */
export function normalizeIngredientName(name: string): string {
  return removeNoise(name)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Keep only alphanumeric, spaces, and hyphens
    .replace(/\s+/g, " ")          // Collapse multiple spaces
    .trim();
}

/**
 * Splits ingredient text into individual ingredient strings.
 * Handles multiple delimiter types (commas, semicolons, line breaks).
 * 
 * @param text - Text containing multiple ingredients
 * @returns Array of raw ingredient strings (not yet normalized)
 * 
 * @example
 * splitIngredients("Water, Glycerin; Niacinamide\nRetinol")
 * // Returns: ["Water", "Glycerin", "Niacinamide", "Retinol"]
 */
export function splitIngredients(text: string): string[] {
  return text
    .split(DELIMITER_REGEX)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Parses raw ingredient text into an array of normalized ingredient names.
 * This is the main entry point for parsing ingredient lists.
 * 
 * @param text - Raw ingredient text from a product label
 * @returns Array of normalized ingredient names
 * 
 * @example
 * parseIngredientText("INGREDIENTS: Water, Glycerin, Niacinamide (B3)")
 * // Returns: ["water", "glycerin", "niacinamide"]
 */
export function parseIngredientText(text: string): string[] {
  if (!text || text.length === 0) {
    return [];
  }
  
  // Step 1: Strip prefixes
  const withoutPrefixes = stripPrefixes(text);
  
  // Step 2: Split by delimiters
  const rawIngredients = splitIngredients(withoutPrefixes);
  
  // Step 3: Normalize each ingredient
  const normalized = rawIngredients
    .map(normalizeIngredientName)
    .filter(s => s.length > 0);
  
  // Step 4: Limit to max ingredients
  return normalized.slice(0, MAX_INGREDIENTS);
}

/**
 * Validates input text and returns validation result.
 * 
 * @param text - Raw input text
 * @returns Object with isValid flag and optional error message
 */
export function validateInput(text: string): { isValid: boolean; error?: string } {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: "Please enter an ingredient list to analyze." };
  }
  
  if (text.length > MAX_INPUT_LENGTH) {
    return { 
      isValid: false, 
      error: `Input is too long. Please limit to ${MAX_INPUT_LENGTH.toLocaleString()} characters.` 
    };
  }
  
  const parsed = parseIngredientText(text);
  
  if (parsed.length === 0) {
    return { 
      isValid: false, 
      error: "No valid ingredients found. Please check your input format." 
    };
  }
  
  return { isValid: true };
}

/**
 * Returns the original text for display while providing the normalized version for lookup.
 * Preserves the original formatting while also returning a searchable key.
 * 
 * @param rawIngredient - The raw ingredient string from splitting
 * @returns Object with original text and normalized key
 */
export function prepareIngredient(rawIngredient: string): { 
  original: string; 
  normalized: string; 
} {
  return {
    original: rawIngredient.trim(),
    normalized: normalizeIngredientName(rawIngredient),
  };
}

