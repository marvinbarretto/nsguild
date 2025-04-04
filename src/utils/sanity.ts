import { createClient } from "@sanity/client";
import type { EventType, Post, Publication, Globals } from "./types";
import type { APIRoute } from "astro";
import type { Gallery, GalleryData, EquipmentType } from "../utils/types";
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
      "programmeUrl": programmeFile.asset->url,
      footerText
    }
  `;
  
  const globals = await getSanityData<Globals | null>(query);
  return globals;
}


export function formatGalleryImages(images: any[]) {
  return images.map((img) => ({
    url: img.asset?.url,
    thumbnailUrl: img.asset?.url + "?w=300&h=200&fit=crop&q=80&auto=format",
    lightboxUrl: img.asset?.url + "?w=1200&q=80&auto=format",
    altText: img.altText,
    caption: img.caption,
  }));
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

// Fetch the most recent gallery (for the main display)
// Make sure we get smaller images
export async function fetchLatestGallery(): Promise<GalleryData | null> {
  const query = `
    *[_type == "photoGallery"] | order(_createdAt desc)[0] {
      title,
      "images": images[]{
        "url": asset->url,
        "thumbnailUrl": asset->url + "?w=300&h=200&fit=crop&q=80&auto=format",
        "lightboxUrl": asset->url + "?w=1200&q=80&auto=format",
        altText,
        caption
      }
    }
  `;
  return await getSanityData<GalleryData | null>(query);
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


// Fetch images for a single gallery
export async function fetchGalleryBySlug(slug: string): Promise<GalleryData | null> {
  const query = `
    *[_type == "photoGallery" && slug.current == $slug][0] {
      title,
      "images": images[]{
        "url": asset->url,
        "thumbnailUrl": asset->url + "?w=300&h=200&fit=crop&q=80&auto=format",
        "lightboxUrl": asset->url + "?w=1200&q=70&auto=format"
      }
    }
  `;
  return await getSanityData<GalleryData | null>(query, { slug });
}


export async function fetchGalleryPage(): Promise<{
  title: string;
  images: { url: string }[];
}[]> {
  const query = `
    *[_type == "photoGallery"] {
      title,
      "images": images[].asset->{
        url
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
      "slug": slug.current, 
      publishedAt,
      snippet,
      body
    }
  `;
  return await getSanityData(query);
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
