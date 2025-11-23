import type { Product } from "../types";

export function filterFragranceFree(products: Product[]) {
  // Check if product ingredients contain fragrance
  return products.filter((p) => {
    const ingredientsLower = p.ingredients.map((i) => i.toLowerCase());
    return !ingredientsLower.some(
      (i) => i.includes("fragrance") || i.includes("parfum")
    );
  });
}

export function filterBySkinType(products: Product[], type: string) {
  return products.filter((p) => p.skin_types.includes(type));
}
