import type { Env } from "../types";

export async function handlePriceCompare(request: Request, env: Env) {
  const url = new URL(request.url);
  const productName = url.searchParams.get("product") || "";

  // TODO: Walmart, Amazon, Sephora, Shoppers scraping

  const result = {
    product_name: productName,
    prices: [],
  };

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}
