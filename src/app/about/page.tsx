import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow, GoldCard, GradientGold } from "@/components/ui";
import { COLORS, GRADIENTS } from "@/lib/design-tokens";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "運用ルール",
};

export default async function AboutPage() {
  const session = await getSession();
  const isLoggedIn = Boolean(session.user);

  return (
    <>
      <div className="hidden md:block">
        <DesktopAbout isLoggedIn={isLoggedIn} />
      </div>
      <div className="block md:hidden">
        <MobileAbout isLoggedIn={isLoggedIn} />
      </div>
    </>
  );
}

const CONDITIONS: [string, string][] = [
  ["対象", "NAR（地方競馬）限定"],
  ["配信曜日", "火・水・木 のみ"],
  ["対象会場", "旧強5会場（園田／水沢／高知／笠松／金沢）"],
  ["出走頭数", "6〜12頭"],
  ["人気帯", "5〜8番人気"],
  ["AIシグナル", "独自AI 4基のうち 2〜3基が一致"],
];

const RECORDS = [
  { k: "サンプル数 (n)", v: "145", n: "RACES" },
  { k: "回収率", v: "396.9%", n: "RECOVERY", hi: true },
  { k: "CI 95% 下限", v: "225%", n: "BOOTSTRAP" },
  { k: "計測期間", v: "2026.03–04", n: "CLEAN DATA" },
];

const NOTES = [
  "本サービスは情報提供のみで、馬券購入を強制するものではありません",
  "投資判断は必ず自己責任でお願いします",
  "過去の数値は将来の利益を保証するものではありません",
  "20歳未満の方は馬券を購入できません",
];

const WEEKDAYS: [string, boolean][] = [
  ["月", false],
  ["火", true],
  ["水", true],
  ["木", true],
  ["金", false],
  ["土", false],
  ["日", false],
];

/* ============================================================
 * Desktop
 * ============================================================ */

function DesktopAbout({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink, minHeight: "100vh" }}>
      <Header isLoggedIn={isLoggedIn} active="about" />

      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "90px 56px 60px",
          overflow: "hidden",
          borderBottom: `1px solid ${COLORS.line}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -100,
            width: 640,
            height: 640,
            opacity: 0.1,
            maskImage: "radial-gradient(circle at center, black 40%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 70%)",
          }}
        >
          <Image
            src="/images/patternA_icon.png"
            alt=""
            fill
            sizes="640px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div style={{ position: "relative" }}>
          <Eyebrow>OPERATING RULES</Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 72,
              fontWeight: 800,
              margin: "16px 0 0",
              lineHeight: 1.1,
            }}
          >
            <GradientGold>運用ルール</GradientGold>
          </h1>
          <p style={{ marginTop: 16, fontSize: 14, color: COLORS.inkSoft }}>
            配信条件・買い方・実績の透明性について
          </p>
        </div>
      </section>

      {/* SECTION 01: 配信条件 */}
      <SectionDesktop num="01" title="配信条件">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {CONDITIONS.map(([k, v], i) => (
            <GoldCard key={i}>
              <div
                style={{
                  fontSize: 11,
                  color: COLORS.gold,
                  letterSpacing: ".2em",
                  fontWeight: 700,
                }}
              >
                {k.toUpperCase()}
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: "var(--font-serif)",
                  fontSize: 18,
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                {v}
              </div>
            </GoldCard>
          ))}
        </div>
      </SectionDesktop>

      {/* SECTION 02: 買い目 */}
      <SectionDesktop num="02" title="買い目">
        <GoldCard style={{ padding: 32 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <div
              style={{
                fontFamily: "var(--font-roman)",
                fontSize: 96,
                fontWeight: 500,
                lineHeight: 1,
                color: COLORS.gold,
              }}
            >
              ¥100
            </div>
            <div style={{ fontSize: 14, color: COLORS.inkSoft }}>単勝 / 各本命固定</div>
          </div>
          <p style={{ marginTop: 16, fontSize: 14, lineHeight: 1.9, color: COLORS.inkSoft }}>
            1日に複数件出ることもあれば、該当なしで配信ゼロの日もあります。
            ハイレートの単勝1点で、外れの日の{" "}
            <strong style={{ color: COLORS.gold }}>-100円</strong> を取り返す運用設計です。
          </p>
        </GoldCard>
      </SectionDesktop>

      {/* SECTION 03: 過去2ヶ月実績 */}
      <SectionDesktop num="03" title="過去2ヶ月実績">
        <div
          style={{
            padding: 32,
            borderRadius: 16,
            background: "linear-gradient(135deg, rgba(230,185,74,.1), rgba(230,185,74,.02))",
            border: `1px solid ${COLORS.goldSoft}`,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {RECORDS.map((x, i) => (
              <div
                key={i}
                style={{
                  borderLeft: i > 0 ? `1px solid ${COLORS.line}` : "none",
                  paddingLeft: i > 0 ? 24 : 0,
                }}
              >
                <div
                  style={{ fontSize: 10, color: COLORS.inkMute, letterSpacing: ".25em" }}
                >
                  {x.n}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-roman)",
                    fontSize: x.hi ? 56 : 36,
                    fontWeight: 500,
                    marginTop: 6,
                    lineHeight: 1,
                    color: x.hi ? COLORS.gold : COLORS.ink,
                  }}
                >
                  {x.v}
                </div>
                <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 6 }}>{x.k}</div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 10,
            border: `1px dashed ${COLORS.line}`,
            fontSize: 12,
            color: COLORS.inkMute,
            lineHeight: 1.8,
          }}
        >
          ※ leakage（学習データ汚染）を除去した clean データで計測。
          <br />※ 短期2ヶ月の数値は将来の利益を保証するものではありません。
        </div>
      </SectionDesktop>

      {/* SECTION 04: 月金土日 */}
      <SectionDesktop num="04" title="月・金・土・日 はなぜ配信しないか">
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {WEEKDAYS.map(([d, on], i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "14px 0",
                textAlign: "center",
                borderRadius: 8,
                fontFamily: "var(--font-serif)",
                fontSize: 22,
                fontWeight: 700,
                color: on ? COLORS.bg : COLORS.inkMute,
                background: on ? GRADIENTS.goldSolid : "transparent",
                border: on ? "none" : `1px solid ${COLORS.line}`,
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 14, lineHeight: 2, color: COLORS.inkSoft }}>
          月・金は同条件でのバックテストで{" "}
          <strong style={{ color: COLORS.gold }}>サンプル不足 + 統計的に黒字を確認できず</strong>
          、配信化の根拠がありません。 土・日は本サービスの対象外です。
          「いつでも当てる」を装わず、勝てる根拠が立つ曜日だけに絞るのが本サービスの方針です。
        </p>
      </SectionDesktop>

      {/* SECTION 05: 注意事項 */}
      <SectionDesktop num="05" title="重要な注意事項" lastSection>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
          {NOTES.map((t, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 14,
                padding: "16px 20px",
                borderRadius: 10,
                border: `1px solid ${COLORS.line}`,
                fontSize: 14,
                color: COLORS.inkSoft,
                lineHeight: 1.7,
              }}
            >
              <span
                style={{
                  color: COLORS.gold,
                  fontFamily: "var(--font-roman)",
                  fontWeight: 600,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </SectionDesktop>

      <Footer />
    </div>
  );
}

function SectionDesktop({
  num,
  title,
  children,
  lastSection,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
  lastSection?: boolean;
}) {
  return (
    <section
      style={{
        padding: lastSection ? "20px 56px 90px" : "70px 56px 0",
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: 60,
      }}
    >
      <div>
        <Eyebrow>SECTION · {num}</Eyebrow>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 36,
            fontWeight: 700,
            margin: "10px 0 0",
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

/* ============================================================
 * Mobile
 * ============================================================ */

function MobileAbout({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink, minHeight: "100vh" }}>
      <Header isLoggedIn={isLoggedIn} active="about" />

      {/* Hero */}
      <section style={{ padding: "32px 16px 24px", borderBottom: `1px solid ${COLORS.line}` }}>
        <Eyebrow size="sm">OPERATING RULES</Eyebrow>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 36,
            fontWeight: 800,
            margin: "12px 0 0",
            lineHeight: 1.1,
          }}
        >
          <GradientGold>運用ルール</GradientGold>
        </h1>
        <p style={{ marginTop: 8, fontSize: 12, color: COLORS.inkSoft }}>
          配信条件・買い方・実績の透明性について
        </p>
      </section>

      {/* 配信条件 */}
      <SectionMobile num="01" title="配信条件">
        <div style={{ display: "grid", gap: 8 }}>
          {CONDITIONS.map(([k, v], i) => (
            <GoldCard key={i} style={{ padding: 14 }}>
              <div
                style={{
                  fontSize: 10,
                  color: COLORS.gold,
                  letterSpacing: ".2em",
                  fontWeight: 700,
                }}
              >
                {k.toUpperCase()}
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: "var(--font-serif)",
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}
              >
                {v}
              </div>
            </GoldCard>
          ))}
        </div>
      </SectionMobile>

      {/* 買い目 */}
      <SectionMobile num="02" title="買い目">
        <GoldCard style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <div
              style={{
                fontFamily: "var(--font-roman)",
                fontSize: 56,
                fontWeight: 500,
                lineHeight: 1,
                color: COLORS.gold,
              }}
            >
              ¥100
            </div>
            <div style={{ fontSize: 12, color: COLORS.inkSoft }}>単勝 / 各本命固定</div>
          </div>
          <p style={{ marginTop: 10, fontSize: 12, lineHeight: 1.8, color: COLORS.inkSoft }}>
            ハイレートの単勝1点で、外れの日の-100円を取り返す運用設計です。
          </p>
        </GoldCard>
      </SectionMobile>

      {/* 実績 */}
      <SectionMobile num="03" title="過去2ヶ月実績">
        <GoldCard style={{ padding: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {RECORDS.map((x, i) => (
              <div key={i}>
                <div
                  style={{ fontSize: 9, color: COLORS.inkMute, letterSpacing: ".22em" }}
                >
                  {x.n}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-roman)",
                    fontSize: x.hi ? 36 : 24,
                    fontWeight: 500,
                    lineHeight: 1,
                    marginTop: 4,
                    color: x.hi ? COLORS.gold : COLORS.ink,
                  }}
                >
                  {x.v}
                </div>
                <div style={{ fontSize: 11, color: COLORS.inkSoft, marginTop: 4 }}>{x.k}</div>
              </div>
            ))}
          </div>
        </GoldCard>
        <div
          style={{
            marginTop: 10,
            padding: 12,
            borderRadius: 8,
            border: `1px dashed ${COLORS.line}`,
            fontSize: 11,
            color: COLORS.inkMute,
            lineHeight: 1.7,
          }}
        >
          ※ clean データで計測。<br />※ 過去数値は将来を保証しません。
        </div>
      </SectionMobile>

      {/* 月金土日 */}
      <SectionMobile num="04" title="月・金・土・日 はなぜ配信しないか">
        <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
          {WEEKDAYS.map(([d, on], i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "10px 0",
                textAlign: "center",
                borderRadius: 6,
                fontFamily: "var(--font-serif)",
                fontSize: 16,
                fontWeight: 700,
                color: on ? COLORS.bg : COLORS.inkMute,
                background: on ? GRADIENTS.goldSolid : "transparent",
                border: on ? "none" : `1px solid ${COLORS.line}`,
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, lineHeight: 1.9, color: COLORS.inkSoft }}>
          月・金はバックテストで黒字を確認できず、土・日 は本サービス対象外です。
          勝てる根拠が立つ曜日だけに絞るのが本サービスの方針です。
        </p>
      </SectionMobile>

      {/* 注意事項 */}
      <SectionMobile num="05" title="重要な注意事項" lastSection>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
          {NOTES.map((t, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 8,
                border: `1px solid ${COLORS.line}`,
                fontSize: 12,
                color: COLORS.inkSoft,
                lineHeight: 1.7,
              }}
            >
              <span
                style={{
                  color: COLORS.gold,
                  fontFamily: "var(--font-roman)",
                  fontWeight: 600,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </SectionMobile>

      <Footer />
    </div>
  );
}

function SectionMobile({
  num,
  title,
  children,
  lastSection,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
  lastSection?: boolean;
}) {
  return (
    <section
      style={{
        padding: lastSection ? "30px 16px 60px" : "30px 16px 0",
      }}
    >
      <Eyebrow size="sm">SECTION · {num}</Eyebrow>
      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 22,
          fontWeight: 700,
          margin: "8px 0 14px",
          lineHeight: 1.3,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
