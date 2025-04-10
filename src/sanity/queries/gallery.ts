import { getSanityData } from "../../utils/sanity";
import type { GalleryData, Gallery, GalleryImage } from "../../utils/types";



export async function getAllGalleryImages({ limit = 5, offset = 0 } = {}): Promise<GalleryImage[]> {
  const query = `
    *[_type == "photoGallery"] | order(_createdAt desc) {
      "images": images[]{ "url": asset->url }
    }
  `;

  const galleries = await getSanityData<{ images: GalleryImage[] }[]>(query);

  const allImages = galleries
    .flatMap((gallery) => gallery.images ?? [])
    .filter((img): img is GalleryImage => Boolean(img?.url)); // strong typing + cleanup

  return allImages.slice(offset, offset + limit);
}




// Fetch all galleries (for navigation)
export async function fetchGalleryList(): Promise<Gallery[]> {
  const query = `
    *[_type == "photoGallery" && defined(slug.current)] | order(_createdAt desc) {
      title,
      "slug": slug.current
    }
  `;
  return await getSanityData<Gallery[]>(query);
}


export async function fetchGalleryBySlug(slug: string): Promise<GalleryData | null> {
  const query = `
    *[_type == "photoGallery" && slug.current == $slug][0] {
      title,
      "images": images[]{ "url": asset->url }
    }
  `;
  return await getSanityData<Gallery | null>(query, { slug });
}

