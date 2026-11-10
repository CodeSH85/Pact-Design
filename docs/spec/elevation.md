---
title: "Border, Focus Ring & Elevation"
eyebrow: "Foundations · Structure & Depth"
description: "定義銳利緊湊圓角（0px–4px）、三種鍵盤焦點幾何（外擴、齊平、內縮）、深淺色自適應陰影與 Z-Index 堆疊層級。"
order: 7
---

## 邊框粗細與緊湊圓角 (`system.border.width.*` & `system.radius.*`)

Pact Design 採用低調清晰的 `1px` 結構邊框與銳利圓角（`0px`–`4px`），避免大型圓角在密集面板拼接時產生視覺縫隙：

- **邊框粗細 (`system.border.width.*`)**：
  - `none` (`0px` / `border-none`)、`sm` (`1px` / `border` 或 `border-sm`，系統預設容器邊框)、`md` (`2px` / `border-md`，焦點外框與選取指示條)、`lg` (`3px` / `border-lg`)。
- **圓角比例尺 (`system.radius.*`)**：
  - `none` (`0px` / `rounded-none`)：齊平停駐面板（Docked Panels）、資料表儲存格。
  - `2xs` (`2px` / `rounded-2xs`)：行內標籤（Badge）、Checkbox、小型圖示按鈕。
  - `xs` (`4px` / `rounded-xs`)：**系統預設圓角**，適用於按鈕、輸入框、下拉選單與卡片。
  - `sm` (`8px` / `rounded-sm`)：浮動對話框（Modal）、大型 Popover 容器。
  - `md` (`12px`)、`lg` (`16px`)、`xl` (`24px`)、`full` (`999rem` / 膠囊形狀與圓點指示器)。

---

## 鍵盤導覽 Focus Ring 幾何 (`system.focus.*`)

在高密度介面中，不同容器邊界條件需要不同的焦點外框偏移策略，避免焦點外框被 `overflow: hidden` 裁切或與鄰近元素重疊：

| Focus 偏移模式 | CSS Variable | 偏移數值 | 典型應用場景 |
| :--- | :--- | :--- | :--- |
| **Default (外擴)** | `--system-focus-offset-default` | `+2px` | 獨立按鈕（Button）、卡片、Checkbox，焦點外框與元件邊界保留 `2px` 呼吸空間。 |
| **Flush (齊平)** | `--system-focus-offset-flush` | `0px` | 文字輸入框（Input）、Select 下拉框與停駐控制項，焦點外框緊貼邊框不外溢。 |
| **Inset (內縮)** | `--system-focus-offset-inset` | `-2px` | 具備 `overflow: hidden` 的高密度資料表儲存格（Data Grid Cell）、樹狀列表列與緊鄰頁籤。 |

---

## 深淺色自適應海拔陰影 (`system.elevation.*`)

深色背景對陰影的吸收度遠高於淺色背景。Pact Design 將陰影色彩抽離為主題感知的 `system.shadow.color.{xs..xl}`：在淺色模式下使用低不透明度（`α 0.06`–`0.18`），在深色模式下自動提升不透明度（`α 0.28`–`0.68`），確保懸浮元件在深色背景上依然層次分明：

| Elevation 層級 | UnoCSS 工具類別 | CSS Variable | 尺寸規格 (`offsetY / blur / spread`) | Light Alpha | Dark Alpha | 典型應用場景 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`xs`** | `shadow-elevation-xs` | `--system-elevation-xs` | `1px / 2px / 0px` | `0.06` | `0.28` | 卡片微浮起、Segmented Control 選中滑塊。 |
| **`sm`** | `shadow-elevation-sm` | `--system-elevation-sm` | `2px / 4px / -1px` | `0.08` | `0.36` | 懸浮按鈕、Sticky 表頭陰影。 |
| **`md`** | `shadow-elevation-md` | `--system-elevation-md` | `4px / 8px / -2px` | `0.10` | `0.45` | Tooltip、小型浮動工具列、Toast 通知。 |
| **`lg`** | `shadow-elevation-lg` | `--system-elevation-lg` | `8px / 16px / -4px` | `0.14` | `0.56` | 下拉選單（Menu Popup）、Popover、Autocomplete 列表。 |
| **`xl`** | `shadow-elevation-xl` | `--system-elevation-xl` | `16px / 32px / -4px` | `0.18` | `0.68` | 模態對話框（Modal）、側滑抽屜（Drawer）、Command Palette。 |

---

## Z-Index 堆疊秩序 (`system.z-index.*`)

統一管理介面在 Z 軸上的疊加順序（UnoCSS `z-<key>`），避免任意硬編碼數字造成遮擋衝突：

- `base` (`0`) → `docked` (`10`) → `dropdown` (`100`) → `sticky` (`200`) → `drawer` (`300`) → `modal` (`400`) → `popover` (`500`) → `toast` (`600`)。
