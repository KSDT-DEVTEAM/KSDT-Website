import type {StructureResolver} from 'sanity/structure'

import {fallbackCategory, postCategories} from './categories'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
// One list per post category (Reviews, Interviews, …), then all posts and people.
// Posts with no category show in the fallback category's list (Other).
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
              .filter('_type == "post" && coalesce(category, $fallback) == $category')
              .params({category: value, fallback: fallbackCategory})
              .defaultOrdering([{field: 'date', direction: 'desc'}])
              .initialValueTemplates([S.initialValueTemplateItem(`post-${value}`)]),
          ),
      ),
      S.documentTypeListItem('post').title('All posts'),
      S.divider(),
      S.documentTypeListItem('person').title('People'),
    ])
