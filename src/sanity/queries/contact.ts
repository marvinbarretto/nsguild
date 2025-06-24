import { getSanityData } from "../../utils/sanity";

export async function fetchContactPage(): Promise<{
    _id: string;
    title: string;
    description: string;
    email: string;
    address: string;
  }> {
    const query = `
      *[_type == "contact" && _id == "contact"][0]{
        _id,
        title,
        description,
        email,
        address
      }
    `;
    return await getSanityData(query);
  }