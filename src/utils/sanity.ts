import { createClient } from "@sanity/client";
import type { Homepage, EventType, GalleryImage, Post, Publication, Globals, Gallery } from "./types";
import type { APIRoute } from "astro";

export const sanityClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: 'v2022-03-07',
    token: import.meta.env.SANITY_TOKEN,
})

export async function getSanityData<T>(query: string, params?: {}): Promise<T> {
  return await sanityClient.fetch<T>(query, params);
}

export async function fetchGlobals(): Promise<Globals | null> {
  const query = `
    *[_type == "globals" && _id == "globals"][0]{
      siteTitle,
      footerText
    }
  `;
  
  const globals = await getSanityData<Globals | null>(query);
  return globals;
}

export async function fetchHomepage(): Promise<Homepage | null> {
  const query = `
    *[_type == "homepage" && _id == "homepage"][0]{
      _id,
      homepageImage{
        asset->{
          url
        }
      },
      welcomeWidget[]{
        _type,
        ...select(
          _type == 'block' => { 
            children[]{
              text,
              marks
            }
          },
          _type == 'image' => { 
            asset->{ url }, 
            alt 
          }
        )
      }
    }
  `;
  return await getSanityData(query);
}

export async function fetchContactPage(): Promise<{
  _id: string;
  title: string;
  description: string;
  email: string;
  address: string;
}> {
  const query = `
    *[_type == "contact" && _id == "contact"][0]{
      _id,
      title,
      description,
      email,
      address
    }
  `;
  return await getSanityData(query);
}

export async function fetchEventsPage(): Promise<EventType[]> {
  const query = `
    *[_type == "event"] | order(date asc) {
      _id,
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
  return await getSanityData(query);
}

export async function fetchAllPosts(): Promise<Post[]> {
  const query = `
    *[_type == "post"] | order(publishedAt desc) {
      title,
      slug,
      publishedAt,
      body,
      attachPublication,
      attachedPublication->{
        _id,
        title,
        "documentUrl": document.asset->url
      },
      images[]{
        "asset": {"url": asset->url},
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

export async function fetchAllEvents(): Promise<EventType[]> {
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
  return await getSanityData<EventType[]>(query);
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

export async function fetchGalleryBySlug(slug: string): Promise<Gallery | null> {
  const query = `
    *[_type == "gallery" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      images[]{
        "thumbnailUrl": asset->url + "?w=200&h=200&fit=crop",
        "url": asset->url,
        altText,
        caption
      }
    }
  `;
  return await getSanityData(query, { slug });
}

export async function fetchGalleryPage(): Promise<{
  title: string;
  slug: { current: string };
  images: {
    thumbnailUrl: string;
    url: string;
    altText?: string;
    caption?: string;
  }[];
}[]> {
  const query = `
    *[_type == "post" && defined(images)]{
      title,
      slug,
      images[]{
        "thumbnailUrl": asset->url + "?w=200&h=200&fit=crop",
        "url": asset->url,
        altText,
        caption
      }
    }
  `;
  return await getSanityData(query);
}

export async function fetchPostsPage(): Promise<Post[]> {
  const query = `
    *[_type == "post" && defined(slug.current)]
    | order(publishedAt desc)[0...12]{
      _id, 
      title, 
      slug, 
      publishedAt
    }
  `;
  return await getSanityData(query);
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
    const homepage = await fetchHomepage();
    return new Response(JSON.stringify(homepage), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching homepage:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch homepage" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
