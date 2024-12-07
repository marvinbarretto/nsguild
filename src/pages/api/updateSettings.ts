import { sanityClient } from '../../utils/sanity';

export async function post({ request }: { request: Request }) {
  const updates = await request.json();

  // Patch the "settings" document with the provided updates
  await sanityClient
    .patch('6926bf27-9102-4b82-a61b-326c50660da2') 
    .set(updates)
    .commit();

  return new Response(null, { status: 204 });
}
