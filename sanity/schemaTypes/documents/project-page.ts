import { defineType, defineField } from "sanity";
import {HomeIcon} from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

import { VideoAspect } from '../../components/video-aspect'

const lastTenYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());
};

export default defineType({
  name: "projectPage",
  title: "Projects",
  type: "document",
  icon: HomeIcon,
  orderings: [orderRankOrdering],
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'media', title: 'Media' },
  ],
  fields: [
    orderRankField({
      type: 'projectPage',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Meta',
      type: 'seo'
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: 'content',
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: 'content',
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "client",
      title: "Client",
      type: 'reference',
      group: 'content',
      to: [{ type: 'client' }],
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'content',
      options: {
        list: lastTenYears(),
      },
      initialValue: () => new Date().getFullYear().toString(),
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
    }),
    defineField({
      name: 'explanation',
      title: 'Explanation',
      type: 'richTextSimple',
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'array',
      group: 'media',
      of: [
        { type: 'image' },
        { 
          name: 'video',
          type: 'file',
          options: {
            accept: 'video/*',
          },
          fields: [
            defineField({
              name: 'aspectRatio',
              title: 'Aspect Ratio',
              type: 'number',
              components: {
                input: VideoAspect,
              },
            })
          ],
          preview: {
            select: {
              filename: 'asset.originalFilename',
              aspectRatio: 'aspectRatio',
            },
            prepare: ({ filename, aspectRatio }) => ({
              title: filename,
              subtitle: aspectRatio,
            }),
          },
        },
      ],
    }),
    defineField({
      name: 'related',
      title: 'Related Projects',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'projectPage' }] }],
    }),
  ],
});
