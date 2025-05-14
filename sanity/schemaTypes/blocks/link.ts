
import { defineField, defineType } from "sanity";

export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal', value: 'internal' },
          { title: 'External', value: 'external' },
          { title: 'Information Toggle', value: 'information' }
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'internal',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'to',
      title: 'To',
      type: 'reference',
      to: [
        { type: 'homePage' },
        { type: 'projectPage' },
        { type: 'worksPage' },
      ],
      hidden: ({ parent }) => parent?.type !== 'internal',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
      hidden: ({ parent }) => parent?.type !== 'external',
    }),
  ],
})