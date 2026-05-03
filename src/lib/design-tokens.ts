// ============================================================
// 穴党参謀AI デザイントークン (C案: シネマティック・黒×ゴールド)
// 全UI共通の色・フォント・余白を一元管理
// ============================================================

export const COLORS = {
  bg: "#0a0a0c",
  bgDeep: "#070708",
  ink: "#f4efe2",
  inkSoft: "rgba(244,239,226,.75)",
  inkMute: "rgba(244,239,226,.5)",
  gold: "#e6b94a",
  goldDeep: "#a8801e",
  goldSoft: "rgba(230,185,74,.22)",
  line: "rgba(230,185,74,.18)",
  green: "#06C755",
} as const;

// グラデーション (CSS 文字列)
export const GRADIENTS = {
  goldText: `linear-gradient(135deg, #fff 0%, ${COLORS.gold} 70%, ${COLORS.goldDeep} 100%)`,
  goldSolid: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDeep})`,
  inkToGold: `linear-gradient(180deg, ${COLORS.ink} 0%, ${COLORS.gold} 100%)`,
} as const;

// フォント (next/font の variable で参照)
export const FONT_VARS = {
  sans: "var(--font-sans)",
  serif: "var(--font-serif)",
  roman: "var(--font-roman)",
} as const;
