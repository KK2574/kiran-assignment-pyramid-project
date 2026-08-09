interface CachedAuth {
  user: any;
  timestamp: number;
}

const cache = new Map<string, CachedAuth>();
const TTL_MS = 60_000;

export function getCachedAuth(code: string): CachedAuth | undefined {
  const entry = cache.get(code);
  if (entry && Date.now() - entry.timestamp < TTL_MS) return entry;
  if (entry) cache.delete(code);
  return undefined;
}

export function setCachedAuth(code: string, user: any): void {
  cache.set(code, { user, timestamp: Date.now() });
  for (const [key, val] of cache) {
    if (Date.now() - val.timestamp >= TTL_MS) cache.delete(key);
  }
}