import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, getArticles, url } from '../lib/site';

export async function GET(context: APIContext) {
  const articles = await getArticles();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: new URL(import.meta.env.BASE_URL, context.site).href,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.created,
      link: url(`${a.id}/`),
    })),
  });
}
