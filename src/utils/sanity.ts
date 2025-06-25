import { createClient } from "@sanity/client";
import type { Globals, PagesContent } from "./types";
import type { APIRoute } from "astro";
import { fetchHomepage } from "../sanity/queries/homepage";

export const sanityClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: 'v2022-03-07',
    token: import.meta.env.SANITY_TOKEN,
})

// Global counter to track API requests
let apiCallCounter = 0;

export async function getSanityData<T>(query: string, params?: {}, label?: string): Promise<T> {
  apiCallCounter++;
  const startTime = Date.now();
  
  console.log(`🔥 [Sanity API Hit #${apiCallCounter}] ${label || 'Unknown query'}`);
  console.log(`📋 Query: ${query.replace(/\s+/g, ' ').slice(0, 150)}${query.length > 150 ? '...' : ''}`);
  console.log(`📊 Params:`, params || 'none');
  
  const result = await sanityClient.fetch<T>(query, params);
  const duration = Date.now() - startTime;
  
  console.log(`✅ [Sanity API Hit #${apiCallCounter}] Completed in ${duration}ms`);
  console.log(`📦 Response size: ${JSON.stringify(result).length} characters`);
  console.log(`📈 Total API calls so far: ${apiCallCounter}`);
  console.log('━'.repeat(60));
  
  return result;
}

// Function to get API call statistics
export function getSanityApiStats() {
  console.log('━'.repeat(80));
  console.log(`🎯 BUILD SUMMARY: Total Sanity API calls made: ${apiCallCounter}`);
  console.log('━'.repeat(80));
  return {
    totalCalls: apiCallCounter,
    message: `🎯 Build completed with ${apiCallCounter} Sanity API calls`
  };
}

export async function fetchGlobals(): Promise<Globals | null> {
  const query = `{
    "globals": *[_type == "globals" && _id == "globals"][0]{
      description,
      "programmeUrl": programmeFile.asset->url,
      footerText,
      metaDescriptions
    },
    "pagesContent": *[_type == "pagesContent"][0]
  }`;
  
  const result = await getSanityData<{globals: Globals, pagesContent: PagesContent} | null>(query, {}, 'fetchGlobals (with pagesContent)');
  
  if (!result) return null;
  
  // Merge pagesContent into globals
  return {
    ...result.globals,
    pagesContent: result.pagesContent
  };
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
