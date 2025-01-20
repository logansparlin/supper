'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {allTypes} from './sanity/schemaTypes'
import {structure} from './sanity/structure'
import { resolve } from './sanity/lib/resolve'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title: 'Soft Union',
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema: {
    types: allTypes,
  },
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: '/api/draft/enable',
          disable: '/api/draft/disable',
        }
      }
    }),
  ],
})
