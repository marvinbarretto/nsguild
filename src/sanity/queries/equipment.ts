import { getSanityData } from "../../utils/sanity";
import type { EquipmentType } from "../../utils/types";

export async function fetchAllEquipment(): Promise<EquipmentType[]> {
    const query = `
      *[_type == "equipment"] | order(_createdAt desc) {
        title,
        "slug": slug.current,
        category,
        description,
        "images": coalesce(images[].asset->{url}, []),  // ✅ Always return an array
  
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
        "image": image.asset->{url},
      }
    `;
    return await getSanityData<EquipmentType | null>(query, { slug });
  }