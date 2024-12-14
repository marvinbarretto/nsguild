// @ts-check
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
    output: 'server', 
    integrations: [
        sanity({
            projectId: "8cxh2o2e",
            dataset: "production",
            useCdn: false, // for static builds
        })
    ],
});