import type { Env, PriceComparisonResult, StorePrice } from "../types";
import { fetchAllPrices } from "../logic/logicFetcher";

export async function handlePriceCompare(request: Request, env: Env) {
  const url = new URL(request.url);
  const product = url.searchParams.get("product");

  if (!product) {
    return new Response(JSON.stringify({ error: "Missing ?product=" }), {
      status: 400,
    });
  }

  const prices = await fetchAllPrices(product, env);

  const cheapest = prices
    .filter((p) => p.price !== null)
    .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))[0]?.store;

  const result: PriceComparisonResult = {
    product_name: product,
    prices,
    cheapest_store: cheapest,
  };

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}
