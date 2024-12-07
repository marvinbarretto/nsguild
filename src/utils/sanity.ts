import { createClient } from "@sanity/client";

export const sanityClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: 'v2022-03-07'

})

export async function getSanityData(query: string, params?: {}) {
    return await sanityClient.fetch(query, params);
}

