export function parseIngredients(ingredients: string): string[] {
  // TODO: tokenize ingredients
  return ingredients.split(",").map((i) => i.trim());
}
