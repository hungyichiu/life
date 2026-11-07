// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { markdownOptions } from './src/lib/markdown-options.mjs';

export default defineConfig({
  site: 'https://hungyichiu.github.io',
  base: '/life',
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: false,
    processor: unified(markdownOptions),
  },
});
