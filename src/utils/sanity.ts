import { createClient } from "@sanity/client";
import type { Settings, EventType, GalleryImage, Post, Publication } from "./types";
import type { APIRoute } from "astro";

export const sanityClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: 'v2022-03-07',
    token: import.meta.env.SANITY_TOKEN,
})

// export async function getSanityData(query: string, params?: {}) {
//     return await sanityClient.fetch(query, params);
// }

export async function getSanityData<T>(query: string, params?: {}): Promise<T> {
  return await sanityClient.fetch<T>(query, params);
}

export async function fetchSettings(): Promise<Settings> {
  const query = `*[_type == "settings"][0]{
    siteTitle,
    siteDescription,
    ogImage{asset->{url}},
    headerLinks[]{title, href},
    footerLinks[]{title, href},
    footerText,
    welcomeWidget[]{
      _type == 'block' => { _type, children },
      _type == 'image' => { _type, asset->{url}, alt }
    }
  }`;
  return await getSanityData<Settings>(query);
}

export async function fetchAllPosts(): Promise<Post[]> {
  const query = `
    *[_type == "post"] | order(publishedAt desc) {
      title,
      slug,
      publishedAt,
      body,
      images[]{
        asset->{url},
        alt,
        caption
      }
    }
  `;
  return await getSanityData<Post[]>(query);
}

export async function fetchFeaturedPosts(): Promise<Post[]> {
  const query = `
    *[_type == "post" && featured == true] | order(publishedAt desc) {
      title,
      slug,
      image {
        asset -> { url }
      },
      file {
        asset -> { url }
      },
      body
    }
  `;
  return await getSanityData<Post[]>(query);
}

export async function fetchAllEvents(): Promise<Event[]> {
  const query = `
    *[_type == "event"] | order(date asc) {
      title,
      slug,
      date,
      description,
      "relatedGallery": relatedGallery->{
        title,
        slug
      }
    }
  `;
  return await getSanityData<Event[]>(query);
}

export async function fetchEventBySlug(slug: string): Promise<EventType | null> {
  const query = `
    *[_type == "event" && slug.current == $slug][0] {
      title,
      date,
      description,
      "relatedGallery": relatedGallery->{
        title,
        slug
      },
      images[]{
        "url": asset->url,
        caption
      }
    }
  `;
  return await getSanityData<EventType>(query, { slug });
}

export async function fetchAllPublications(): Promise<Publication[]> {
  const query = `
    *[_type == "publication"] | order(_createdAt desc) {
      _id,
      title,
      description,
      "documentUrl": document.asset->url,
    }
  `;
  return await getSanityData<Publication[]>(query);
}

// Transform gallery images (if needed for a gallery component)
export function transformImagesToGalleryFormat(images: Post["images"] = []): GalleryImage[] {
  return images.map((image) => ({
    url: image.asset.url,
    thumbnailUrl: image.asset.url,
    altText: image.alt || "Image",
    caption: image.caption || "",
  }));
}

// API Route
export const GET: APIRoute = async () => {
  try {
    const settings = await fetchSettings();
    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch settings" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
