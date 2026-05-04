import { COLORS } from "@/lib/design-tokens";
import { CurrentYear } from "./CurrentYear";

export function Footer() {
  return (
    <footer
      style={{
        marginTop: "auto",
        borderTop: `1px solid ${COLORS.line}`,
        textAlign: "center",
        letterSpacing: ".05em",
        color: COLORS.inkMute,
      }}
    >
      <div className="hidden md:block" style={{ padding: "30px 56px", fontSize: 11 }}>
        <FooterContent />
      </div>
      <div className="block md:hidden" style={{ padding: "24px 20px", fontSize: 10, lineHeight: 1.7 }}>
        <FooterContent compact />
      </div>
    </footer>
  );
}

function FooterContent({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <div style={{ marginBottom: 6, color: COLORS.inkSoft, fontWeight: 700 }}>穴党参謀AI</div>
      {compact ? (
        <>情報提供のみ。投資判断はご自身で。<br /></>
      ) : (
        <>本サービスは情報提供を目的としており、馬券の購入を強制するものではありません。投資判断はご自身の責任で行ってください。<br /></>
      )}
      <span style={{ color: "rgba(244,239,226,.3)" }}>© <CurrentYear /> 穴党参謀AI</span>
    </>
  );
}
