import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  
  // Add caching headers for all pages (except API routes)
  if (!context.url.pathname.startsWith('/api/')) {
    response.headers.set(
      'Cache-Control', 
      'public, s-maxage=300, stale-while-revalidate=600'
    );
  }
  
  return response;
});