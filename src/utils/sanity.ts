import { createClient } from "@sanity/client";
import type { EventType, Post, Publication, Globals, GalleryImage } from "./types";
import type { APIRoute } from "astro";
import type { Gallery, GalleryData, EquipmentType, PagesContent } from "../utils/types";
import { fetchHomepage } from "../sanity/queries/homepage";


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
      description,
      keywords,
      "programmeUrl": programmeFile.asset->url,
      footerText
    }
  `;
  
  const globals = await getSanityData<Globals | null>(query);
  return globals;
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


export async function fetchAllPosts(): Promise<Post[]> {
  const query = `
    *[_type == "post"] | order(publishedAt desc) {
      title,
      "slug": slug.current,
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
      "slug": slug.current,
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

export async function fetchPostsPage(): Promise<Post[]> {
  const posts = `
    *[_type == "post" && defined(slug.current)]
    | order(publishedAt desc)[0...12]{
      _id, 
      title, 
      "slug": slug.current, 
      publishedAt,
      snippet,
      body
    }
  `;

  return await getSanityData<Post[]>(posts);
}

export async function fetchPagesContent(): Promise<PagesContent | null> {
  const query = `*[_type == "pagesContent"][0]`;
  return await getSanityData<PagesContent | null>(query);
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
