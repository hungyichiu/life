import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { QuartzComponentProps } from "./quartz/components/types"

// 文章頁：不是首頁、不是標籤頁、不是資料夾頁
const isArticle = (page: QuartzComponentProps) =>
  page.fileData.slug !== "index" &&
  !page.fileData.slug!.startsWith("tags/") &&
  !page.fileData.slug!.endsWith("/index")

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    // 上一篇／下一篇只放在文章頁，首頁、標籤頁、資料夾頁不放
    Component.ConditionalRender({
      condition: isArticle,
      component: Component.PrevNext(),
    }),
  ],
  footer: Component.Footer({
    links: {
      "SAP 開發技術筆記": "https://hungyichiu.github.io/abapnotes",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({ rootName: "首頁" }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    // 首頁的標題由內文的開場（home-hero）自己畫
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: (page) => page.fileData.slug !== "index",
    }),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      filterFn: (node) => node.slugSegment !== "assets" && node.slugSegment !== "tags",
      // 資料夾顯示名稱來自各資料夾 index.md 的 title，不用在這裡對照
      // 依檔名排序（01-、02- 的系列編號），不用標題排，系列文章才會排在一起
      sortFn: (a, b) => {
        if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
        // 分類順序：讀、想、吃喝、玩、練（其他照檔名）
        // sortFn 會整段被搬到瀏覽器執行，順序清單要寫在函式裡面
        const order = ["read", "think", "eat-drink", "play", "practice"]
        const ai = order.indexOf(a.slugSegment)
        const bi = order.indexOf(b.slugSegment)
        if (ai !== -1 && bi !== -1) return ai - bi
        return a.slugSegment.localeCompare(b.slugSegment, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [
    // 首頁右欄列最近的文章
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "最近寫的",
        limit: 6,
        showTags: false,
        // 首頁和各分類的 index 不算文章
        filter: (f) => f.slug !== "index" && !f.slug!.endsWith("/index"),
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.TableOfContents()),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs({ rootName: "首頁" }), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      filterFn: (node) => node.slugSegment !== "assets" && node.slugSegment !== "tags",
      // 資料夾顯示名稱來自各資料夾 index.md 的 title，不用在這裡對照
      // 依檔名排序（01-、02- 的系列編號），不用標題排，系列文章才會排在一起
      sortFn: (a, b) => {
        if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
        // 分類順序：讀、想、吃喝、玩、練（其他照檔名）
        // sortFn 會整段被搬到瀏覽器執行，順序清單要寫在函式裡面
        const order = ["read", "think", "eat-drink", "play", "practice"]
        const ai = order.indexOf(a.slugSegment)
        const bi = order.indexOf(b.slugSegment)
        if (ai !== -1 && bi !== -1) return ai - bi
        return a.slugSegment.localeCompare(b.slugSegment, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    }),
  ],
  right: [],
}
