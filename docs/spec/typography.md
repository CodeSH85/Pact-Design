---
title: "Typography & Numeric Precision"
eyebrow: "Foundations · Typography"
description: "以 14px/16px 為基準的 27 組複合排版字階、原生等寬字體家族，以及高密度表格專用的 .tabular-nums 數字對齊規範。"
order: 4
---

## 字體家族

`tokens/typography/global.json` 定義兩組核心字體堆疊，分別服務於一般介面閱讀與技術識別碼對齊：

- **Sans-Serif (`global.font.family.sans` / `font-sans`)**
  `Inter, "Open Sans", Roboto` — 用於標題、內文、表單控制項與導覽列。
- **Monospace (`global.font.family.mono` / `font-mono`)**
  `JetBrains Mono, SFMono-Regular, Menlo, Consolas, monospace` — 用於節點 ID（`ID-2026-0048`）、版本字串（`v2.1.0`）、Git 雜湊值與程式碼片段。

---

## 系統複合排版字階 (`system.font.*`)

Pact Design 的 27 組系統排版 Token 皆採用 W3C DTCG `$type: "typography"` 複合結構（封裝 `fontFamily`、`fontSize`、`fontWeight`、`lineHeight`、`letterSpacing`）。

在 UnoCSS 中，複合字階直接映射為 **`text-<role>-<size>`** 單一工具類別（例如 `text-heading-md`、`text-body-sm`、`text-label-xs`），一次套用完整的字級、行高、字距、字重與字體家族：

| 字階分類 (Role) | 尺寸範圍 (Scale) | 字級範圍 (`px` / `rem`) | 字重 (Weight) | 行高 (Line Height) | 字距 (Letter Spacing) | 主要用途 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`display`** | `sm`, `md`, `lg` | 36px, 48px, 60px | 700 | `1.1`–`1.15` | `-0.04` 至 `-0.02rem` | 儀表板大型核心指標與視覺焦點標題。 |
| **`heading`** | `xs`, `sm`, `md`, `lg`, `xl` | 20px, 24px, 28px, 32px, 36px | 600–700 | `1.15`–`1.3` | `-0.02` 至 `-0.005rem` | 頁面標題、區塊標題與對話框標題。 |
| **`subheader`** | `sm`, `md`, `lg` | 16px, 18px, 20px | 500 | `1.4` | `-0.01` 至 `0rem` | 面板副標題與模組區塊導言。 |
| **`body`** | `xs`, `sm`, **`md`**, `lg`, `xl` | 12px, 14px, **16px**, 18px, 20px | 400 | `1.5`–`1.6` | `0` 至 `0.01rem` | 內文閱讀與表格內容（緊湊介面預設為 `body-sm` 14px）。 |
| **`label`** | `xs`, `sm`, **`md`**, `lg`, `xl` | 12px, 14px, **16px**, 18px, 20px | 500 | `1.3` | `0` 至 `0.02rem` | 按鈕文字、表單欄位標籤、頁籤與選單項目。 |
| **`caption`** | `sm`, `md`, `lg` | 10px, 12px, 14px | 400 | `1.4` | `0.01` 至 `0.02rem` | 輔助說明、時間戳記與圖表註解。 |
| **`mono`** | `xs`, `sm`, **`md`** | 12px, 14px, **16px** | 400 | `1.4`–`1.5` | `0rem` | 技術識別碼、快捷鍵提示與行內程式碼。 |

---

## 表格等寬數字規範 (`.tabular-nums`)

在資料表的數值欄位（如延遲時間 `12.05 ms`、金額、吞吐量、百分比）中，若希望保留無襯線字體（`sans`）的視覺一致性，同時避免數字 `1` 與 `8` 寬度不同造成的垂直錯位，請套用 OpenType 等寬數字屬性：

```css
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
```
