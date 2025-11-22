

export interface Env {
  CACHE: KVNamespace;
  GEMINI_API_KEY: string;
  WALMART_API_KEY: string;
  AMAZON_RAPIDAPI_KEY: string;
  ELEVENLABS_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Test KV cache route
    if (pathname === "/test-cache") {
      await env.CACHE.put("hello", "world");
      const result = await env.CACHE.get("hello");
      return new Response(`CACHE works! Value: ${result}`);
    }

    // Default route
    return new Response("Worker is running!");
  }
};



