import { getSanityData } from "../../utils/sanity";
import type { Homepage, EventType, Post, Globals } from "../../utils/types";

export interface HomepageData {
  homepage: Homepage;
  globals: Globals | null;
  nextEvent: EventType | null;
  latestNews: Post | null;
}

export async function fetchHomepageData(): Promise<HomepageData> {
  // Get today's date for the next event query
  const today = new Date().toISOString().split("T")[0];

  const query = `{
    "homepage": *[_type == "homepage"][0] {
      banner {
        isActive,
        message,
        link
      },
      carouselImages[]{
        "asset": asset->{
          _id,
          url
        }
      },
      whoWeAre,
      whatWeDo,
      whenWeMeet,
      whereWeMeet,
      description
    },
    "globals": *[_type == "globals" && _id == "globals"][0]{
      description,
      "programmeUrl": programmeFile.asset->url,
      footerText,
      metaDescriptions
    },
    "nextEvent": *[_type == "event" && date >= $today] | order(date asc)[0] {
      title,
      "slug": slug.current,
      date,
      description
    },
    "latestNews": *[_type == "post"] | order(publishedAt desc)[0] {
      title,
      body,
      "slug": slug.current,
      publishedAt
    }
  }`;

  const data = await getSanityData<HomepageData>(query, { today }, 'fetchHomepageData (consolidated)');
  
  if (!data.homepage) {
    throw new Error("Sanity: Homepage not found");
  }
  
  return data;
}