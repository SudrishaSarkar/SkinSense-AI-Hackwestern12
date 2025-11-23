// src/logic/logicFetcher.ts
import type { Env, StorePrice } from "../types";
import { searchAmazonProducts } from "../lib/fetchers/amazon";
import { fetchSephoraPriceRapidApi } from "../lib/fetchers/sephora";
import { fetchShoppersPrice } from "../lib/fetchers/shoppers";

/**
 * Fetch prices across all stores (Amazon, Sephora, Shoppers).
 * Robu st to API failures; always returns 3 entries.
 */
export async function fetchAllPrices(
  productName: string,
  env: Env
): Promise<StorePrice[]> {
  const results: StorePrice[] = [];

  // AMAZON
  try {
    if (!env.AMAZON_RAPIDAPI_KEY) {
      throw new Error("Missing AMAZON_RAPIDAPI_KEY");
    }
    const amazonProducts = await searchAmazonProducts(
      productName,
      env.AMAZON_RAPIDAPI_KEY
    );
    if (amazonProducts.length > 0) {
      const first = amazonProducts[0];
      let price: number | null = null;
      if (first.product_price) {
        // "$22.39" → 22.39
        const normalized = first.product_price.replace(/[^0-9.,]/g, "");
        price = parseFloat(normalized.replace(",", ""));
        if (Number.isNaN(price)) price = null;
      }

      results.push({
        store: "AmazonCA",
        price,
        url: first.product_url,
        image: first.product_photo ?? null,
        last_checked: Date.now(),
      });
    } else {
      results.push({
        store: "AmazonCA",
        price: null,
        url: `https://www.amazon.ca/s?k=${encodeURIComponent(productName)}`,
        image: null,
        last_checked: Date.now(),
      });
    }
  } catch (err) {
    console.error("Amazon fetch failed:", err);
    results.push({
      store: "AmazonCA",
      price: null,
      url: `https://www.amazon.ca/s?k=${encodeURIComponent(productName)}`,
      image: null,
      last_checked: Date.now(),
    });
  }

  // SEPHORA (RapidAPI + fallback)
  try {
    if (!env.SEPHORA_RAPIDAPI_KEY) {
      throw new Error("Missing SEPHORA_RAPIDAPI_KEY");
    }
    const sephoraPrice = await fetchSephoraPriceRapidApi(
      productName,
      env.SEPHORA_RAPIDAPI_KEY
    );
    if (sephoraPrice) {
      results.push(sephoraPrice);
    } else {
      results.push({
        store: "SephoraCA",
        price: null,
        url: `https://www.sephora.com/ca/en/search?keyword=${encodeURIComponent(
          productName
        )}`,
        image: null,
        last_checked: Date.now(),
      });
    }
  } catch (err) {
    console.error("Sephora fetch failed:", err);
    results.push({
      store: "SephoraCA",
      price: null,
      url: `https://www.sephora.com/ca/en/search?keyword=${encodeURIComponent(
        productName
      )}`,
      image: null,
      last_checked: Date.now(),
    });
  }

  // SHOPPERS (search URL only)
  try {
    const shoppers = await fetchShoppersPrice(productName);
    results.push(shoppers);
  } catch (err) {
    console.error("Shoppers fetch failed:", err);
    results.push({
      store: "Shoppers",
      price: null,
      url: `https://www.shoppersdrugmart.ca/en/search?query=${encodeURIComponent(
        productName
      )}`,
      image: null,
      last_checked: Date.now(),
    });
  }

  return results;
}
