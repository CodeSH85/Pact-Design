---
title: "Token 架構"
eyebrow: "Foundations · Specification"
description: "遵循 W3C DTCG 2025.10 規範的三層式語意架構、深淺主題雙檔案策略，以及 Style Dictionary v5 與 UnoCSS 動態編譯管線。"
order: 2
---

## W3C DTCG 2025.10 結構規範

所有位於 `tokens/**/*.json` 的原始檔案皆嚴格遵循 **W3C Design Tokens Community Group (DTCG) Format Module 2025.10** 標準：

- **結構化型別與數值**：每個終端 Token 節點皆明確定義 `$value` 與 `$type`（且 `$value` 固定排列於 `$type` 之前）。
- **巢狀階層取代連字號鍵名**：使用 JSON 物件巢狀結構（例如 `system.background.layer-1`、`global.font.size.04`）表達分類與階層。
- **保留參照鏈 (`outputReferences: true`)**：Style Dictionary v5 編譯時會保留 `{global.*}` 與 `{system.*}` 參照關係，轉譯為原生 CSS `var(--*)` 變數鏈，實現零執行期成本的動態主題切換。

```json
// tokens/color/global.json
{
  "global": {
    "indigo": {
      "500": {
        "$value": {
          "colorSpace": "oklch",
          "components": [0.6, 0.192, 274.9733],
          "alpha": 1,
          "hex": "#5c64eb"
        },
        "$type": "color"
      }
    }
  }
}

// tokens/color/system.light.json
{
  "system": {
    "semantic": {
      "primary": {
        "$value": "{global.indigo.500}",
        "$type": "color"
      }
    }
  }
}
```

---

## 深淺主題雙檔案策略

Pact Design 在 **System** 層級透過分離檔案實作主題切換：

- **100% 鍵名對稱（Key Parity）**：淺色與深色設定檔具備完全一致的 JSON 路徑與 Token 名稱，絕不將 `light` 或 `dark` 字樣寫入 Token 路徑中。
- **CSS 選擇器隔離**：
  - `tokens/*/global.json` + `tokens/*/system.light.json` 輸出至 `:root, [data-theme="light"]`
  - `tokens/*/system.dark.json` 輸出至 `[data-theme="dark"]`

```css
:root, [data-theme="light"] {
  --global-indigo-500: oklch(0.6 0.192 274.9733);
  --system-semantic-primary: var(--global-indigo-500);
  --system-on-surface-default: var(--global-gray-1000);
}

[data-theme="dark"] {
  --system-semantic-primary: var(--global-indigo-600);
  --system-on-surface-default: var(--global-white);
}
```

---

## 雙目標編譯管線 (CSS Variables & Dynamic UnoCSS Preset)

執行 `pnpm build:sd` 時，[`scripts/sd.config.js`](/scripts/sd.config.js) 與 [`scripts/unoCss.js`](/scripts/unoCss.js) 會從單一 Token 來源同步產出兩種產物：

1. **`build/css/_variables.css`**：包含所有 Global 與 System 層級的 CSS Custom Properties，並將複合型 Typography Token 自動展開為子屬性（`-font-family`、`-font-size`、`-font-weight`、`-line-height`、`-letter-spacing`）與 `font` 縮寫變數。
2. **`build/uno/preset.js` (`pactPreset`)**：無硬編碼鍵名的動態 UnoCSS / Tailwind 相容主題預設集，自動將 `system.*` 與 `global.*` 映射為原子化工具類別（如 `bg-layer-1`、`text-on-surface`、`text-heading-md`、`h-control-sm`、`p-md`、`rounded-xs`、`shadow-elevation-sm`）。
