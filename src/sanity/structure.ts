import type {StructureResolver} from 'sanity/structure'

import {postCategories} from './categories'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
// One list per post category (Reviews, Interviews, …), then all posts and authors.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...postCategories.map(({value, section}) =>
        S.listItem()
          .id(value)
          .title(section)
          .schemaType('post')
          .child(
            S.documentList()
              .title(section)
              .schemaType('post')
              .filter('_type == "post" && category == $category')
              .params({category: value})
              .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
              .initialValueTemplates([S.initialValueTemplateItem(`post-${value}`)]),
          ),
      ),
      S.documentTypeListItem('post').title('All posts'),
      S.divider(),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'author'].includes(item.getId()!),
      ),
    ])
