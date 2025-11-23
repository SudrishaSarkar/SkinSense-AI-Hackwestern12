// src/lib/fetchers/shoppers.ts
import type { StorePrice } from "../../types";

/**
 * For hackathon scope, we do NOT scrape Shoppers (CORS, HTML, anti-bot).
 * Instead we return a search URL and null price.
 */
export async function fetchShoppersPrice(
  productName: string
): Promise<StorePrice> {
  const url = `https://www.shoppersdrugmart.ca/en/search?query=${encodeURIComponent(
    productName
  )}`;

  return {
    store: "Shoppers",
    price: null,
    url,
    image: null,
    last_checked: Date.now(),
  };
}
