import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { brandImage } from "./quartz/util/ogBrand"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Chris 的生活記錄",
    pageTitleSuffix: " · Chris 的生活記錄",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-TW",
    baseUrl: "hungyichiu.github.io/life",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        // 中文字型沒有 italic，includeItalic 要關掉，否則 Google Fonts 整份 CSS 會失敗
        header: { name: "Noto Serif TC", weights: [600, 700], includeItalic: false },
        body: { name: "Noto Sans TC", weights: [400, 500, 700], includeItalic: false },
        code: { name: "JetBrains Mono", weights: [400, 600], includeItalic: false },
      },
      colors: {
        // 生活站：米白紙張底＋磚紅強調，跟技術站的黑白橘分開
        lightMode: {
          light: "#fbf8f3",
          lightgray: "#e6dfd5",
          gray: "#75695f",
          darkgray: "#3b322c",
          dark: "#241d18",
          secondary: "#b5462e",
          tertiary: "#8c3a24",
          highlight: "rgba(181, 70, 46, 0.08)",
          textHighlight: "#f3c9a888",
        },
        darkMode: {
          light: "#1c1917",
          lightgray: "#3a332e",
          gray: "#a39589",
          darkgray: "#ece4da",
          dark: "#f6efe6",
          secondary: "#e07a5f",
          tertiary: "#f0a48c",
          highlight: "rgba(224, 122, 95, 0.14)",
          textHighlight: "#e07a5f55",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "light-plus",
          dark: "dark-plus",
        },
        keepBackground: true,
      }),
      Plugin.FixRelativeAssetPaths(),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.ExplicitPublish()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // 每篇文章各自產一張預覽圖，版型在 quartz/util/ogBrand.tsx
      Plugin.CustomOgImages({ imageStructure: brandImage }),
    ],
  },
}

export default config
