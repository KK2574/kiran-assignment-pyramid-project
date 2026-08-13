// Tiny in-memory cache to deduplicate racing OAuth callback requests that
// carry the same (single-use) authorization code. Google's authorization
// endpoint can sometimes fire the redirect_uri more than once for a single
// user action (e.g. a silent `prompt=none` re-check alongside the real
// approval) — since a code can only be exchanged once, the second exchange
// legitimately fails on Google's side. Caching the first successful result
// by code lets a racing duplicate reuse it instead of showing a false
// "access denied" to a user who really did approve.
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
  // Opportunistic cleanup of old entries so this never grows unbounded.
  for (const [key, val] of cache) {
    if (Date.now() - val.timestamp >= TTL_MS) cache.delete(key);
  }
}
