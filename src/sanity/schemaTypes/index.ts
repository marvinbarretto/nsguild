// ./src/sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import { eventType } from "./event";
import { linkType } from "./link";
import { postType } from "./post";
import { publicationType } from "./publication";
import { homepageType } from "./homepage";
import { contactType } from "./contact";
import { globalsType } from "./globals";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    postType,
    linkType,
    homepageType,
    eventType,
    publicationType,
    contactType,
    globalsType,
  ],
};