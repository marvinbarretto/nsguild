import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  
  // The design preview is for checking Studio edits (drafts included), so it
  // always renders fresh rather than lagging up to 15 minutes behind.
  if (context.url.pathname.startsWith('/preview')) {
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }

  // Add caching headers for all pages (except API routes). Short, so a
  // published Studio change shows within about two minutes.
  if (!context.url.pathname.startsWith('/api/')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=60'
    );
  }
  
  return response;
});