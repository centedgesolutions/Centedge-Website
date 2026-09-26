import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const successStoriesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/success-stories' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    kpi: z.string(),
    category: z.string().default('Lean Manufacturing'),
    publishDate: z.date().or(z.string()).optional(),
    featured: z.boolean().default(false).optional(),
    coverImage: z.string().default('/images/story-lean.jpg').optional(),
    summary: z.string(),
    challenge: z.string().optional(),
    solution: z.string().optional(),
    results: z.string().optional(),
  }),
});

const insightsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    author: z.string().default('Surya Prakash'),
    authorRole: z.string().default('Principal Consultant').optional(),
    publishDate: z.date().or(z.string()).optional(),
    readTime: z.string().default('5 min read'),
    category: z.string().default('Lean Manufacturing'),
    featured: z.boolean().default(false).optional(),
    coverImage: z.string().default('/images/insight-5s.jpg').optional(),
    excerpt: z.string(),
  }),
});

export const collections = {
  'success-stories': successStoriesCollection,
  'insights': insightsCollection,
};
