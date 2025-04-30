# Norfolk & Suffolk Guild website

## Stack
- Frontend [Astro](https://astro.build/) and [Vue](https://vuejs.org/) (just for the Photo Gallery)
- Backend [Sanity](https://www.sanity.io/)
- [Web3Forms](https://web3forms.com/) for contact form
- Auto deployments to [Vercel](https://vercel.com/) on push

## Getting Started

```bash
npm install
npm run dev
```

## Deploy

```bash
npx sanity deploy
```

## Environment variables needed

```bash
- PUBLIC_SANITY_PROJECT_ID
- PUBLIC_SANITY_DATASET
- PUBLIC_SANITY_VISUAL_EDITING_ENABLED
- SANITY_API_TOKEN
- WEB3FORMS_ACCESS_KEY
```

## Todo
- [ ] Remove `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` ?
- [ ] Explore 'Presentation mode' for Sanity
- [ ] Google Analytics when live
- [ ] Hook up hosting