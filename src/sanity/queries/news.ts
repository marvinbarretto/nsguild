
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
 * Latest posts for the design preview, with unpublished drafts overlaid so the
 * client can approve one before publishing. Reading drafts needs a token; with
 * none, this falls back to published posts only and says so in the logs.
 */
export async function fetchLatestNewsWithDrafts(limit = 3): Promise<Post[]> {
  const hasToken = Boolean(import.meta.env.SANITY_TOKEN);
  if (!hasToken) console.warn("fetchLatestNewsWithDrafts: no SANITY_TOKEN, drafts not shown");

  const query = `
    *[_type == "post"] | order(coalesce(publishedAt, _updatedAt) desc)[0...$limit] {
      title,
      body,
      moreDetail,
      "hasMoreDetail": defined(moreDetail),
      "slug": slug.current,
      "publishedAt": coalesce(publishedAt, _updatedAt),
      "isDraft": _originalId in path("drafts.**")
    }
  `;
  const client = hasToken ? sanityClient.withConfig({ perspective: "previewDrafts" }) : sanityClient;
  return await client.fetch<Post[]>(query, { limit });
}

export async function fetchPagesContent(): Promise<PagesContent | null> {
  const query = `*[_type == "pagesContent"][0]`;
  return await getSanityData<PagesContent | null>(query, {}, 'fetchPagesContent');
}