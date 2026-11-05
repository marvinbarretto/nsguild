// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from 'astro-sitemap';
import sanity from '@sanity/astro';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import { loadEnv } from 'vite';

const { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } = loadEnv(
  process.env.NODE_ENV || 'production', 
  process.cwd(),
  ""
);

// ✅ Regular sync config
export default defineConfig({
  site: 'https://norfolksuffolkwsd.org.uk',
  output: 'server',
  // Cloudflare Pages since 5 Nov 2026: Vercel's free plan paused the team on 3 Nov.
  adapter: cloudflare(),
  integrations: [
    sitemap(),
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false,
      apiVersion: "2025-01-28",
      studioBasePath: '/studio',
      stega: {
        studioUrl: '/studio'
      }
    }),
    react(),
    vue()
  ]
});