import type { Product } from "../types";

export function filterFragranceFree(products: Product[]) {
  return products.filter((p) => p.fragrance_free);
}

export function filterBySkinType(products: Product[], type: string) {
  return products.filter((p) => p.suitable_for.includes(type));
}
