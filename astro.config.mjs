// @ts-check
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import { loadEnv } from 'vite';

import vue from '@astrojs/vue';

const { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } = loadEnv(
  process.env.NODE_ENV || 'production', 
  process.cwd(),
  ""
);

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [sanity({
    projectId: PUBLIC_SANITY_PROJECT_ID,
    dataset: PUBLIC_SANITY_DATASET,
    useCdn: false,
    apiVersion: "2025-01-28",
    studioBasePath: '/studio',
    stega: {
      studioUrl: '/studio'
    }
  }), react(), vue()]
});