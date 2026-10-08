import {UserIcon} from '@sanity/icons/User'
import {defineField, defineType} from 'sanity'

// Post authors. Matches the person schema of the existing "KSDT Blog" Studio.

export const personType = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'firstName',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'picture',
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
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      media: 'picture',
    },
    prepare({firstName, lastName, media}) {
      return {title: [firstName, lastName].filter(Boolean).join(' '), media}
    },
  },
})
