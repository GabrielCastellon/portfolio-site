import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    category: z.string().optional(),
    description: z.string(),
    technologies: z.array(z.string()).default([]),
    github: z.url({ protocol: /^https$/ }).optional(),
    demo: z.url({ protocol: /^https$/ }).optional(),
    order: z.number().default(0),
    draft: z.boolean().default(true),
  }),
});

const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    role: z.string(),
    organization: z.string(),
    period: z.string(),
    category: z.string(),
    order: z.number().default(0),
    draft: z.boolean().default(true),
  }),
});

export const collections = { projects, experience };
