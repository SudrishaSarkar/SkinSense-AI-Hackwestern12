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
  return products.filter((p) => p.fragrance_free);
}
