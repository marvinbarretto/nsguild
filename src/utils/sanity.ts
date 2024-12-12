import { createClient } from "@sanity/client";

export const sanityClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: 'v2022-03-07',
    token: import.meta.env.SANITY_TOKEN,

})

export async function getSanityData(query: string, params?: {}) {
    return await sanityClient.fetch(query, params);
}

export async function fetchFeaturedPosts() {
    return await sanityClient.fetch(`
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
    `);
  }
  