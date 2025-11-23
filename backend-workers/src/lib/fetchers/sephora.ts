// src/lib/fetchers/sephora.ts
import type { StorePrice } from "../../types";

interface SephoraProduct {
  productId: string;
  displayName: string;
  currentSku?: {
    listPrice?: number;
  };
  heroImage?: string;
  targetUrl?: string;
}

interface SephoraResponse {
  data?: {
    products?: SephoraProduct[];
  };
}

/**
 * Try to get a Sephora price via RapidAPI "Real-Time Sephora API".
 * We use a broad category search (skin-care) and filter client-side by name.
 * If anything fails, caller can still fall back to a search URL.
 */
export async function fetchSephoraPriceRapidApi(
  productName: string,
  rapidApiKey: string
): Promise<StorePrice | null> {
  const url = new URL(
    "https://real-time-sephora-api.p.rapidapi.com/search-by-category"
  );
  url.searchParams.set("categoryId", "skin-care"); // generic category
  url.searchParams.set("sortBy", "BEST_SELLING");
  url.searchParams.set("pageSize", "60");
  url.searchParams.set("currentPage", "1");
  url.searchParams.set("minPrice", "0");
  url.searchParams.set("maxPrice", "500");

  const resp = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-rapidapi-host": "real-time-sephora-api.p.rapidapi.com",
      "x-rapidapi-key": rapidApiKey,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error("Sephora RapidAPI error:", resp.status, text);
    throw new Error(`Sephora RapidAPI error ${resp.status}`);
  }

  const data = (await resp.json()) as SephoraResponse;
  const products = data?.data?.products ?? [];

  if (!products.length) return null;

  const lowerQuery = productName.toLowerCase();
  const bestMatch =
    products.find((p) => p.displayName.toLowerCase().includes(lowerQuery)) ||
    products[0];

  const price = bestMatch.currentSku?.listPrice ?? null;
  const image = bestMatch.heroImage
    ? `https://www.sephora.com/productimages/sku/s${bestMatch.heroImage}-main-zoom.jpg`
    : null;

  const urlPath = bestMatch.targetUrl || "";
  const productUrl = urlPath.startsWith("http")
    ? urlPath
    : `https://www.sephora.com${urlPath}`;

  return {
    store: "SephoraCA",
    price,
    url: productUrl,
    image,
    last_checked: Date.now(),
  };
}
