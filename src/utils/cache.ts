import type { Globals } from './types';
import { fetchGlobals } from './sanity';

let globalsCache: Globals | null = null;

export async function getCachedGlobals(): Promise<Globals | null> {
  if (!globalsCache) {
    globalsCache = await fetchGlobals();
  }
  return globalsCache;
}

// Optional: Add cache invalidation for development
export function clearGlobalsCache() {
  globalsCache = null;
}
