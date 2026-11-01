import { SocialImageOptions } from "./og"
import { getFontSpecificationName } from "./theme"

// 每篇文章的預覽圖（og:image），配色對齊生活站：淡薄荷底＋藍綠
// satori 只支援 flex 排版，有多個子元素的 div 都要 display: flex

const ORANGE = "#2A9D8F"
const ORANGE_TEXT = "#1F7A70"
const GRAY = "#66746F"
const SITE_URL = "hungyichiu.github.io/life"
const AUTHOR = "Chris Chiu"

// 資料夾 → 顯示名稱（對齊各資料夾 index.md 的 title）
const FOLDER_LABELS: Record<string, string> = {
  read: "讀",
  think: "想",
  "eat-drink": "吃喝",
  play: "玩",
  practice: "練",
}

function folderLabel(slug: string): string | undefined {
  const parts = slug.split("/")
  if (parts.length < 2) return undefined
  const key = parts[0]
  return FOLDER_LABELS[key.toLowerCase()] ?? key
}

export const brandImage: SocialImageOptions["imageStructure"] = ({ cfg, title, description, fileData }) => {
  const headerFont = getFontSpecificationName(cfg.theme.typography.header)
  const bodyFont = getFontSpecificationName(cfg.theme.typography.body)
  const slug = fileData.slug ?? ""
  const suffix = cfg.pageTitleSuffix ?? ""
  const cleanTitle = suffix && title.endsWith(suffix) ? title.slice(0, -suffix.length) : title

  const frame = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    backgroundColor: "#F5FAF8",
    borderLeft: `24px solid ${ORANGE}`,
    fontFamily: bodyFont,
  }

  // 首頁：網站本身的介紹卡
  if (slug === "index") {
    return (
      <div style={{ ...frame, padding: "84px 96px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: 2, color: ORANGE_TEXT }}>
            工作以外的記錄
          </div>
          <div
            style={{ fontFamily: headerFont, fontWeight: 700, fontSize: 84, color: "#1D2B28", marginTop: 18 }}
          >
            {cfg.pageTitle}
          </div>
          <div style={{ fontSize: 36, fontWeight: 500, color: "#1D2B28", marginTop: 26 }}>
            讀、想、吃喝、玩、練
          </div>
          <div style={{ width: 120, height: 8, backgroundColor: ORANGE, marginTop: 30 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: GRAY }}>
          <div>{AUTHOR}</div>
          <div style={{ color: "#1D2B28", fontWeight: 500 }}>{SITE_URL}</div>
        </div>
      </div>
    )
  }

  const label = folderLabel(slug)
  const titleSize = cleanTitle.length > 30 ? 52 : 60

  return (
    <div style={{ ...frame, padding: "72px 96px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {label && (
          <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: 2, color: ORANGE_TEXT }}>
            {label}
          </div>
        )}
        <div
          style={{
            fontFamily: headerFont,
            fontWeight: 700,
            fontSize: titleSize,
            lineHeight: 1.3,
            color: "#1D2B28",
            marginTop: 20,
            wordBreak: "keep-all",
            lineClamp: 3,
          }}
        >
          {cleanTitle}
        </div>
        <div
          style={{
            fontSize: 28,
            lineHeight: 1.6,
            color: GRAY,
            marginTop: 24,
            lineClamp: 3,
          }}
        >
          {description}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: GRAY }}>
        <div style={{ color: "#1D2B28", fontWeight: 500 }}>{cfg.pageTitle}</div>
        <div>
          {`${AUTHOR} · ${SITE_URL}`}
        </div>
      </div>
    </div>
  )
}
