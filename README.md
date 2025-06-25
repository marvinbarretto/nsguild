# Norfolk & Suffolk Guild Website

## Stack
- Astro 5 (SSG)
- Vue 3 (islands)
- Sanity CMS + embedded studio
- TypeScript, SCSS
- Vercel deployment

## Notable bits
- Vue infinite scroll gallery with intersection observer
- Vue components for the lightbox and gallery stuff
- Embedded Sanity studio at `/studio`
- Contact form with Web3Forms
- Google Analytics with cookie opt-out
- Custom cache layer for globals (`/src/utils/cache.ts`)

## Setup

```bash
npm install
```

Create `.env`:
```bash
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_with_write_access
WEB3FORMS_ACCESS_KEY=your_web3forms_key
```

```bash
npm run dev  # localhost:4321
```

## Deployment

Vercel auto-deploys on push. Studio deploys with the app at `/studio`.

## Releases

```bash
npm run release
git push --follow-tags origin master
```

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build  
npm run release      # Version bump + changelog
```