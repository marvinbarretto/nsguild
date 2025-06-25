import { getSanityData } from "../../utils/sanity";
import type { MetaDescriptions } from "../../utils/types";

export async function fetchMetaDescriptions(): Promise<MetaDescriptions | null> {
    const query = `
      *[_type == "globals" && _id == "globals"][0].metaDescriptions
    `;
    return await getSanityData<MetaDescriptions | null>(query);
}