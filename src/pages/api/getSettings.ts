import type { APIRoute } from "astro";
import { sanityClient } from '../../utils/sanity';

type Settings = {
  siteTitle: string;
  siteDescription: string;
  ogImage: { asset: { url: string } };
  headerLinks: { title: string; href: string }[];
  footerLinks: { title: string; href: string }[];
  footerText: string;
};

export const GET: APIRoute = async () => {
  try {
    console.log("API Route /api/getSettings called");
    const settings: Settings | null = await sanityClient.fetch(`*[_type == "settings"][0]`);
    if (!settings) {
      throw new Error("No settings found");
    }
    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching settings from Sanity:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch settings" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
