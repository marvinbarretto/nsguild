// ./src/sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import { eventType } from "./event";
import { linkType } from "./link";
import { postType } from "./post";
import { publicationType } from "./publication";
import { homepageType } from "./homepage";
import { contactType } from "./contact";
import { globalsType } from "./globals";
import { blockContentType } from "./blockContent";
import { authorType } from "./author";
import { categoryType } from "./category";
import { photoGalleryType } from "./photoGallery";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    homepageType,   // Home
    postType,       // News
    eventType,      // Events
    photoGalleryType, 
    publicationType,// Publications
    contactType,    // Contact
    globalsType,    // Global Settings (moved to bottom)
    authorType,     // Other
    categoryType,   // Other
    linkType,       // Other
    blockContentType // Other
  ],
};
