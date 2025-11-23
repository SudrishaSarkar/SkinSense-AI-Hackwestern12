

export interface Env {
  CACHE: KVNamespace;
  GEMINI_API_KEY: string;
  WALMART_API_KEY: string;
  AMAZON_RAPIDAPI_KEY: string;
  ELEVENLABS_API_KEY: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

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
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Test route
      if (pathname === "/test" && request.method === "GET") {
        return new Response(
          JSON.stringify({ status: "ok", message: "Worker is running!" }),
          {
            headers: { "Content-Type": "application/json" },
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



