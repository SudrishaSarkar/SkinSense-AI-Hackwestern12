// src/api/priceCompare.ts
import type { Env, PriceComparisonResult } from "../types";
import { fetchAllPrices } from "../logic/logicFetcher";
import { corsHeaders } from "../utils/cors";

export async function handlePriceCompare(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const product = url.searchParams.get("product");

  if (!product) {
    return new Response(JSON.stringify({ error: "Missing ?product=" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  const prices = await fetchAllPrices(product, env);
  const cheapest = prices
    .filter((p) => p.price !== null)
    .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))[0];

  const result: PriceComparisonResult = {
    product_name: product,
    prices,
    cheapest_store: cheapest?.store,
  };

  return new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}
