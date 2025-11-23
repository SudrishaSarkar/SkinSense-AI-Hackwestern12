import type { Env, StorePrice } from "../../types";

export async function fetchAmazonPrice(
  productName: string,
  env: Env
): Promise<StorePrice> {
  try {
    const encoded = encodeURIComponent(productName);

    const url = `https://real-time-amazon-data.p.rapidapi.com/product-details?asin=&query=${encoded}&country=CA`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com",
        "x-rapidapi-key": env.AMAZON_RAPIDAPI_KEY,
      },
    });

    if (!response.ok) {
      return {
        store: "AmazonCA",
        price: null,
        url: "",
        image: null,
        last_checked: Date.now(),
      };
    }

    const json = (await response.json()) as {
      data?: {
        product_price?: number;
        product_url?: string;
        product_main_image_url?: string;
      };
    };

    const item = json?.data;

    if (!item) {
      return {
        store: "AmazonCA",
        price: null,
        url: "",
        image: null,
        last_checked: Date.now(),
      };
    }

    return {
      store: "AmazonCA",
      price: item?.product_price ?? null,
      url: item?.product_url ?? "",
      image: item?.product_main_image_url ?? null,
      last_checked: Date.now(),
    };
  } catch {
    return {
      store: "AmazonCA",
      price: null,
      url: "",
      image: null,
      last_checked: Date.now(),
    };
  }
}
