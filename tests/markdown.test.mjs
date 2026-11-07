import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';

process.env.LIFE_CONTENT = 'tests/fixtures/content';
const { markdownOptions } = await import('../src/lib/markdown-options.mjs');
const processor = await createMarkdownProcessor({ ...markdownOptions, syntaxHighlight: false });
const render = async (md, file = 'tests/fixtures/content/eat-drink/x.md') =>
  (await processor.render(md, { fileURL: pathToFileURL(path.resolve(file)) })).code;

test('短重點用圈、長重點用線', async () => {
  const html = await render('中間 ==短句== 和 ==這一句比較長所以應該要畫底線才對。== 結束');
  assert.match(html, /<mark-red data-type="circle">短句<\/mark-red>/);
  assert.match(html, /<mark-red data-type="underline">這一句/);
});

test('行內程式碼裡的語法不轉換', async () => {
  const html = await render('文字 `==不要轉==` 和 `[[不要轉]]`');
  assert.doesNotMatch(html, /mark-red|<a /);
});

test('wikilink：完整路徑、分區、短連結都帶 /life', async () => {
  const html = await render('[[read/fixture-dao|道德經]] [[read/index|讀]] [[fixture-zhuang]] [[index|首頁]]');
  assert.match(html, /href="\/life\/read\/fixture-dao\/"[^>]*>道德經/);
  assert.match(html, /href="\/life\/read\/"[^>]*>讀/);
  assert.match(html, /href="\/life\/read\/fixture-zhuang\/"[^>]*>fixture-zhuang/);
  assert.match(html, /href="\/life\/"[^>]*>首頁/);
});

test('找不到的 wikilink 變純文字，不產生壞連結', async () => {
  const html = await render('[[no-such-page|別名]]');
  assert.match(html, /別名/);
  assert.doesNotMatch(html, /<a /);
});

test('[!note] 變眉批，一般引用不變', async () => {
  const note = await render('> [!note]\n> 這是眉批。');
  assert.match(note, /<aside class="marginal">/);
  assert.doesNotMatch(note, /\[!note\]/);
  assert.match(await render('> 一般引用'), /<blockquote>/);
});

test('開頭中文放大首字、開頭英數變引言', async () => {
  assert.match(await render('早上七點'), /<p class="dropcap">早上/);
  assert.match(await render('10/31 去了展覽'), /<span class="leadin">10\/31<\/span> 去了/);
  assert.doesNotMatch(await render('第一段\n\n10/31 第二段'), /leadin/);
});

test('圖片：同層 _assets 和根目錄 _assets 都找得到', async () => {
  const dir = 'tests/fixtures/content/eat-drink/_assets';
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync('tests/fixtures/content/_assets/fixture.webp', `${dir}/sibling.webp`);
  try {
    // Astro 建置時才換成最佳化後的網址，這裡看相對路徑是否正確
    assert.match(await render('![[sibling.webp|同層]]'), /\.\/_assets\/sibling\.webp/);
    assert.match(await render('![[fixture.webp|根目錄]]'), /\.\.\/_assets\/fixture\.webp/);
    assert.doesNotMatch(await render('![[no-such.webp]]'), /<img/);
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});

test('表格包進可捲動容器', async () => {
  assert.match(await render('| a |\n|---|\n| b |'), /<div class="table-scroll"><table>/);
});

test('smartypants 關閉：引號和破折號不被改', async () => {
  const html = await render('"quote" -- dash');
  assert.doesNotMatch(html, /[“”–—]/);
});
