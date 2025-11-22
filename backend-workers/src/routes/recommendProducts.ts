import type { Env, SkinProfile, Product } from "../types";
import { matchProductsToSkinProfile } from "../logic/productMatcher";
import productsData from "../datasets/products.json";

const products = productsData as Product[];

export async function handleRecommendProducts(request: Request, env: Env) {
  const body = (await request.json()) as {
    skin_profile?: SkinProfile;
  };

  const profile = body.skin_profile as SkinProfile;

  const recommended = matchProductsToSkinProfile(profile, products);

  return new Response(JSON.stringify(recommended), {
    headers: { "Content-Type": "application/json" },
  });
}
