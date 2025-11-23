// backend-workers/src/routes/priceCompare.ts
import type { Env, PriceComparisonResult, StorePrice } from "../types";
import { fetchAllPrices } from "../logic/logicFetcher";

export async function handlePriceCompare(request: Request, env: Env) {
  const url = new URL(request.url);
  const productName = url.searchParams.get("product");

  if (!productName) {
    return new Response(JSON.stringify({ error: "Missing ?product=" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const prices = await fetchAllPrices(productName, env);

  const cheapest = prices
    .filter((p: StorePrice) => p.price !== null)
    .sort(
      (a: StorePrice, b: StorePrice) =>
        (a.price ?? Infinity) - (b.price ?? Infinity)
    )[0];

  const result: PriceComparisonResult = {
    product_name: productName,
    prices,
    cheapest_store: cheapest ? cheapest.store : undefined,
  };

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}
