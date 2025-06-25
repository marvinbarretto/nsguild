import { getSanityData } from "../../utils/sanity";
import type { EventType } from "../../utils/types";


export async function fetchEventsPage(): Promise<EventType[]> {
    const query = `
      *[_type == "event"] | order(date desc) {
        _id,
        title,
        "slug": slug.current,
        date,
        description,
        "relatedGallery": relatedGallery->{
          title,
          "slug": slug.current
        }
      }
    `;
    return await getSanityData(query, {}, 'fetchEventsPage');
}
  
export async function fetchAllEvents(): Promise<EventType[]> {
  const query = `
    *[_type == "event"] | order(date asc) {
      title,
      "slug": slug.current,
      date,
      description,
      "imageUrl": image.asset->url,
      "relatedGallery": *[_type == "photoGallery" && relatedEvent._ref == ^._id][0]{
        title,
        "slug": slug.current
      }
    }
  `;
  return await getSanityData<EventType[]>(query, {}, 'fetchAllEvents');
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

export async function fetchNextEvent(): Promise<EventType | null> {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const query = `
    *[_type == "event" && date >= $today] | order(date asc)[0] {
      title,
      "slug": slug.current,
      date,
      description
    }
  `;

  return await getSanityData<EventType | null>(query, { today }, 'fetchNextEvent');
}



// TODO: Handle todays event