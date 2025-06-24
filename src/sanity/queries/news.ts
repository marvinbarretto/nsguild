
import { getSanityData } from "../../utils/sanity";
import type { Post } from "../../utils/types";
import type { PagesContent } from "../../utils/types";

export async function fetchLatestNews(): Promise<Post | null> {
    const query = `
      *[_type == "post"] | order(publishedAt desc)[0] {
        title,
        body,
        "slug": slug.current,
        publishedAt
      }
    `;
    return await getSanityData<Post | null>(query); // ✅ This ensures we get a single object
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
      body
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
      body
    }
  `;

  return await getSanityData<Post[]>(posts);
}

export async function fetchPagesContent(): Promise<PagesContent | null> {
  const query = `*[_type == "pagesContent"][0]`;
  return await getSanityData<PagesContent | null>(query);
}