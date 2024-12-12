import type { APIRoute } from "astro";
import { sanityClient } from '../../utils/sanity';


type Settings = {
  siteTitle: string;
  siteDescription: string;
  ogImage?: { asset: { url: string } };
  headerLinks?: { title: string; href: string }[];
  footerLinks?: { title: string; href: string }[];
  footerText?: string;
  welcomeWidget?: (RichTextBlock | ImageBlock)[];
};

export type RichTextBlock = {
  _type: 'block';
  children: { text: string }[];
};

export type ImageBlock = {
  _type: 'image';
  asset: { url: string };
  alt?: string;
};

// Utility to fetch settings (can be reused in Astro pages)
export async function fetchSettings(): Promise<Settings> {
  const query = `*[_type == "settings"][0]{
    siteTitle,
    siteDescription,
    ogImage{asset->{url}},
    headerLinks[]{title, href},
    footerLinks[]{title, href},
    footerText,
    welcomeWidget[]{
      _type == 'block' => { _type, children },
      _type == 'image' => { _type, asset->{url}, alt }
    }
  }`;
  const settings = await sanityClient.fetch<Settings>(query);
  if (!settings) {
    throw new Error("No settings found");
  }
  return settings;
}

// API Route
export const GET: APIRoute = async () => {
  try {
    const settings = await fetchSettings();
    return new Response(JSON.stringify(settings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch settings" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

