import { getAllGalleryImages } from '../../sanity/queries/gallery';

// Make this API route dynamic while keeping the rest of the site static
export const prerender = false;

export async function GET({ url }: { url: URL }) {
  console.log('🌐 API /gallery called with URL:', url.toString());
  console.log('🔍 Full URL href:', url.href);
  console.log('🔍 Search params string:', url.searchParams.toString());
  console.log('🔍 All search params:');
  for (const [key, value] of url.searchParams.entries()) {
    console.log(`  ${key}: ${value}`);
  }
  
  const pageParam = url.searchParams.get('page');
  const limitParam = url.searchParams.get('limit');
  console.log('🔍 Raw page param:', pageParam, '(type:', typeof pageParam, ')');
  console.log('🔍 Raw limit param:', limitParam, '(type:', typeof limitParam, ')');
  
  const page = Number(pageParam || '1');
  const limit = Number(limitParam || '5');
  console.log('📥 Parsed params:', { page, limit });
  
  // Handle invalid parameters with defaults
  const validPage = isNaN(page) || page < 1 ? 1 : page;
  const validLimit = isNaN(limit) || limit < 1 ? 5 : limit;
  console.log('✅ Valid params:', { validPage, validLimit });

  const offset = (validPage - 1) * validLimit;
  console.log('🧮 Calculated offset:', offset);

  const images = await getAllGalleryImages({ limit: validLimit, offset });
  console.log('📤 API returning', images.length, 'images');

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
