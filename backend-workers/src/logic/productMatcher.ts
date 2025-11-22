import type { SkinProfile, Product } from "../types";

export function matchProductsToSkinProfile(
  profile: SkinProfile,
  products: Product[]
): Product[] {
  // TODO: implement full matching logic
  return products.slice(0, 10); // placeholder
}
