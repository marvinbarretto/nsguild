import { getSanityData } from "../../utils/sanity";
import type { EventType } from "../../utils/types";


export async function fetchEventsPage(): Promise<EventType[]> {
    const query = `
      *[_type == "event"] | order(date desc) {
        _id,
        title,
        slug,
        date,
        description,
        "relatedGallery": relatedGallery->{
          title,
          slug
        }
      }
    `;
    return await getSanityData(query);
}
  
export async function fetchAllEvents(): Promise<EventType[]> {
  const query = `
    *[_type == "event"] | order(date asc) {
      title,
      "slug": slug.current,
      date,
      description,
      "imageUrl": image.asset->url
    }
  `;
  return await getSanityData<EventType[]>(query);
}

export async function fetchEventBySlug(slug: string): Promise<EventType | null> {
  const query = `
    *[_type == "event" && slug.current == $slug][0] {
      title,
      date,
      description,
      "imageUrl": image.asset->url
    }
  `;
  return await getSanityData<EventType | null>(query, { slug });
}
