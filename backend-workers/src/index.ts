// src/index.ts
import type { Env } from "./types";
import { handleAnalyzeSkin } from "./routes/analyzeSkin";
import { handleCycleInsights } from "./routes/cycleInsights";
import { handleRecommendProducts } from "./routes/recommendProducts";
import { handlePriceCompare } from "./routes/priceCompare";
import { handleInvestment } from "./routes/investment";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    try {
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

      return new Response("Not found", { status: 404 });
    } catch (err: any) {
      console.error(err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
