import { type SchemaTypeDefinition } from 'sanity'

import {postType} from './postType'
import {personType} from './personType'
import {galleryBlockType, imageBlockType} from './mediaBlockTypes'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, personType, imageBlockType, galleryBlockType],
}
