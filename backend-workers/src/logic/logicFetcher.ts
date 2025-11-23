import type { Env, StorePrice } from "../types";
import { fetchAmazonPrice } from "../lib/fetchers/amazon";
import { fetchSephoraPrice } from "../lib/fetchers/sephora";
import { fetchShoppersPrice } from "../lib/fetchers/shoppers";

/**
 * Fetch prices + images from Amazon, Sephora, and Shoppers Drug Mart.
 * Uses Promise.allSettled so one store failing doesn't break everything.
 *
 * In local dev mode, returns mock data instantly to avoid slow API calls.
 */
export async function fetchAllPrices(
  productName: string,
  env: Env
): Promise<StorePrice[]> {
  // Fast local mode - return mock data instantly
  if (env.ENVIRONMENT === "local") {
    return [
      {
        store: "AmazonCA",
        price: 19.99,
        url: `https://www.amazon.ca/s?k=${encodeURIComponent(productName)}`,
        image: null,
        last_checked: Date.now(),
      },
      {
        store: "SephoraCA",
        price: 25.0,
        url: `https://www.sephora.com/ca/en/search?keyword=${encodeURIComponent(
          productName
        )}`,
        image: null,
        last_checked: Date.now(),
      },
      {
        store: "Shoppers",
        price: 22.5,
        url: `https://www.shoppersdrugmart.ca/en/search?query=${encodeURIComponent(
          productName
        )}`,
        image: null,
        last_checked: Date.now(),
      },
    ];
  }

  // Production mode - fetch real prices
  const promises = [
    fetchAmazonPrice(productName, env), // AmazonCA
    fetchSephoraPrice(productName), // SephoraCA
    fetchShoppersPrice(productName), // Shoppers
  ];

  const results = await Promise.allSettled(promises);

  return results.map((res, index) => {
    if (res.status === "fulfilled") {
      return res.value as StorePrice;
    }

    // fallback mapping:
    const storeNames = ["AmazonCA", "SephoraCA", "Shoppers"];

    return {
      store: storeNames[index],
      price: null,
      url: "",
      image: null,
      last_checked: Date.now(),
    } as StorePrice;
  });
}
