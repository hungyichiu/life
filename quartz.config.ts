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
        // 生活站：米白底＋海軍藍（字、連結）＋芥末黃（線條強調，在 custom.scss 的 --accent）
        lightMode: {
          light: "#fdfcf8",
          lightgray: "#e4e2db",
          gray: "#6b7380",
          darkgray: "#2a3646",
          dark: "#1e2a3a",
          secondary: "#1e4f8a",
          tertiary: "#163b68",
          highlight: "rgba(217, 150, 43, 0.12)",
          textHighlight: "#f5d58a88",
        },
        darkMode: {
          light: "#141b26",
          lightgray: "#2c3646",
          gray: "#8f99a8",
          darkgray: "#dfe4ec",
          dark: "#f2f4f8",
          secondary: "#7fb0e8",
          tertiary: "#a9c9f0",
          highlight: "rgba(233, 178, 90, 0.12)",
          textHighlight: "#d9962b55",
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
