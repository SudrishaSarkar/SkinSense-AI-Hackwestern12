// src/index.ts
import type { Env } from "./types";
import { handleAnalyzeSkin } from "./routes/analyzeSkin";
import { handleCycleInsights } from "./routes/cycleInsights";
import { handleRecommendProducts } from "./routes/recommendProducts";
import { handlePriceCompare } from "./api/priceCompare";
import { handleInvestment } from "./routes/investment";
import { handleRecommendationBundle } from "./routes/recommendationBundle";

import { corsHeaders } from "./utils/cors";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Root route - API info
      if (pathname === "/" && request.method === "GET") {
        return new Response(
          JSON.stringify({
            message: "SkinSense AI Backend API",
            version: "1.0.0",
            endpoints: {
              "POST /api/analyze-skin": "Analyze skin from image",
              "POST /api/cycle-insights": "Get cycle-based insights",
              "POST /api/recommend-products": "Get product recommendations",
              "GET /api/price-compare?product=NAME":
                "Compare prices across stores",
              "POST /api/investment": "Calculate investment projection",
              "POST /api/recommendation-bundle":
                "Get complete recommendation bundle",
            },
          }),
          {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      // Test route
      if (pathname === "/test" && request.method === "GET") {
        return new Response(
          JSON.stringify({ status: "ok", message: "Worker is running!" }),
          {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      if (pathname === "/api/analyze-skin" && request.method === "POST") {
        return handleAnalyzeSkin(request, env);
      }

      if (pathname === "/api/cycle-insights" && request.method === "POST") {
        return handleCycleInsights(request, env);
      }

      if (pathname === "/api/recommend-products" && request.method === "POST") {
        return handleRecommendProducts(request, env);
      }

      if (pathname === "/api/price-compare" && request.method === "GET") {
        return handlePriceCompare(request, env);
      }

      if (pathname === "/api/investment" && request.method === "POST") {
        return handleInvestment(request, env);
      }

      // ✅ New all-in-one endpoint
      if (
        pathname === "/api/recommendation-bundle" &&
        request.method === "POST"
      ) {
        return handleRecommendationBundle(request, env);
      }

      return new Response(
        JSON.stringify({
          error: "Not found",
          path: pathname,
          method: request.method,
          hint: "Check / for available endpoints",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (err: any) {
      console.error(err);
      return new Response(
        JSON.stringify({ error: err.message ?? "Internal error" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
  },
};
