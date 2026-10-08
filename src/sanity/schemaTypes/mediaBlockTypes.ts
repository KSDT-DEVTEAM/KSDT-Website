import {ImageIcon} from '@sanity/icons/Image'
import {ImagesIcon} from '@sanity/icons/Images'
import {defineArrayMember, defineField, defineType} from 'sanity'

// Image and gallery blocks inside a post's content. Match the existing "KSDT Blog" Studio.

export const imageBlockType = defineType({
  name: 'imageBlock',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alternative Text',
      description: 'Important for SEO and accessibility.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      type: 'text',
      rows: 2,
      description: 'Optional caption to display below the image',
    }),
    defineField({
      name: 'size',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
          {title: 'Full Width', value: 'full'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'large',
    }),
    defineField({
      name: 'alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'center',
    }),
  ],
  preview: {
    select: {title: 'caption', subtitle: 'alt', media: 'image'},
  },
})

export const galleryBlockType = defineType({
  name: 'galleryBlock',
  title: 'Image Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'caption', type: 'string'}),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(2).max(9),
    }),
    defineField({
      name: 'layout',
      type: 'string',
      options: {
        list: [
          {title: 'Grid', value: 'grid'},
          {title: 'Carousel', value: 'carousel'},
          {title: 'Masonry', value: 'masonry'},
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
    defineField({
      name: 'columns',
      type: 'number',
      title: 'Columns (for Grid layout)',
      options: {list: [2, 3, 4]},
      initialValue: 3,
      hidden: ({parent}) => parent?.layout !== 'grid',
    }),
  ],
  preview: {
    select: {images: 'images', layout: 'layout'},
    prepare({images, layout}) {
      return {
        title: `Gallery: ${images?.length ?? 0} images`,
        subtitle: layout,
        media: images?.[0],
      }
    },
  },
})
