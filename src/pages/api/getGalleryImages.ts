import type { APIRoute } from "astro";
import { sanityClient } from '../../utils/sanity';


type GalleryImage = {
    url: string;
    altText: string;
    caption?: string;
};

// Create a standalone function to fetch gallery images
export const fetchGalleryImages = async (): Promise<GalleryImage[]> => {
    const galleryDocuments = await sanityClient.fetch(`
      *[_type == "gallery"]{
        images[]{
          "url": asset->url,
          altText,
          caption
        }
      }
    `);
    return galleryDocuments.flatMap((doc: any) => doc.images); // Flatten nested images
  };

// Define the API route for HTTP requests
export const GET = async () => {
    try {
      const galleryImages = await fetchGalleryImages();
      return new Response(JSON.stringify(galleryImages), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch gallery images" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  };