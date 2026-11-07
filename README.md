# The Chris Daily 克里斯日報

生活站，Astro 建置，部署到 GitHub Pages（`hungyichiu.github.io/life`）。

- `content` 是指向 Obsidian vault `life/` 的 junction，文章在 vault 裡寫。
- 本機預覽：`npm run dev`，網址 `http://localhost:4321/life/`。
- 看多篇時的版面：`npm run dev:fixtures`（用 `tests/fixtures/content` 的假資料）。
- 測試 Markdown 轉換：`npm test`。

需要 Node 22.23.4 以上。
