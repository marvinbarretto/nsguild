// ./src/sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import { eventType } from "./event";
import { linkType } from "./link";
import { postType } from "./post";
import { publicationType } from "./publication";
import { homepageType } from "./homepage";
import { globalsType } from "./globals";
import { blockContentType } from "./blockContent";
import { authorType } from "./author";
import { categoryType } from "./category";
import { photoGalleryType } from "./photoGallery";
import { equipmentType } from "./equipment";
import { pagesContentType } from "./pagesContent";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    homepageType,
    postType,
    eventType,
    photoGalleryType,
    equipmentType,
    publicationType,
    globalsType,
    authorType,
    categoryType,
    linkType,
    blockContentType,
    pagesContentType
  ],
};
