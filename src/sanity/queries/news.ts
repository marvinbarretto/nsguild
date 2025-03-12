
import { getSanityData } from "../../utils/sanity";
import type { Post } from "../../utils/types";

export async function fetchLatestNews(): Promise<Post | null> {
    const query = `
      *[_type == "post"] | order(publishedAt desc)[0] {
        title,
        "slug": slug.current,
        publishedAt
      }
    `;
    return await getSanityData<Post | null>(query); // ✅ This ensures we get a single object
}