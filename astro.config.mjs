// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
    output: 'server', // TODO: check..
    integrations: [
        tailwind(),
        vue(),
        sanity({
            projectId: "8cxh2o2e",
            dataset: "production",
            useCdn: false, // for static builds      
        })
    ],
});