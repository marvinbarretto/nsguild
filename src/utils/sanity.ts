import { createClient } from "@sanity/client";
import type { Globals } from "./types";
import type { APIRoute } from "astro";
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
