import { getSanityData } from "../../utils/sanity";
import type { Homepage } from "../../utils/types";
import type { Banner } from "../../utils/types";
export async function fetchHomepage(): Promise<Homepage | null> {
    const query = `
      *[_type == "homepage"][0] {
        homepageImage {
          asset->{ url }
        },
        welcomeWidget,
        banner {
          isActive,
          message,
          link
        }
      }
    `;
    return await getSanityData<Homepage | null>(query);
}

export async function fetchBanner(): Promise<Banner | null> {
    const query = `
      *[_type == "banner"][0] {
        message,
        isActive,
        link
      }
    `;
    return await getSanityData(query);
  }