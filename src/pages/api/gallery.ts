import { getAllGalleryImages } from '../../sanity/queries/gallery';

// Make this API route dynamic while keeping the rest of the site static
export const prerender = false;

export async function GET({ url }: { url: URL }) {
  const page = Number(url.searchParams.get('page') || '1');
  const limit = Number(url.searchParams.get('limit') || '5');

  // Handle invalid parameters with defaults
  const validPage = isNaN(page) || page < 1 ? 1 : page;
  const validLimit = isNaN(limit) || limit < 1 ? 5 : limit;

  const offset = (validPage - 1) * validLimit;

  const images = await getAllGalleryImages({ limit: validLimit, offset });

  return new Response(JSON.stringify(images), { 
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Content-Type': 'application/json'
    }
  });
}
