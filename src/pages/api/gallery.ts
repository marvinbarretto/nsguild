import { getAllGalleryImages } from '../../sanity/queries/gallery';

export async function GET({ url }: { url: URL }) {
  const page = Number(url.searchParams.get('page') || '1');
  const limit = Number(url.searchParams.get('limit') || '5'); // 👈 smaller batch

  const offset = (page - 1) * limit;

  const images = await getAllGalleryImages({ limit, offset });

  return new Response(JSON.stringify(images), { status: 200 });
}
