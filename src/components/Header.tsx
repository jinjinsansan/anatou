import Link from "next/link";
import Image from "next/image";
import { COLORS } from "@/lib/design-tokens";

const BRAND_PREFIX = "穴党参謀";
const BRAND_SUFFIX = "AI";

type ActiveKey = "" | "today" | "results" | "about";

interface Props {
  isLoggedIn?: boolean;
  active?: ActiveKey;
  variant?: "default" | "overlay";
}

export function Header({ isLoggedIn = false, active = "", variant = "default" }: Props) {
  const isOverlay = variant === "overlay";

  // Overlay variant: hero画像の上に重ねる用 (TOP のみ)
  const overlayWrapperStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  };

  const stickyWrapperStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 40,
    background: "rgba(10,10,12,.92)",
    backdropFilter: "blur(8px)",
    borderBottom: `1px solid ${COLORS.line}`,
  };

  return (
    <header style={isOverlay ? overlayWrapperStyle : stickyWrapperStyle}>
      <div className="hidden md:flex" style={desktopRowStyle}>
        <BrandMark />
        <DesktopNav isLoggedIn={isLoggedIn} active={active} />
      </div>
      <div className="flex md:hidden" style={mobileRowStyle}>
        <BrandMark mobile />
        <MobileMenuButton />
      </div>
    </header>
  );
}

const desktopRowStyle: React.CSSProperties = {
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px 56px",
};

const mobileRowStyle: React.CSSProperties = {
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 16px",
};

function BrandMark({ mobile = false }: { mobile?: boolean }) {
  const size = mobile ? 28 : 36;
  const fontSize = mobile ? 13.5 : 16;
  return (
    <Link
      href="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: mobile ? 9 : 12,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Image
        src="/images/patternA_icon.png"
        alt=""
        width={size}
        height={size}
        priority
        style={{ borderRadius: mobile ? 6 : 8 }}
      />
      <div style={{ fontWeight: 900, fontSize, letterSpacing: ".02em" }}>
        {BRAND_PREFIX}
        <span style={{ color: COLORS.gold }}>{BRAND_SUFFIX}</span>
      </div>
    </Link>
  );
}

function DesktopNav({ isLoggedIn, active }: { isLoggedIn: boolean; active: ActiveKey }) {
  const items: { k: ActiveKey; label: string; href: string }[] = [
    { k: "today", label: "本日の本命", href: "/today" },
    { k: "results", label: "的中実績", href: "/results" },
    { k: "about", label: "運用ルール", href: "/about" },
  ];

  return (
    <nav style={{ display: "flex", gap: 28, alignItems: "center", fontSize: 13 }}>
      {items.map((it) => (
        <Link
          key={it.k}
          href={it.href}
          style={{
            color: active === it.k ? COLORS.gold : COLORS.inkSoft,
            borderBottom:
              active === it.k ? `1px solid ${COLORS.gold}` : "1px solid transparent",
            paddingBottom: 4,
            textDecoration: "none",
          }}
        >
          {it.label}
        </Link>
      ))}
      {isLoggedIn ? (
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            style={{
              background: "none",
              border: "none",
              color: COLORS.inkMute,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            ログアウト
          </button>
        </form>
      ) : (
        <Link
          href="/login"
          style={{
            padding: "9px 20px",
            borderRadius: 999,
            border: `1px solid ${COLORS.gold}`,
            color: COLORS.gold,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          ログイン
        </Link>
      )}
    </nav>
  );
}

/** モバイル: ハンバーガー風アイコン (現状はデコのみ、機能拡張は後で) */
function MobileMenuButton() {
  return (
    <Link
      href="/login"
      aria-label="メニュー / ログイン"
      style={{
        width: 38,
        height: 38,
        borderRadius: 8,
        border: `1px solid ${COLORS.goldSoft}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <span style={{ width: 16, height: 1.5, background: COLORS.gold }} />
      <span style={{ width: 16, height: 1.5, background: COLORS.gold }} />
    </Link>
  );
}
