import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const spec = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../docs/spec' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    description: z.string().optional(),
    order: z.number().optional(),
    demos: z.array(z.string()).optional()
  })
})

export const collections = {
  spec
}
