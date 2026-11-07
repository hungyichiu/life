import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// life/ 透過 content junction 讀進來；LIFE_CONTENT 可換成測試用假資料
const life = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!_assets/**'], base: process.env.LIFE_CONTENT ?? './content' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    tags: z.array(z.string()).nullish().transform((v) => v ?? []),
    created: z.coerce.date(),
    status: z.string().optional(),
    area: z.string().optional(),
    publish: z.boolean().default(false),
    mood: z.string().optional(), // 本期心情氣象，可用 emoji 開頭
    book: z.string().optional(), // 書背上的書名；有這欄才上書架
    quote: z.string().optional(), // 書架金句
  }),
});

export const collections = { life };
