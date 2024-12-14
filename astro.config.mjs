// @ts-check
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: vercel(),
    integrations: [
        sanity({
            projectId: "8cxh2o2e",
            dataset: "production",
            useCdn: false, // for static builds
        })
    ],
});