---
title: "Functional Motion"
eyebrow: "Foundations · Motion & Transitions"
description: "純功能導向的極速轉場規範（0ms–200ms），零彈跳過衝（Zero Spring Overshoot），確保高頻率操作的即時回饋感。"
order: 8
---

## 功能性動效原則 (Functional Motion Philosophy)

在每日長時間操作的專業工具與高密度資料介面中，緩慢或帶有彈跳過衝（Spring Overshoot）的動畫會產生操作延遲感。Pact Design 的動效系統嚴格遵循以下規範：

- **極速回饋 (`0ms`–`200ms`)**：所有常規 UI 轉場皆不超過 `200ms`。Hover 與 Active 狀態切換控制在 `50ms`–`100ms` 內完成。
- **零過衝曲線 (Zero Overshoot)**：所有三次貝茲曲線（`cubicBezier`）控制點皆限制於 `[0, 1]` 區間內，杜絕任何視覺晃動。

---

## 動效時長比例尺 (`system.motion.duration.*`)

| Token Key | UnoCSS 工具類別 | CSS Variable | Global 參照 | 時長數值 | 典型應用場景 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`instant`** | `duration-instant` | `--system-motion-duration-instant` | `{global.duration.00}` | `0ms` | 鍵盤焦點切換、高頻率資料表列游標移動、無障礙減敏模式。 |
| **`fast`** | `duration-fast` | `--system-motion-duration-fast` | `{global.duration.01}` | `50ms` | 按鈕、選單項目與表格列的 Hover / Active 背景色與邊框變換。 |
| **`normal`** | `duration-normal` | `--system-motion-duration-normal` | `{global.duration.02}` | `100ms` | Checkbox 勾選指示、Switch 切換、Tooltip 與下拉選單展開。 |
| **`slow`** | `duration-slow` | `--system-motion-duration-slow` | `{global.duration.03}` | `150ms` | 手風琴面板（Accordion）收合、Popover 淡入淡出。 |
| **`slower`** | `duration-slower` | `--system-motion-duration-slower` | `{global.duration.04}` | `200ms` | 側邊欄（Sidebar）、抽屜（Drawer）與模態對話框（Modal）進出場。 |

---

## 緩動曲線 (`system.motion.easing.*`)

| Token Key | UnoCSS 工具類別 | CSS Variable | Global 參照 | 貝茲曲線座標 (`cubic-bezier`) | 典型應用場景 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`default`** | `ease-default` | `--system-motion-easing-default` | `{global.easing.standard}` | `cubic-bezier(0.2, 0, 0, 1)` | 畫面內元素的位移、尺寸調整與色彩過渡預設曲線。 |
| **`enter`** | `ease-enter` | `--system-motion-easing-enter` | `{global.easing.enter}` | `cubic-bezier(0, 0, 0.15, 1)` | 元素進入畫面（Modal、Dropdown、Toast 出現），初速快、結尾平緩定位。 |
| **`exit`** | `ease-exit` | `--system-motion-easing-exit` | `{global.easing.exit}` | `cubic-bezier(0.3, 0, 1, 1)` | 元素離開畫面（關閉選單、移除通知），乾脆俐落收尾。 |
| **`linear`** | `ease-linear` | `--system-motion-easing-linear` | `{global.easing.linear}` | `cubic-bezier(0, 0, 1, 1)` | 純透明度變化（Opacity）、進度條與旋轉載入指示器。 |
