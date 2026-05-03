// ============================================================
// 共通UIプリミティブ (デスクトップ/モバイル両用)
// デザイントークン: src/lib/design-tokens.ts
// ============================================================
import Link from "next/link";
import { COLORS, GRADIENTS } from "@/lib/design-tokens";

export function LineGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.952 11.022c0-3.554-3.564-6.444-7.945-6.444s-7.946 2.89-7.946 6.444c0 3.184 2.825 5.852 6.642 6.355.258.056.61.171.7.391.08.2.052.514.025.717l-.114.681c-.035.201-.16.787.69.43.852-.358 4.583-2.7 6.252-4.62 1.152-1.262 1.696-2.541 1.696-3.954zm-10.74 1.901h-1.578c-.23 0-.418-.187-.418-.418V9.464c0-.23.187-.418.418-.418.23 0 .418.187.418.418v2.624h1.16c.232 0 .419.187.419.418 0 .23-.187.417-.419.417zm1.66-.418c0 .23-.187.418-.417.418-.231 0-.419-.187-.419-.418V9.464c0-.23.188-.418.419-.418.23 0 .417.187.417.418v3.041zm3.65 0c0 .18-.115.34-.286.397-.043.014-.088.021-.132.021-.131 0-.255-.062-.334-.167l-1.61-2.198v1.947c0 .23-.188.418-.42.418-.23 0-.417-.187-.417-.418V9.464c0-.18.115-.34.286-.397.043-.013.088-.021.132-.021.131 0 .256.063.334.167l1.61 2.198V9.464c0-.23.188-.418.419-.418.23 0 .418.188.418.418v3.041zm2.752-1.937c.231 0 .418.187.418.418 0 .23-.187.417-.418.417h-1.16v.685h1.16c.231 0 .418.188.418.419 0 .23-.187.417-.418.417h-1.578c-.23 0-.418-.187-.418-.417V9.464c0-.23.188-.418.418-.418h1.578c.231 0 .418.187.418.418 0 .23-.187.418-.418.418h-1.16v.686h1.16z" />
    </svg>
  );
}

export function Eyebrow({
  children,
  dot = false,
  size = "md",
}: {
  children: React.ReactNode;
  dot?: boolean;
  size?: "sm" | "md";
}) {
  const fontSize = size === "sm" ? 9.5 : 11;
  const padding = dot ? (size === "sm" ? "5px 11px" : "7px 14px") : 0;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size === "sm" ? 8 : 10,
        padding,
        borderRadius: 999,
        background: dot ? "rgba(230,185,74,.12)" : "transparent",
        border: dot ? `1px solid ${COLORS.goldSoft}` : "none",
        fontSize,
        color: COLORS.gold,
        letterSpacing: ".25em",
        fontWeight: 700,
      }}
    >
      {dot && (
        <span
          style={{
            width: size === "sm" ? 5 : 6,
            height: size === "sm" ? 5 : 6,
            borderRadius: 999,
            background: COLORS.gold,
          }}
        />
      )}
      {children}
    </div>
  );
}

export function GreenCTA({
  children,
  href = "/login",
  size = "lg",
  full = false,
}: {
  children: React.ReactNode;
  href?: string;
  size?: "lg" | "md" | "sm";
  full?: boolean;
}) {
  const styles: Record<string, { padding: string; fontSize: number; iconSize: number }> = {
    lg: { padding: "18px 30px", fontSize: 16, iconSize: 18 },
    md: { padding: "14px 22px", fontSize: 14, iconSize: 16 },
    sm: { padding: "13px 22px", fontSize: 14, iconSize: 16 },
  };
  const s = styles[size];
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: s.padding,
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        background: COLORS.green,
        color: "#fff",
        fontWeight: 800,
        fontSize: s.fontSize,
        boxShadow: "0 12px 40px rgba(6,199,85,.4)",
        textDecoration: "none",
        width: full ? "100%" : "auto",
      }}
    >
      <LineGlyph size={s.iconSize} />
      {children}
    </Link>
  );
}

export function GoldCard({
  children,
  style = {},
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 14,
        background: "linear-gradient(135deg, rgba(230,185,74,.06), rgba(230,185,74,.01))",
        border: `1px solid ${COLORS.goldSoft}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** タイトルなど、グラデーションゴールドのテキスト用 */
export function GradientGold({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: GRADIENTS.goldText,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}

export function GradientGoldOnly({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: GRADIENTS.goldSolid,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}
