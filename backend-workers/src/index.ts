// src/index.ts
import type { Env } from "./types";
import { handleAnalyzeSkin } from "./routes/analyzeSkin";
import { handleCycleInsights } from "./routes/cycleInsights";
import { handleRecommendProducts } from "./routes/recommendProducts";
import { handlePriceCompare } from "./api/priceCompare";
import { handleInvestment } from "./routes/investment";
import { handleRecommendationBundle } from "./routes/recommendationBundle";
import { handleFetchSephora } from "./api/fetch-sephora";

import { corsHeaders } from "./utils/cors";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (pathname === "/" && request.method === "GET") {
        return new Response(
          JSON.stringify({
            message: "SkinSense AI Backend API",
            version: "1.0.0",
            endpoints: {
              "POST /api/analyze-skin": "Analyze skin",
              "POST /api/cycle-insights": "Get cycle insights",
              "POST /api/recommend-products": "Recommend products",
              "POST /api/fetch-sephora": "Fetch Sephora price",
              "GET /api/price-compare?product=NAME": "Store price compare",
              "POST /api/recommendation-bundle": "Complete bundle",
            },
          }),
          {
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      if (pathname === "/api/analyze-skin" && request.method === "POST")
        return handleAnalyzeSkin(request, env);

      if (pathname === "/api/cycle-insights" && request.method === "POST")
        return handleCycleInsights(request, env);

      if (pathname === "/api/recommend-products" && request.method === "POST")
        return handleRecommendProducts(request, env);

      if (pathname === "/api/price-compare" && request.method === "GET")
        return handlePriceCompare(request, env);

      if (pathname === "/api/investment" && request.method === "POST")
        return handleInvestment(request, env);

      if (
        pathname === "/api/recommendation-bundle" &&
        request.method === "POST"
      )
        return handleRecommendationBundle(request, env);

      // ⭐ NEW: Sephora endpoint
      if (pathname === "/api/fetch-sephora" && request.method === "POST")
        return handleFetchSephora(request, env);

      return new Response(
        JSON.stringify({
          error: "Not found",
          path: pathname,
          method: request.method,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (err: any) {
      console.error(err);
      return new Response(
        JSON.stringify({ error: err.message || "Internal error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  },
};
