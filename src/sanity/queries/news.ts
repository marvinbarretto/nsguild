
import { createClient } from "@sanity/client";
import { getSanityData, sanityClient } from "../../utils/sanity";
import type { Post } from "../../utils/types";
import type { PagesContent } from "../../utils/types";

export async function fetchLatestNews(): Promise<Post | null> {
    const query = `
      *[_type == "post"] | order(publishedAt desc)[0] {
        title,
        body,
        "slug": slug.current,
        publishedAt,
        mainImage {
          asset,
          alt
        }
      }
    `;
    return await getSanityData<Post | null>(query, {}, 'fetchLatestNews'); // ✅ This ensures we get a single object
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  if (!slug) {
    throw new Error("fetchPostBySlug was called without a slug");  // ✅ Debugging check
  }

  const query = `
    *[_type == "post" && slug.current == $slug][0] {
      title,
      publishedAt,
      "slug": slug.current,
      body,
      mainImage {
        asset,
        alt
      }
    }
  `;

  return await getSanityData<Post | null>(query, { slug });
}

export async function fetchAllPosts(): Promise<Post[]> {
    const query = `
      *[_type == "post"] | order(publishedAt desc) {
        title,
        "slug": slug.current,  // ✅ Extracts only the string value of slug
        publishedAt
      }
    `;
    return await getSanityData<Post[]>(query);
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
      body,
      moreDetail,
      mainImage {
        asset,
        alt
      }
    }
  `;

  return await getSanityData<Post[]>(posts, {}, 'fetchPostsPage');
}

/**
 * Latest posts for the design preview (/preview and /preview/news), with
 * unpublished drafts overlaid so the client can approve a post before it is
 * published. Reading drafts needs a Viewer token in SANITY_PREVIEW_TOKEN; with
 * none, this shows published posts only and says so in the logs.
 *
 * Deliberately not SANITY_TOKEN: the shared sanityClient is on an API version
 * whose default perspective is "raw", so giving it a token would put drafts
 * on every live page.
 */
export async function fetchNewsWithDrafts(limit: number): Promise<Post[]> {
  const token = import.meta.env.SANITY_PREVIEW_TOKEN;
  if (!token) console.warn("fetchNewsWithDrafts: no SANITY_PREVIEW_TOKEN, drafts not shown");

  // A brand-new draft may not have a slug yet, so anchor on the id instead.
  const query = `
    *[_type == "post"] | order(coalesce(publishedAt, _updatedAt) desc)[0...$limit] {
      title,
      body,
      moreDetail,
      "hasMoreDetail": defined(moreDetail),
      "slug": coalesce(slug.current, _id),
      "publishedAt": coalesce(publishedAt, _updatedAt),
      "isDraft": _originalId in path("drafts.**"),
      mainImage {
        asset,
        alt
      }
    }
  `;
  const client = token
    ? createClient({
        projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
        dataset: import.meta.env.PUBLIC_SANITY_DATASET,
        useCdn: false,
        apiVersion: "2025-01-28",
        token,
        perspective: "previewDrafts",
      })
    : sanityClient;
  return await client.fetch<Post[]>(query, { limit });
}

export async function fetchPagesContent(): Promise<PagesContent | null> {
  const query = `*[_type == "pagesContent"][0]`;
  return await getSanityData<PagesContent | null>(query, {}, 'fetchPagesContent');
}