// TODO: Fetch this from Sanity
const SITE_NAME = 'Norfolk and Suffolk Guild of Weavers, Spinners and Dyers';

export function buildTitle(pageTitle?: string): string {
  return `${pageTitle || ""} | ${SITE_NAME}`;
}