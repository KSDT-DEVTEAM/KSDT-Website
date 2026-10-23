import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {fallbackCategory, newsCategory, newsSections, postCategories} from '../categories'

// Matches the post schema of the existing "KSDT Blog" Studio (ksdt.sanity.studio), which owns the
// real posts in the production dataset. Keep field names and types the same so both Studios can edit
// the same documents. The only additions are `category` and, for News posts, `newsSection` and
// `featuredProject`.
//
// The old Studio also allows a "Text Content" (contentBlock) item in `content`. No post uses it,
// so it's left out here.

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'The post’s URL: /media/<slug>, or /news/<slug> for News posts',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      description: 'Decides which section of the Media page the post shows in. News posts go on the News page.',
      options: {
        list: postCategories.map(({title, value}) => ({title, value})),
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required().error('Pick a category before publishing.'),
    }),
    defineField({
      name: 'newsSection',
      title: 'News section',
      type: 'string',
      description: 'Decides which section of the News page the post shows in.',
      options: {
        list: newsSections.map(({title, value}) => ({title, value})),
        layout: 'radio',
        direction: 'horizontal',
      },
      hidden: ({document}) => document?.category !== newsCategory,
      validation: (rule) =>
        rule.custom((value, {document}) =>
          document?.category === newsCategory && !value ? 'Pick UCSD or Global before publishing.' : true,
        ),
    }),
    defineField({
      name: 'featuredProject',
      title: 'Featured intern project',
      type: 'boolean',
      description: 'Shows the post under Featured Work on the News page and the homepage.',
      initialValue: false,
      hidden: ({document}) => document?.category !== newsCategory,
    }),
    defineField({
      name: 'content',
      type: 'array',
      description: 'Add text, images, and galleries in any order',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 1', value: 'h1'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Heading 4', value: 'h4'},
            {title: 'Heading 5', value: 'h5'},
            {title: 'Heading 6', value: 'h6'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bulleted list', value: 'bullet'},
            {title: 'Numbered list', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'Link',
                    description: 'A valid web, email, phone, or relative link.',
                    validation: (rule) =>
                      rule.uri({scheme: ['http', 'https', 'tel', 'mailto'], allowRelative: true}),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({type: 'imageBlock'}),
        defineArrayMember({type: 'galleryBlock'}),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      type: 'datetime',
      description: 'Shown on the post. The 3 most recent posts are featured at the top of the Media page.',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{type: 'person'}],
    }),
  ],
  orderings: [
    {
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      firstName: 'author.firstName',
      lastName: 'author.lastName',
      category: 'category',
      newsSection: 'newsSection',
      media: 'coverImage',
    },
    prepare({title, firstName, lastName, category, newsSection, media}) {
      // e.g. "Review", or "News: UCSD"
      const sectionTitle = newsSections.find((s) => s.value === newsSection)?.title
      const categoryTitle = [
        postCategories.find((c) => c.value === (category ?? fallbackCategory))?.title,
        category === newsCategory && sectionTitle,
      ]
        .filter(Boolean)
        .join(': ')
      const author = [firstName, lastName].filter(Boolean).join(' ')
      return {title, subtitle: [categoryTitle, author && `by ${author}`].filter(Boolean).join(' · '), media}
    },
  },
})
