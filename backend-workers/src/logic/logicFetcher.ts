// src/logic/logicFetcher.ts
import type { Env, StorePrice } from "../types";

interface AmazonResponse {
  data?: {
    products?: Array<{
      product_price: string;
      product_url?: string;
      product_photo?: string;
    }>;
  };
}

interface SephoraResponse {
  data?: {
    products?: Array<{
      currentSku?: {
        listPrice?: string;
      };
      price?: string;
      targetUrl?: string;
      heroImage?: string;
    }>;
  };
}

export async function fetchAllPrices(productName: string, env: Env) {
  const results: StorePrice[] = [];

  // ⭐ AMAZON
  try {
    const amazon = await fetch(
      `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(
        productName
      )}&country=CA&sort_by=RELEVANCE&page=1&language=en_CA`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": env.RAPIDAPI_KEY,
          "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
        },
      }
    );

    const data = (await amazon.json()) as AmazonResponse;
    const first = data?.data?.products?.[0];

    results.push({
      store: "AmazonCA",
      price: first
        ? parseFloat(first.product_price.replace(/[^0-9.]/g, ""))
        : null,
      url: first?.product_url || "",
      image: first?.product_photo || null,
      last_checked: Date.now(),
    });
  } catch (e) {
    console.error("Amazon fetch error", e);
  }

  // ⭐ SEPHORA
  try {
    const sephora = await fetch(
      `https://real-time-sephora-api.p.rapidapi.com/search-by-category?categoryId=skincare&sortBy=BEST_SELLING&pageSize=20&currentPage=1&query=${encodeURIComponent(
        productName
      )}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": env.RAPIDAPI_KEY,
          "x-rapidapi-host": "real-time-sephora-api.p.rapidapi.com",
        },
      }
    );

    const data = (await sephora.json()) as SephoraResponse;
    const first = data?.data?.products?.[0];

    results.push({
      store: "SephoraCA",
      price: first
        ? parseFloat(first.currentSku?.listPrice || first.price || "0")
        : null,
      url: first?.targetUrl || "",
      image: first?.heroImage || null,
      last_checked: Date.now(),
    });
  } catch (e) {
    console.error("Sephora fetch failed", e);
  }

  // ⭐ SHOPPERS (placeholder)
  results.push({
    store: "Shoppers",
    price: null,
    url: `https://www.shoppersdrugmart.ca/en/search?query=${encodeURIComponent(
      productName
    )}`,
    image: null,
    last_checked: Date.now(),
  });

  return results;
}
