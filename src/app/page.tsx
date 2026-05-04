import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow, GreenCTA, GoldCard, GradientGold, GradientGoldOnly } from "@/components/ui";
import { COLORS, GRADIENTS } from "@/lib/design-tokens";
import { getSession } from "@/lib/session";

const STATS_RECOVERY = "396.9%";
const STATS_CI_LOWER = "225%";
const STATS_SAMPLES = "145";
const STATS_UNIT = "¥100";

export default async function HomePage() {
  const session = await getSession();
  const isLoggedIn = Boolean(session.user);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopTop isLoggedIn={isLoggedIn} />
      </div>
      {/* Mobile */}
      <div className="block md:hidden">
        <MobileTop isLoggedIn={isLoggedIn} />
      </div>
    </>
  );
}

/* ============================================================
 * Desktop (1280px design)
 * ============================================================ */

function DesktopTop({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink }}>
      {/* Hero: position:relativeのsection内にHeaderをabsoluteで重ねる。
          overflow:hiddenなし → Headerがクリッピングされない */}
      <section style={{ position: "relative", height: 820 }}>
        <Image
          src="/images/patternA_wallpaper.png"
          alt=""
          fill
          sizes="100vw"
          priority
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        {/* グラデーションオーバーレイ */}
        <div
          style={{
            position: "absolute", inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,10,12,.6) 0%, rgba(10,10,12,.2) 35%, rgba(10,10,12,.85) 80%, rgba(10,10,12,1) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, rgba(10,10,12,.7) 0%, transparent 50%)",
          }}
        />

        {/* Header: section内でtop:0にabsolute */}
        <Header isLoggedIn={isLoggedIn} variant="overlay" />

        {/* Hero content: sectionの下部に配置 */}
        <div
          style={{
            position: "absolute",
            left: 56, right: 56, bottom: 80,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 60,
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <Eyebrow dot>NAR · 火水木 · 会員限定無料</Eyebrow>
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 96,
                fontWeight: 800,
                lineHeight: 1.02,
                margin: "24px 0 0",
                letterSpacing: "-.01em",
              }}
            >
              <GradientGold>本命の、</GradientGold>
              <br />
              <span style={{ color: COLORS.ink }}>その一頭だけを。</span>
            </h1>
            <p
              style={{
                marginTop: 26,
                fontSize: 17,
                lineHeight: 1.85,
                color: COLORS.inkSoft,
                maxWidth: 540,
              }}
            >
              独自AIの合議シグナルから条件を満たした
              <strong style={{ color: COLORS.gold }}>本命のみ</strong>を厳選。 毎週
              <strong style={{ color: COLORS.gold }}>火・水・木</strong>に配信。
            </p>
            <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 24 }}>
              {!isLoggedIn ? (
                <>
                  <GreenCTA>LINEで会員登録 (無料)</GreenCTA>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        color: COLORS.gold,
                        fontWeight: 700,
                        letterSpacing: ".15em",
                      }}
                    >
                      FREE · NO PAYMENT
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.inkMute, marginTop: 4 }}>
                      月額課金や決済登録は一切ありません
                    </div>
                  </div>
                </>
              ) : (
                <GreenCTA href="/today">本日の本命を見る</GreenCTA>
              )}
            </div>
          </div>

            <NextDeliveryCard />
          </div>
        </section>

      {/* Stats strip */}
      <StatsStripDesktop />

      {/* Why */}
      <WhyDesktop />

      {/* How to use */}
      <HowToUseDesktop />

      <Footer />
    </div>
  );
}

function NextDeliveryCard() {
  return (
    <div
      style={{
        width: 280,
        padding: 24,
        borderRadius: 16,
        background: "rgba(20,18,16,.6)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${COLORS.goldSoft}`,
      }}
    >
      <Eyebrow>NEXT DELIVERY</Eyebrow>
      <div
        style={{
          marginTop: 10,
          fontFamily: "var(--font-serif)",
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.ink,
        }}
      >
        火 · 水 · 木
      </div>
      <div style={{ height: 1, background: COLORS.line, margin: "16px 0" }} />
      <Eyebrow>RECOVERY · 2MO</Eyebrow>
      <div
        style={{
          fontFamily: "var(--font-roman)",
          fontSize: 56,
          fontWeight: 500,
          lineHeight: 1,
          marginTop: 6,
          background: GRADIENTS.goldSolid,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {STATS_RECOVERY}
      </div>
      <div style={{ fontSize: 11, color: COLORS.inkMute, marginTop: 4 }}>
        n={STATS_SAMPLES} · 単勝100円固定
      </div>
    </div>
  );
}

function StatsStripDesktop() {
  const items = [
    { l: "回収率", v: STATS_RECOVERY, n: "RECOVERY RATE" },
    { l: "信頼区間下限", v: STATS_CI_LOWER, n: "95% CI LOWER" },
    { l: "サンプル", v: STATS_SAMPLES, n: "RACES · 2MO" },
    { l: "投資単位", v: STATS_UNIT, n: "UNIT FIXED" },
  ];
  return (
    <section style={{ padding: "60px 56px", borderBottom: `1px solid ${COLORS.line}` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 30 }}>
        <Eyebrow>TRACK RECORD</Eyebrow>
        <div style={{ fontSize: 12, color: COLORS.inkMute }}>過去2ヶ月のクリーンデータ</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        {items.map((x, i) => (
          <div key={i}>
            <div
              style={{ fontSize: 10, color: COLORS.inkMute, letterSpacing: ".25em" }}
            >
              {x.n}
            </div>
            <div
              style={{
                fontFamily: "var(--font-roman)",
                fontSize: 64,
                fontWeight: 500,
                marginTop: 4,
                lineHeight: 1,
                background: GRADIENTS.inkToGold,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {x.v}
            </div>
            <div style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 6 }}>{x.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyDesktop() {
  const cards = [
    {
      t: "統計的根拠",
      b: `サンプル${STATS_SAMPLES}件 / 回収率 ${STATS_RECOVERY} / Bootstrap 95% 信頼区間下限 ${STATS_CI_LOWER}。火水木 × 旧強5会場 × 独自AI 2-3基一致。`,
    },
    {
      t: "月・金は配信しません",
      b: "他曜日では同条件が揃わず、サンプル不足で安定した期待値を示せないため、あえて配信を見送ります。",
    },
    {
      t: "本命のみ・押し付けない",
      b: "買い目は単勝100円固定。1点で投資額をカバーする運用前提で、外れる日もあります。投資判断はあなた自身で。",
    },
  ];
  return (
    <section style={{ padding: "100px 56px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        <div>
          <Eyebrow>FEATURE · 01</Eyebrow>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 56,
              fontWeight: 700,
              margin: "12px 0 0",
              lineHeight: 1.15,
            }}
          >
            なぜ
            <br />
            <GradientGoldOnly>火水木</GradientGoldOnly>
            だけなのか
          </h2>
          <p
            style={{
              marginTop: 20,
              fontSize: 14,
              lineHeight: 2,
              color: COLORS.inkSoft,
              maxWidth: 460,
            }}
          >
            「いつでも当てる」を装わず、「ここしかない」だけを正直に届ける。
            統計的根拠のあるパターンに条件を絞り、それ以外は配信しません。
          </p>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {cards.map((c, i) => (
            <GoldCard key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: GRADIENTS.goldSolid,
                    color: COLORS.bg,
                    fontSize: 12,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-roman)",
                  }}
                >
                  {i + 1}
                </span>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: COLORS.gold }}>
                  {c.t}
                </h3>
              </div>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 13,
                  lineHeight: 1.85,
                  color: COLORS.inkSoft,
                }}
              >
                {c.b}
              </p>
            </GoldCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowToUseDesktop() {
  const steps = [
    { t: "LINE登録", s: "ログイン + 友だち追加（無料）" },
    { t: "アクセス", s: "火・水・木の朝、本命ページへ" },
    { t: "投票", s: "該当レースに単勝100円" },
    { t: "確認", s: "翌日、戦果サマリで結果と回収率" },
  ];
  return (
    <section
      style={{
        padding: "60px 56px 100px",
        borderTop: `1px solid ${COLORS.line}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 36,
        }}
      >
        <div>
          <Eyebrow>FEATURE · 02</Eyebrow>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 48,
              fontWeight: 700,
              margin: "10px 0 0",
            }}
          >
            使い方
          </h2>
        </div>
        <div style={{ fontSize: 12, color: COLORS.inkMute }}>4 STEPS · 約30秒</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              padding: 24,
              borderRadius: 14,
              background: "linear-gradient(180deg, rgba(230,185,74,.05), transparent)",
              border: `1px solid ${COLORS.goldSoft}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -10,
                fontFamily: "var(--font-roman)",
                fontSize: 110,
                fontWeight: 500,
                color: "rgba(230,185,74,.1)",
                lineHeight: 1,
              }}
            >
              {i + 1}
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 800,
                margin: 0,
                color: COLORS.gold,
                position: "relative",
              }}
            >
              STEP {String(i + 1).padStart(2, "0")}
            </h3>
            <div
              style={{
                marginTop: 12,
                fontFamily: "var(--font-serif)",
                fontSize: 22,
                fontWeight: 700,
                position: "relative",
              }}
            >
              {s.t}
            </div>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: 13,
                lineHeight: 1.7,
                color: COLORS.inkSoft,
                position: "relative",
              }}
            >
              {s.s}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
 * Mobile (375px design)
 * ============================================================ */

function MobileTop({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink }}>
      <Header isLoggedIn={isLoggedIn} />

      {/* Hero */}
      <section style={{ position: "relative", height: 560 }}>
        <Image
          src="/images/patternA_wallpaper.png"
          alt=""
          fill
          sizes="100vw"
          priority
          style={{ objectFit: "cover", objectPosition: "center 25%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(10,10,12,.55) 0%, rgba(10,10,12,.2) 25%, rgba(10,10,12,.88) 70%, rgba(10,10,12,1) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
            padding: "0 20px 32px",
          }}
        >
          <Eyebrow dot size="sm">
            NAR · 火水木 · 無料
          </Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1.05,
              margin: "16px 0 0",
            }}
          >
            <GradientGold>本命の、</GradientGold>
            <br />
            その一頭だけを。
          </h1>
          <p style={{ marginTop: 14, fontSize: 13.5, lineHeight: 1.8, color: COLORS.inkSoft }}>
            独自AIの合議シグナルから条件を満たした
            <strong style={{ color: COLORS.gold }}>本命のみ</strong>を厳選。 毎週
            <strong style={{ color: COLORS.gold }}>火・水・木</strong>に配信。
          </p>
          <div style={{ marginTop: 22 }}>
            {!isLoggedIn ? (
              <GreenCTA size="md" full>
                LINEで会員登録 (無料)
              </GreenCTA>
            ) : (
              <GreenCTA href="/today" size="md" full>
                本日の本命を見る
              </GreenCTA>
            )}
            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                color: COLORS.inkMute,
                textAlign: "center",
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: COLORS.gold, fontWeight: 700 }}>FREE · NO PAYMENT</span> ·
              月額課金なし
            </div>
          </div>
        </div>
      </section>

      {/* Quick stat card */}
      <section style={{ padding: "20px 16px 8px" }}>
        <div
          style={{
            padding: 18,
            borderRadius: 14,
            background: "rgba(20,18,16,.6)",
            border: `1px solid ${COLORS.goldSoft}`,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <Eyebrow size="sm">NEXT DELIVERY</Eyebrow>
              <div
                style={{
                  marginTop: 4,
                  fontFamily: "var(--font-serif)",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                火 · 水 · 木
              </div>
            </div>
            <div>
              <Eyebrow size="sm">RECOVERY · 2MO</Eyebrow>
              <div
                style={{
                  fontFamily: "var(--font-roman)",
                  fontSize: 30,
                  fontWeight: 500,
                  lineHeight: 1,
                  marginTop: 4,
                  background: GRADIENTS.goldSolid,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {STATS_RECOVERY}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats 2x2 */}
      <section style={{ padding: "30px 16px", borderBottom: `1px solid ${COLORS.line}` }}>
        <Eyebrow size="sm">TRACK RECORD</Eyebrow>
        <div style={{ fontSize: 11, color: COLORS.inkMute, marginTop: 4, marginBottom: 16 }}>
          過去2ヶ月のクリーンデータ
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { l: "回収率", v: STATS_RECOVERY, n: "RECOVERY" },
            { l: "信頼区間下限", v: STATS_CI_LOWER, n: "95% CI" },
            { l: "サンプル", v: STATS_SAMPLES, n: "RACES" },
            { l: "投資単位", v: STATS_UNIT, n: "UNIT" },
          ].map((x, i) => (
            <div key={i}>
              <div style={{ fontSize: 9, color: COLORS.inkMute, letterSpacing: ".22em" }}>
                {x.n}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-roman)",
                  fontSize: 36,
                  fontWeight: 500,
                  marginTop: 2,
                  lineHeight: 1,
                  background: GRADIENTS.inkToGold,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {x.v}
              </div>
              <div style={{ fontSize: 11, color: COLORS.inkSoft, marginTop: 4 }}>{x.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* なぜ火水木 */}
      <section style={{ padding: "40px 16px" }}>
        <Eyebrow size="sm">FEATURE · 01</Eyebrow>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 32,
            fontWeight: 700,
            margin: "10px 0 16px",
            lineHeight: 1.2,
          }}
        >
          なぜ<GradientGoldOnly>火水木</GradientGoldOnly>だけなのか
        </h2>
        <div style={{ display: "grid", gap: 10 }}>
          {[
            { t: "統計的根拠", b: `n=${STATS_SAMPLES}, 回収率${STATS_RECOVERY}, CI下限${STATS_CI_LOWER}` },
            { t: "月・金は配信しません", b: "サンプル不足で根拠が立たない曜日は配信を見送ります" },
            { t: "本命のみ・押し付けない", b: "単勝100円固定。投資判断はあなた自身で" },
          ].map((c, i) => (
            <GoldCard key={i} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    background: GRADIENTS.goldSolid,
                    color: COLORS.bg,
                    fontSize: 11,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-roman)",
                  }}
                >
                  {i + 1}
                </span>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: COLORS.gold }}>
                  {c.t}
                </h3>
              </div>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 12,
                  lineHeight: 1.7,
                  color: COLORS.inkSoft,
                }}
              >
                {c.b}
              </p>
            </GoldCard>
          ))}
        </div>
      </section>

      {/* 使い方 */}
      <section style={{ padding: "30px 16px 50px", borderTop: `1px solid ${COLORS.line}` }}>
        <Eyebrow size="sm">FEATURE · 02</Eyebrow>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 28,
            fontWeight: 700,
            margin: "10px 0 16px",
          }}
        >
          使い方
        </h2>
        <div style={{ display: "grid", gap: 10 }}>
          {[
            { t: "LINE登録", s: "ログイン + 友だち追加（無料）" },
            { t: "アクセス", s: "火・水・木の朝、本命ページへ" },
            { t: "投票", s: "該当レースに単勝100円" },
            { t: "確認", s: "翌日、戦果サマリで結果と回収率" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                padding: 14,
                borderRadius: 10,
                border: `1px solid ${COLORS.goldSoft}`,
                background: "linear-gradient(180deg, rgba(230,185,74,.05), transparent)",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-roman)",
                  fontSize: 26,
                  fontWeight: 500,
                  color: COLORS.gold,
                  width: 30,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  {s.t}
                </div>
                <div style={{ fontSize: 11, color: COLORS.inkSoft, marginTop: 2 }}>{s.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
