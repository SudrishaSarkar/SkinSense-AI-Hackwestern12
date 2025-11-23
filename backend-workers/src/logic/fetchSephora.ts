// src/api/fetchSephora.ts
import type { Env } from "../types";

interface FetchSephoraRequest {
  productName: string;
}

export async function handleFetchSephora(request: Request, env: Env) {
  try {
    const body = (await request.json()) as FetchSephoraRequest;
    const { productName } = body;

    if (!productName) {
      return new Response(JSON.stringify({ error: "Missing productName" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const baseUrl =
      "https://real-time-sephora-api.p.rapidapi.com/search-by-category";

    const params = new URLSearchParams({
      categoryId: "skincare",
      sortBy: "BEST_SELLING",
      pageSize: "40",
      currentPage: "1",
      minPrice: "0",
      maxPrice: "500",
      query: productName,
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": env.SEPHORA_RAPIDAPI_KEY || env.RAPIDAPI_KEY,
        "x-rapidapi-host": "real-time-sephora-api.p.rapidapi.com",
      },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Sephora API failed" }),
      { status: 500 }
    );
  }
}
