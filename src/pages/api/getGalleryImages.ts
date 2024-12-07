import type { APIRoute } from "astro";
import { sanityClient } from '../../utils/sanity';

type GalleryDocument = {
  _id: string;
  title: string;
  slug: string; // Add slug property
  images: {
    url: string;
    thumbnailUrl: string;
    altText?: string;
    caption?: string;
  }[];
  _createdAt: string; // For sorting by creation date
};

type GalleryImage = {
  url: string;
  altText: string; // Standard alt text applied if not provided
  caption?: string;
};

export const fetchAllGalleryDocuments = async (): Promise<GalleryDocument[]> => {
  const query = `
    *[_type == "gallery"] | order(_createdAt desc){
      _id,
      title,
      "slug": slug.current,
      images[]{
        "url": asset->url,
        "thumbnailUrl": asset->url + "?w=200&h=200&fit=crop",
        altText,
        caption
      },
      _createdAt
    }
  `;
  return await sanityClient.fetch(query);
};



// API route to fetch galleries (optional)
export const GET = async () => {
  try {
    const galleries = await fetchAllGalleryDocuments();
    return new Response(JSON.stringify(galleries), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching gallery documents:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch galleries" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
