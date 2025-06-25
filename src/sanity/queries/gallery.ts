import { getSanityData } from "../../utils/sanity";
import type { GalleryData, Gallery, GalleryImage } from "../../utils/types";

export async function getAllGalleryImages({ limit = 5, offset = 0 } = {}): Promise<GalleryImage[]> {
  console.log('🔍 getAllGalleryImages called with:', { limit, offset });
  
  // Simple GROQ query - get all images first, then slice in JS
  const query = `*[_type == "photoGallery"].images[defined(asset)] | order(asset->_createdAt desc) {
    "thumb": asset->url + "?w=400&auto=format",
    "thumb2x": asset->url + "?w=800&auto=format", 
    "full": asset->url + "?w=1600&auto=format",
    "_createdAt": asset->_createdAt
  }`;

  console.log('📋 GROQ query:', query);
  const allImages = await getSanityData<GalleryImage[]>(query, {}, `getAllGalleryImages(offset:${offset}, limit:${limit})`);
  console.log('📦 Raw Sanity response length:', allImages.length);
  
  // Check if offset exceeds available images
  if (offset >= allImages.length) {
    console.log('🏁 Offset', offset, 'exceeds available images', allImages.length, '- returning empty array');
    return [];
  }
  
  // Do pagination in JavaScript with proper bounds
  const paginatedImages = allImages.slice(offset, offset + limit);
  console.log('✂️ After JS pagination:', { 
    offset, 
    limit, 
    totalAvailable: allImages.length,
    requestedRange: `${offset}-${offset + limit - 1}`,
    actualRange: `${offset}-${Math.min(offset + paginatedImages.length - 1, allImages.length - 1)}`,
    resultLength: paginatedImages.length 
  });

  const filteredImages = paginatedImages.filter((img): img is GalleryImage => Boolean(img?.thumb && img?.full));
  console.log('🎯 Final result length:', filteredImages.length);
  return filteredImages;
}

// Fetch all galleries (for navigation)
export async function fetchGalleryList(): Promise<Gallery[]> {
  const query = `
    *[_type == "photoGallery" && defined(slug.current)] | order(_createdAt desc) {
      title,
      "slug": slug.current
    }
  `;
  return await getSanityData<Gallery[]>(query, {}, 'fetchGalleryList');
}


export async function fetchGalleryBySlug(slug: string): Promise<GalleryData | null> {
  const query = `
    *[_type == "photoGallery" && slug.current == $slug][0] {
      title,
      "images": images[]{
        "thumb": asset->url + "?w=400&auto=format",
        "thumb2x": asset->url + "?w=800&auto=format",
        "full": asset->url + "?w=1600&auto=format"
      }
    }
  `;
  return await getSanityData<Gallery | null>(query, { slug }, 'fetchGalleryBySlug');
}

export function formatGalleryImages(images: any[]): GalleryImage[] {
  return images
    .map((img) => {
      const baseUrl = img.asset?.url;
      if (!baseUrl) return null;

      return {
        thumb: baseUrl + '?w=400&auto=format',
        thumb2x: baseUrl + '?w=800&auto=format',
        full: baseUrl + '?w=1600&auto=format',
      };
    })
    .filter(Boolean) as GalleryImage[];
}
