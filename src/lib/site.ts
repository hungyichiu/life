import { getCollection, type CollectionEntry } from 'astro:content';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { markdownOptions } from './markdown-options.mjs';

export type Entry = CollectionEntry<'life'>;

export const SITE = {
  name: 'The Chris Daily',
  nameZh: '克里斯日報',
  description: '工作以外的記錄：讀過的書、想到的事、吃過喝過的店、玩過的東西、正在練的東西。',
  techSite: 'https://hungyichiu.github.io/abapnotes',
};

export const SECTIONS = [
  { key: 'read', name: '讀書版', nav: '讀書' },
  { key: 'think', name: '胡思亂想版', nav: '胡思亂想' },
  { key: 'eat-drink', name: '吃喝版', nav: '吃喝' },
  { key: 'play', name: '玩樂版', nav: '玩樂' },
  { key: 'practice', name: '練功版', nav: '練功' },
] as const;

export const MIN_FOR_WALL = 3; // 全站至少幾篇才出現剪報牆
export const MIN_FOR_SHELF = 3; // 至少幾本書才出現書架

export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`;

const isIndex = (e: Entry) => /(^|[\\/])index\.md$/.test(e.filePath ?? '');
const isLive = (e: Entry) => e.data.publish && e.data.status !== 'draft';

export const sectionOf = (e: Entry) => SECTIONS.find((s) => s.key === e.id.split('/')[0]);

/** 正式文章，新的在前（各分區的 index.md 不算） */
export async function getArticles() {
  const all = await getCollection('life');
  return all
    .filter((e) => isLive(e) && !isIndex(e))
    .sort((a, b) => b.data.created.getTime() - a.data.created.getTime() || a.id.localeCompare(b.id));
}

export async function getSectionDescription(key: string) {
  const all = await getCollection('life');
  return all.find((e) => e.id === key && isIndex(e))?.data.description ?? '';
}

// created 只有日期，以 UTC 解析，所以也用 UTC 顯示，日期才不會偏一天
export function formatDate(d: Date, weekday = false) {
  const base = `${d.getUTCFullYear()} 年 ${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日`;
  return weekday ? `${base}　星期${'日一二三四五六'[d.getUTCDay()]}` : base;
}
export const shortDate = (d: Date) =>
  `${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}`;

/** 標題有冒號時，冒號後整段盡量不拆開，避免斷在詞中間 */
const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
export function headlineHtml(title: string) {
  const i = title.indexOf('：');
  if (i < 0) return escapeHtml(title);
  return `${escapeHtml(title.slice(0, i + 1))}<span class="headline-sub">${escapeHtml(title.slice(i + 1))}</span>`;
}

export function readingMinutes(body = '') {
  const chars = body.replace(/[\s|:\-*#>]/g, '').length;
  return Math.max(1, Math.round(chars / 400));
}

/** 首頁導言：標題之前的前兩個一般段落，轉換規則和內文相同 */
let processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | undefined;
export async function renderExcerpt(body = '', paragraphs = 2) {
  const head = body.split(/\n#{1,6}\s/)[0];
  const blocks = head
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b && !/^(\||>|[-*+]\s|\d+\.\s|!\[)/.test(b));
  processor ??= await createMarkdownProcessor({ ...markdownOptions, syntaxHighlight: false });
  return (await processor.render(blocks.slice(0, paragraphs).join('\n\n'))).code;
}

/** 固定序列：同一篇每次建置角度和書背都一樣 */
const TILTS = [-2.2, 1.6, -1, 2.4, -1.7, 1.1];
export const tilt = (i: number) => TILTS[i % TILTS.length];

const SPINES = ['#7a2e2a', '#2f4a3a', '#c08a2e', '#2b3f63', '#4a3b5c', '#8c5a3c', '#3d5a5a'];
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.codePointAt(0)!) >>> 0, 7);
export const spine = (id: string) => ({
  color: SPINES[hash(id) % SPINES.length],
  height: 170 + (hash(id + 'h') % 46),
});
