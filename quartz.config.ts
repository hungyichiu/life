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
        // 生活站：淡薄荷底＋藍綠強調，跟技術站的黑白橘分開
        lightMode: {
          light: "#f5faf8",
          lightgray: "#dde8e4",
          gray: "#66746f",
          darkgray: "#2b3a36",
          dark: "#1d2b28",
          secondary: "#1f7a70",
          tertiary: "#175e56",
          highlight: "rgba(42, 157, 143, 0.10)",
          textHighlight: "#a8e0d688",
        },
        darkMode: {
          light: "#131c1a",
          lightgray: "#2a3835",
          gray: "#8d9b97",
          darkgray: "#dde8e4",
          dark: "#f0f7f5",
          secondary: "#5cc4b5",
          tertiary: "#8fd8cc",
          highlight: "rgba(92, 196, 181, 0.12)",
          textHighlight: "#2a9d8f55",
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
