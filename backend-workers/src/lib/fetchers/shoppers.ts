import type { StorePrice } from "../../types";

export async function fetchShoppersPrice(
  productName: string
): Promise<StorePrice> {
  try {
    const encoded = encodeURIComponent(productName);
    const url = `https://www.shoppersdrugmart.ca/en/search?query=${encoded}`;

    const html = await fetch(url).then((r) => r.text());

    // Extract price
    const priceMatch = html.match(/"price":\s*"(\$?[\d\.]+)"/);
    const price = priceMatch
      ? parseFloat(priceMatch[1].replace("$", ""))
      : null;

    // Extract image (SDM uses lazy-loaded data-src)
    const imgMatch =
      html.match(/data-src="([^"]+)"/) || html.match(/<img[^>]+src="([^"]+)"/);

    const image = imgMatch ? imgMatch[1] : null;

    return {
      store: "Shoppers",
      price,
      url,
      image,
      last_checked: Date.now(),
    };
  } catch {
    return {
      store: "Shoppers",
      price: null,
      url: "",
      image: null,
      last_checked: Date.now(),
    };
  }
}
