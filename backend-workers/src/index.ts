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
    _ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // -----------------------------
      //   ROOT INFO ENDPOINT
      // -----------------------------
      if (pathname === "/" && request.method === "GET") {
        return new Response(
          JSON.stringify({
            service: "SkinSense AI Backend",
            version: "1.0.0",
            environment: env.ENVIRONMENT ?? "production",
            endpoints: {
              GET: {
                "/test": "Health check",
                "/api/price-compare": "Compare real-time store prices",
              },
              POST: {
                "/api/analyze-skin": "Skin analysis via Gemini Vision",
                "/api/cycle-insights":
                  "Cycle-based lifestyle insights (Gemini text)",
                "/api/recommend-products":
                  "Recommend products from dataset only",
                "/api/recommendation-bundle":
                  "Full pipeline: analyze → cycle → routine → products → prices",
                "/api/investment": "Simple calculator",
              },
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

      // -----------------------------
      //   HEALTH CHECK
      // -----------------------------
      if (pathname === "/test" && request.method === "GET") {
        return new Response(
          JSON.stringify({
            status: "ok",
            msg: "Worker running",
            timestamp: Date.now(),
          }),
          {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }

      // -----------------------------
      //   SKIN ANALYSIS
      // -----------------------------
      if (pathname === "/api/analyze-skin" && request.method === "POST") {
        return handleAnalyzeSkin(request, env);
      }

      // -----------------------------
      //   CYCLE INSIGHTS
      // -----------------------------
      if (pathname === "/api/cycle-insights" && request.method === "POST") {
        return handleCycleInsights(request, env);
      }

      // -----------------------------
      //   PRODUCT RECOMMENDER (LOCAL DATASET)
      // -----------------------------
      if (pathname === "/api/recommend-products" && request.method === "POST") {
        return handleRecommendProducts(request, env);
      }

      // -----------------------------
      //   PRICE COMPARISON
      // -----------------------------
      if (pathname === "/api/price-compare" && request.method === "GET") {
        return handlePriceCompare(request, env);
      }

      // -----------------------------
      //   INVESTMENT CALC
      // -----------------------------
      if (pathname === "/api/investment" && request.method === "POST") {
        return handleInvestment(request, env);
      }

      // -----------------------------
      //   FULL PIPELINE BUNDLE
      // -----------------------------
      if (
        pathname === "/api/recommendation-bundle" &&
        request.method === "POST"
      ) {
        return handleRecommendationBundle(request, env);
      }

      // -----------------------------
      //   404
      // -----------------------------
      return new Response(
        JSON.stringify({
          error: "Not Found",
          method: request.method,
          path: pathname,
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
      console.error("🔥 GLOBAL ERROR:", err);

      return new Response(
        JSON.stringify({
          error: err?.message || "Internal server error",
          stack: env.ENVIRONMENT === "local" ? err?.stack : undefined,
        }),
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
