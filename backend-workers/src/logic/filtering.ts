import type { Product } from "../types";

export function filterByBudget(products: Product[], max: number): Product[] {
  return products.filter((p) => (p.price_estimate || 999) <= max);
}

export function filterByCategory(
  products: Product[],
  category: string
): Product[] {
  return products.filter((p) => p.category === category);
}

export function filterFragranceFree(products: Product[]): Product[] {
  // Check if product ingredients contain fragrance
  return products.filter((p) => {
    const ingredientsLower = p.ingredients.map((i) => i.toLowerCase());
    return !ingredientsLower.some(
      (i) => i.includes("fragrance") || i.includes("parfum")
    );
  });
}
