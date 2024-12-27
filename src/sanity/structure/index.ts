// ./structure/index.ts

import type { StructureResolver, StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Singleton for homepage
      S.listItem()
        .title('Homepage')
        .id('homepage')
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
        ),
      // Other document types
      ...S.documentTypeListItems().filter(
        (listItem) => !['homepage'].includes(listItem.getId() as string)
      ),
    ])