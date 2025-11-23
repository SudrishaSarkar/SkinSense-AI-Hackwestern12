// src/lib/fetchers/amazon.ts

export interface AmazonProduct {
  asin: string;
  product_title: string;
  product_price: string | null;
  currency: string | null;
  product_url: string;
  product_photo?: string | null;
}

interface AmazonSearchResponse {
  status: string;
  data?: {
    products?: AmazonProduct[];
  };
}

/**
 * Search Amazon.ca via RapidAPI "Real-Time Amazon Data"
 */
export async function searchAmazonProducts(
  query: string,
  rapidApiKey: string
): Promise<AmazonProduct[]> {
  const url = new URL("https://real-time-amazon-data.p.rapidapi.com/search");
  url.searchParams.set("query", query);
  url.searchParams.set("country", "CA");
  url.searchParams.set("sort_by", "RELEVANCE");
  url.searchParams.set("page", "1");
  url.searchParams.set("language", "en_CA");

  const resp = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
      "x-rapidapi-key": rapidApiKey,
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error("Amazon RapidAPI error:", resp.status, text);
    throw new Error(`Amazon RapidAPI error ${resp.status}`);
  }

  const data = (await resp.json()) as AmazonSearchResponse;
  const products = data?.data?.products ?? [];
  return products;
}
