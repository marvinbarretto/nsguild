// @ts-check
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    output: 'server', // TODO: check..
    integrations: [
        tailwind(),
        sanity({
            projectId: "8cxh2o2e",
            dataset: "production",
            useCdn: false, // for static builds      
        })
    ],
});