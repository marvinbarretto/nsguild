# Norfolk & Suffolk Guild Website

[![Tests](https://github.com/marvinbarretto/nsguild/actions/workflows/test.yml/badge.svg)](https://github.com/marvinbarretto/nsguild/actions/workflows/test.yml)
![Last Commit](https://img.shields.io/github/last-commit/marvinbarretto/nsguild)

![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-blueviolet)
![CMS: Sanity](https://img.shields.io/badge/CMS-Sanity-orange)
[![Vercel](https://vercelbadge.vercel.app/api/marvinbarretto/nsguild)](https://vercel.com/marvinbarrettos-projects/nsguild)

## Stack
- Astro 5 (SSG)
- Vue 3 (islands)
- Sanity CMS + embedded studio
- TypeScript, SCSS
- Vitest
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
npm run build        # Run tests + production build  
npm run release      # Version bump + changelog
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Open test UI
npm run test:coverage # Run tests with coverage
```

### Running Tests
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode for development
npm run test:ui         # Visual test runner
npm run test:coverage   # Generate coverage report
```

### Test Structure
- **Gallery Query Tests**: Pagination logic and Sanity data handling
- **API Route Tests**: Parameter validation and response formatting
- **Vue Component Tests**: Component behavior and interactions

### Pre-deployment Testing
Tests automatically run before every deployment:
- **Local builds**: `npm run build` runs tests first
- **GitHub Actions**: Tests run on every push/PR
- **Vercel deployment**: Only deploys if tests pass

**Test Coverage**: Gallery pagination, API endpoints, and component logic to prevent regressions.

## Understanding Sanity API Usage & Tracking

### How It Works (Static Site Generation)
- **During Build (`npm run build`)**: ✅ All Sanity API calls happen here, pages pre-rendered
- **During Dev (`npm run dev`)**: ✅ API calls when pages load/rebuild 
- **When Users Visit**: ❌ No API calls - they get static HTML

### Monitoring API Usage
```bash
npm run build        # Watch terminal for tracking logs
```

**Example Output:**
```
🔥 [Sanity API Hit #1] fetchGlobals
📋 Query: *[_type == "globals" && _id == "globals"][0]{...
✅ [Sanity API Hit #1] Completed in 128ms
📈 Total API calls so far: 1
🎯 BUILD SUMMARY: Total Sanity API calls made: 20
```

### Free Tier Monitoring
- **Sanity Free Tier**: 100,000 API requests/month
- **Current Usage**: ~20 calls per build  
- **Safe Build Frequency**: ~5,000 builds/month

**Key Point**: Tracking logs appear in **terminal** (not browser console) because API calls happen server-side during build.