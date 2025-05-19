import { getSanityData } from "../../utils/sanity";
import type { Homepage } from "../../utils/types";
import type { Banner } from "../../utils/types";

export async function fetchHomepage(): Promise<Homepage> {
  const query = `
    *[_type == "homepage"][0] {
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
    }
  `;
  const data = await getSanityData<Homepage | null>(query);
  if (!data) throw new Error("Sanity: Homepage not found");
  return data;
}

export async function fetchBanner(): Promise<Banner> {
  const query = `
    *[_type == "banner"][0] {
      message,
      isActive,
      link
    }
  `;
  const data = await getSanityData<Banner | null>(query);
  if (!data) throw new Error("Sanity: Banner not found");
  return data;
}