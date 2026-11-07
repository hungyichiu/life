import { remarkObsidian, rehypeNewspaper } from './obsidian-plugins.mjs';

// astro.config 和首頁導言共用，兩邊轉出來的效果才會一樣
export const markdownOptions = {
  remarkPlugins: [remarkObsidian],
  rehypePlugins: [rehypeNewspaper],
  smartypants: false,
};
