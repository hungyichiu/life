import fs from 'node:fs';
import path from 'node:path';
import { findAndReplace } from 'mdast-util-find-and-replace';
import { visit } from 'unist-util-visit';

const BASE = '/life';
const CIRCLE_MAX_CHARS = 12; // 紅圈不能換行，太長改畫底線

export const contentDir = () => path.resolve(process.cwd(), process.env.LIFE_CONTENT ?? 'content');

function listMarkdown(dir, root = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === '_assets') return [];
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdown(full, root);
    if (!entry.name.endsWith('.md')) return [];
    return [path.relative(root, full).replaceAll('\\', '/').replace(/\.md$/, '')];
  });
}

/** [[read/index|讀]] 或 [[foo]] 轉成網址；找不到回傳 null */
export function resolveWikilink(target, files) {
  const [rawPath, anchor] = target.split('#');
  const clean = rawPath.trim().replace(/\.md$/, '').replace(/^\/+/, '');
  const hit = files.find((f) => f === clean || f === `${clean}/index`)
    ?? files.find((f) => f.split('/').pop() === clean);
  if (hit === undefined) return null;
  const slug = hit === 'index' ? '' : `${hit.replace(/\/index$/, '')}/`;
  return `${BASE}/${slug}${anchor ? `#${anchor}` : ''}`;
}

function assetUrl(name, filePath, root) {
  if (!filePath) return null;
  const realRoot = fs.realpathSync(root);
  if (!fs.existsSync(path.join(realRoot, '_assets', name))) return null;
  const from = fs.realpathSync(path.dirname(filePath));
  const rel = path.relative(from, path.join(realRoot, '_assets', name)).replaceAll('\\', '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

/** Obsidian 語法：==重點==、[[連結]]、![[圖片]]、> [!note] 眉批 */
export function remarkObsidian() {
  return (tree, file) => {
    const root = contentDir();
    const files = fs.existsSync(root) ? listMarkdown(root) : [];
    const warn = (msg) => console.warn(`[obsidian] ${file.path ?? '(導言)'}: ${msg}`);

    visit(tree, 'blockquote', (node) => {
      const first = node.children[0];
      const text = first?.type === 'paragraph' ? first.children[0] : null;
      if (text?.type !== 'text') return;
      const m = text.value.match(/^\[!(\w+)\][+-]?[ \t]*\n?/);
      if (!m) return;
      text.value = text.value.slice(m[0].length);
      if (m[1].toLowerCase() === 'note') {
        node.data = { hName: 'aside', hProperties: { className: ['marginal'] } };
      }
    });

    findAndReplace(tree, [
      [/!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g, (_, name, alt) => {
        const url = assetUrl(name.trim(), file.path, root);
        if (!url) { warn(`找不到圖片 ${name}`); return false; }
        return { type: 'image', url, alt: alt ?? '' };
      }],
      [/\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g, (_, target, alias) => {
        const url = resolveWikilink(target, files);
        const label = alias ?? target.split('/').pop();
        if (!url) { warn(`找不到連結 ${target}`); return { type: 'text', value: label }; }
        return { type: 'link', url, children: [{ type: 'text', value: label }] };
      }],
      [/==([^=\n]+?)==/g, (_, value) => ({
        type: 'markRed',
        data: {
          hName: 'mark-red',
          hProperties: { 'data-type': [...value].length <= CIRCLE_MAX_CHARS ? 'circle' : 'underline' },
        },
        children: [{ type: 'text', value }],
      })],
    ], { ignore: ['link', 'linkReference', 'inlineCode', 'code'] });
  };
}

/** 報紙版面：開頭中文放大首字、開頭英數變紅字引言、表格可橫向捲動 */
export function rehypeNewspaper() {
  return (tree) => {
    const firstBlock = tree.children.find((n) => n.type === 'element');
    if (firstBlock?.tagName === 'p' && firstBlock.children[0]?.type === 'text') {
      const text = firstBlock.children[0];
      const token = text.value.match(/^[0-9A-Za-z][\x21-\x7E]*/);
      if (token) {
        text.value = text.value.slice(token[0].length);
        firstBlock.children.unshift({
          type: 'element', tagName: 'span', properties: { className: ['leadin'] },
          children: [{ type: 'text', value: token[0] }],
        });
      } else if (/^\p{Script=Han}/u.test(text.value)) {
        firstBlock.properties = { ...firstBlock.properties, className: ['dropcap'] };
      }
    }
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === undefined) return;
      parent.children[index] = {
        type: 'element', tagName: 'div', properties: { className: ['table-scroll'] }, children: [node],
      };
      return index + 1;
    });
  };
}
