// ./src/sanity/schemaTypes/index.ts
import type { SchemaTypeDefinition } from "sanity";
import { eventType } from "./event";
import { linkType } from "./link";
import { postType } from "./post";
import { publicationType } from "./publication";
import { settingsType } from "./settings";
import { contactType } from "./contact";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType,
    linkType,
    settingsType,
    eventType,
    publicationType,
    contactType],
};