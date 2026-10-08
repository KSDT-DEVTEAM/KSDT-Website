import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'

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
      options: {
        source: 'title',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'section',
      type: 'string',
      description: 'Which part of the site this post appears on. Also sets its URL: /news/… or /media/…',
      options: {
        list: [
          {title: 'News', value: 'news'},
          {title: 'Media', value: 'media'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      description:
        'Featured posts show at the top of the News/Media page and on the homepage. Featured news posts are also listed on Featured Intern Projects.',
      initialValue: false,
    }),
    defineField({
      name: 'authors',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'author'}})],
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'categories',
      type: 'array',
      description:
        'The first category is the pink label on the post card. News: UCSD or Global decides which list it shows in. Media: Reviews or Interviews.',
      of: [defineArrayMember({type: 'reference', to: {type: 'category'}})],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      description: 'Shown on the post and used to sort posts and group them by quarter.',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
  ],
  orderings: [
    {
      title: 'Published, newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'authors.0.name',
      section: 'section',
      featured: 'featured',
      media: 'mainImage',
    },
    prepare({title, author, section, featured, media}) {
      const subtitle = [
        section && section.toUpperCase(),
        featured && 'Featured',
        author && `by ${author}`,
      ]
        .filter(Boolean)
        .join(' · ')
      return {title, subtitle, media}
    },
  },
})
