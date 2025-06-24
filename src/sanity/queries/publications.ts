import { getSanityData } from "../../utils/sanity";
import type { Publication } from "../../utils/types";

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

export async function fetchLatestPublication(): Promise<Publication | null> {
    const query = `
      *[_type == "publication"] | order(_createdAt desc)[0] {
        _id,
        title,
        description,
        "documentUrl": document.asset->url
      }
    `;
    return await getSanityData<Publication>(query);
}

  export async function fetchArchivePublications(): Promise<Publication[]> {
    const query = `
      *[_type == "publication"] | order(_createdAt desc)[1..9999] {
        _id,
        title,
        description,
        "documentUrl": document.asset->url
      }
    `;
    return await getSanityData<Publication[]>(query);
}