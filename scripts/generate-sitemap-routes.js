import { loadEnv } from 'vite';
import { createClient } from "@sanity/client";
import { writeFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
const env = loadEnv('production', process.cwd(), "");

const client = createClient({
    projectId: env.PUBLIC_SANITY_PROJECT_ID,
    dataset: env.PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: '2022-03-07',
    token: env.SANITY_TOKEN,
});

async function generateSitemapRoutes() {
    try {
        console.log('Generating sitemap routes...');
        
        const [news, events, albums, equipment] = await Promise.all([
            client.fetch(`*[_type == "news" && defined(slug.current)]{ "slug": slug.current }`),
            client.fetch(`*[_type == "event" && defined(slug.current)]{ "slug": slug.current }`),
            client.fetch(`*[_type == "album" && defined(slug.current)]{ "slug": slug.current }`),
            client.fetch(`*[_type == "equipment" && defined(slug.current)]{ "slug": slug.current }`),
        ]);

        const dynamicRoutes = [
            ...news.map((item) => `/news/${item.slug}`),
            ...events.map((item) => `/events/${item.slug}`),
            ...albums.map((item) => `/gallery/albums/${item.slug}`),
            ...equipment.map((item) => `/equipment/${item.slug}`),
        ];

        const staticRoutes = [
            '/',
            '/news',
            '/events',
            '/gallery',
            '/gallery/albums',
            '/publications',
            '/equipment',
            '/contact'
        ];

        const allRoutes = [...staticRoutes, ...dynamicRoutes];

        // Write to a JSON file
        const outputPath = join(process.cwd(), 'scripts', 'sitemap-routes.json');
        writeFileSync(outputPath, JSON.stringify(allRoutes, null, 2));
        
        console.log(`Generated ${allRoutes.length} routes (${staticRoutes.length} static + ${dynamicRoutes.length} dynamic)`);
        
    } catch (error) {
        console.error('Error generating sitemap routes:', error);
        process.exit(1);
    }
}

generateSitemapRoutes();