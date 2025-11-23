import type { StorePrice } from "../../types";

export async function fetchSephoraPrice(
  productName: string
): Promise<StorePrice> {
  try {
    const encoded = encodeURIComponent(productName);
    const url = `https://www.sephora.com/ca/en/search?keyword=${encoded}`;

    const html = await fetch(url).then((r) => r.text());

    const priceMatch = html.match(/"listPrice":\s*"(\$?[\d\.]+)"/);
    const imageMatch = html.match(/"imageUrl":\s*"([^"]+)"/);

    const price = priceMatch
      ? parseFloat(priceMatch[1].replace("$", ""))
      : null;
    const image = imageMatch ? imageMatch[1] : null;

    return {
      store: "SephoraCA",
      price,
      url,
      image,
      last_checked: Date.now(),
    };
  } catch {
    return {
      store: "SephoraCA",
      price: null,
      url: "",
      image: null,
      last_checked: Date.now(),
    };
  }
}
