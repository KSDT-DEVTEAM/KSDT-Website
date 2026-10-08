import type {StructureResolver} from 'sanity/structure'

import {postCategories} from './categories'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
// One list per post category (Reviews, Interviews, …), posts with no category yet, then all posts and people.
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
              .defaultOrdering([{field: 'date', direction: 'desc'}])
              .initialValueTemplates([S.initialValueTemplateItem(`post-${value}`)]),
          ),
      ),
      S.listItem()
        .id('uncategorized')
        .title('No category')
        .schemaType('post')
        .child(
          S.documentList()
            .title('No category')
            .schemaType('post')
            .filter('_type == "post" && !defined(category)')
            .defaultOrdering([{field: 'date', direction: 'desc'}]),
        ),
      S.documentTypeListItem('post').title('All posts'),
      S.divider(),
      S.documentTypeListItem('person').title('People'),
    ])
