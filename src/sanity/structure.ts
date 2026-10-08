import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('News posts')
        .schemaType('post')
        .child(
          S.documentList()
            .title('News posts')
            .schemaType('post')
            .filter('_type == "post" && section == "news"')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
            .initialValueTemplates([S.initialValueTemplateItem('post-news')]),
        ),
      S.listItem()
        .title('Media posts')
        .schemaType('post')
        .child(
          S.documentList()
            .title('Media posts')
            .schemaType('post')
            .filter('_type == "post" && section == "media"')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
            .initialValueTemplates([S.initialValueTemplateItem('post-media')]),
        ),
      S.documentTypeListItem('post').title('All posts'),
      S.divider(),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category', 'author'].includes(item.getId()!),
      ),
    ])
