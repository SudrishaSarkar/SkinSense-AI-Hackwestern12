import type { KVNamespace } from "@cloudflare/workers-types";

/**
 * Get cached data from KV store
 * @param key - Cache key
 * @param cache - KVNamespace instance
 * @returns Cached data or null if not found
 */
export async function getCached<T>(key: string, cache: KVNamespace): Promise<T | null> {
  try {
    const cached = await cache.get(key, "json");
    return cached as T | null;
  } catch (error) {
    console.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
}

/**
 * Set data in KV cache
 * @param key - Cache key
 * @param data - Data to cache (will be JSON stringified)
 * @param cache - KVNamespace instance
 * @param expirationTtl - Time to live in seconds (default: 600 = 10 minutes)
 */
export async function setCached(
  key: string,
  data: any,
  cache: KVNamespace,
  expirationTtl: number = 600
): Promise<void> {
  try {
    await cache.put(key, JSON.stringify(data), { expirationTtl });
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error);
  }
}

/**
 * Delete cached data
 * @param key - Cache key
 * @param cache - KVNamespace instance
 */
export async function deleteCached(key: string, cache: KVNamespace): Promise<void> {
  try {
    await cache.delete(key);
  } catch (error) {
    console.error(`Error deleting cache for key ${key}:`, error);
  }
}

