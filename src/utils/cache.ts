import type { Globals } from './types';
import { fetchGlobals } from './sanity';

let globalsCache: Globals | null = null;

export async function getCachedGlobals(): Promise<Globals | null> {
  if (!globalsCache) {
    console.log('Fetching globals from Sanity (cache miss)');
    globalsCache = await fetchGlobals();
  } else {
    console.log('Using cached globals (cache hit)');
  }
  return globalsCache;
}

// Optional: Add cache invalidation for development
export function clearGlobalsCache() {
  globalsCache = null;
}