import { getSanityData } from "../../utils/sanity";
import type { EquipmentType } from "../../utils/types";

export async function fetchAllEquipment(): Promise<EquipmentType[]> {
    const query = `
      *[_type == "equipment"] | order(_createdAt desc) {
        title,
        "slug": slug.current,
        category,
        description,
        "images": images[]{
          "thumb": asset->url + "?w=400&auto=format",
          "thumb2x": asset->url + "?w=800&auto=format",
          "full": asset->url + "?w=1600&auto=format"
        },
        "documentUrl": document.asset->url
      }
    `;
    return await getSanityData<EquipmentType[]>(query);  
  }
  
  
  export async function fetchEquipmentBySlug(slug: string): Promise<EquipmentType | null> {
    const query = `
      *[_type == "equipment" && slug.current == $slug][0] {
        title,
        category,
        description,
        "image": {
          "thumb": image.asset->url + "?w=400&auto=format",
          "thumb2x": image.asset->url + "?w=800&auto=format",
          "full": image.asset->url + "?w=1600&auto=format"
        },
      }
    `;
    return await getSanityData<EquipmentType | null>(query, { slug });
  }