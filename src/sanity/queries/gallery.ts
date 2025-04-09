import { getSanityData, formatGalleryImages } from "../../utils/sanity";
import type { GalleryData, Gallery } from "../../utils/types";

// Fetch the most recent gallery (for the main display)
export async function fetchLatestGallery(): Promise<GalleryData | null> {
  const query = `
    *[_type == "photoGallery"] | order(_createdAt desc)[0] {
      title,
      images
    }
  `;
  const data = await getSanityData<GalleryData | null>(query);
  if (!data) return null;
  return { ...data, images: formatGalleryImages(data.images) };
}

export async function getAllGalleryImages({ limit = 5, offset = 0 } = {}) {
  const query = `
    *[_type == "photoGallery"] | order(_createdAt desc) {
      images[]{
        asset->{
          _id,
          url
        }
      }
    }
  `;

  const galleries = await getSanityData(query);

  // Flatten all images from all galleries

  // TODO: Fix these any's
  const allImages = (galleries as any)
    .flatMap((gallery: any) => gallery.images ?? [])
    .filter((img: any) => img?.asset?.url); // optional: filter out broken refs

  // Apply pagination here
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

// Fetch a specific gallery by slug
export async function fetchGalleryBySlug(slug: string): Promise<GalleryData | null> {
  const query = `
    *[_type == "photoGallery" && slug.current == $slug][0] {
      title,
      "images": images[]{
        "asset": asset->{
          _id,
          url
        }
      }
    }
  `;
  const data = await getSanityData<GalleryData | null>(query, { slug });
  if (!data) return null;
  return { ...data, images: formatGalleryImages(data.images) };
}

// Fetch all galleries with images (for gallery page)
export async function fetchGalleryPage(): Promise<GalleryData[]> {
  const query = `
    *[_type == "photoGallery"] {
      title,
      images
    }
  `;
  const data = await getSanityData<GalleryData[]>(query);
  return data.map((gallery) => ({
    ...gallery,
    images: formatGalleryImages(gallery.images),
  }));
}
