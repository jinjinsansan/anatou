import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow, GreenCTA, GoldCard, GradientGold, GradientGoldOnly } from "@/components/ui";
import { COLORS, GRADIENTS } from "@/lib/design-tokens";
import { getSession } from "@/lib/session";
import { fetchTodayPattern } from "@/lib/predictions";
import type { DailyPattern, RecommendationRace } from "@/types";

const LINE_OFFICIAL_ID = process.env.LINE_OFFICIAL_ACCOUNT_ID ?? "@770clfua";

export const metadata = {
  title: "本日の本命",
};

export const dynamic = "force-dynamic";

interface SearchParams {
  searchParams: Promise<{ need_friend?: string }>;
}

export default async function TodayPage({ searchParams }: SearchParams) {
  const session = await getSession();
  if (!session.user) {
    redirect("/login");
  }
  const params = await searchParams;
  const needFriend = params.need_friend === "1" || !session.user.isFriend;

  if (needFriend) {
    return (
      <>
        <div className="hidden md:block">
          <DesktopNeedFriend displayName={session.user.displayName} />
        </div>
        <div className="block md:hidden">
          <MobileNeedFriend displayName={session.user.displayName} />
        </div>
      </>
    );
  }

  let pattern: DailyPattern | null = null;
  try {
    pattern = await fetchTodayPattern();
  } catch (e) {
    console.error("[/today] fetchTodayPattern failed", e);
  }

  const races = pattern?.recommendations ?? [];
  const sortedRaces = races
    .slice()
    .sort((a, b) => (a.startTime ?? "99:99").localeCompare(b.startTime ?? "99:99"));

  // 該当なし or 配信対象外曜日 or 取得失敗
  if (!pattern || !pattern.isLayer1Day || races.length === 0) {
    return (
      <>
        <div className="hidden md:block">
          <DesktopEmpty pattern={pattern} />
        </div>
        <div className="block md:hidden">
          <MobileEmpty pattern={pattern} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <DesktopRaces pattern={pattern} races={sortedRaces} />
      </div>
      <div className="block md:hidden">
        <MobileRaces pattern={pattern} races={sortedRaces} />
      </div>
    </>
  );
}

/* ============================================================
 * Helpers
 * ============================================================ */

function formatDateLabel(yyyymmdd: string, weekday: string): string {
  if (yyyymmdd.length !== 8) return weekday;
  const m = parseInt(yyyymmdd.slice(4, 6), 10);
  const d = parseInt(yyyymmdd.slice(6, 8), 10);
  return `${m}月 ${d}日 (${weekday})`;
}

function formatDateShort(yyyymmdd: string, weekday: string): string {
  if (yyyymmdd.length !== 8) return weekday;
  const m = parseInt(yyyymmdd.slice(4, 6), 10);
  const d = parseInt(yyyymmdd.slice(6, 8), 10);
  return `${m}/${d} (${weekday})`;
}

/* ============================================================
 * Desktop — Races (本命あり)
 * ============================================================ */

function DesktopRaces({
  pattern,
  races,
}: {
  pattern: DailyPattern;
  races: RecommendationRace[];
}) {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink, minHeight: "100vh" }}>
      <Header isLoggedIn active="today" />

      {/* Sub-hero */}
      <section
        style={{
          position: "relative",
          padding: "80px 56px 50px",
          overflow: "hidden",
          borderBottom: `1px solid ${COLORS.line}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -80,
            width: 600,
            height: 600,
            opacity: 0.12,
            maskImage: "radial-gradient(circle at center, black 40%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 70%)",
          }}
        >
          <Image
            src="/images/patternA_icon.png"
            alt=""
            fill
            sizes="600px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div style={{ position: "relative" }}>
          <Eyebrow dot>TODAY · {formatDateShort(pattern.date, pattern.weekday)} · 配信中</Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 72,
              fontWeight: 800,
              margin: "20px 0 0",
              lineHeight: 1.1,
            }}
          >
            <GradientGold>本日の本命</GradientGold>
          </h1>
          <p
            style={{
              marginTop: 14,
              fontSize: 14,
              color: COLORS.inkSoft,
              letterSpacing: ".05em",
            }}
          >
            {formatDateLabel(pattern.date, pattern.weekday)} · NAR本命厳格パターン該当{" "}
            <strong style={{ color: COLORS.gold }}>{races.length} 件</strong>
          </p>

          <div
            style={{
              marginTop: 36,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
              maxWidth: 880,
            }}
          >
            <StatBox label="RACES TODAY" big={`0${races.length}`.slice(-2)} note="各 単勝 100円 固定" />
            <StatBox label="EXPECTED · 2MO" big="396.9%" note="過去2ヶ月実績 回収率" />
            <StatBox label="BUDGET" big={`¥${races.length * 100}`} note="本日の合計投資額" />
          </div>
        </div>
      </section>

      {/* Race list */}
      <section style={{ padding: "60px 56px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <Eyebrow>RECOMMENDATIONS</Eyebrow>
          <div style={{ fontSize: 12, color: COLORS.inkMute }}>発走時刻順</div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {races.map((r, i) => (
            <DesktopRaceRow key={r.raceId} index={i + 1} race={r} />
          ))}
        </div>

        <div
          style={{
            marginTop: 40,
            padding: 24,
            borderRadius: 14,
            border: `1px dashed ${COLORS.line}`,
            fontSize: 13,
            color: COLORS.inkMute,
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
          本命 1点で投資額をカバーする運用前提です。外れる日もあります。投資判断はご自身で。
        </div>
      </section>

      <Footer />
    </div>
  );
}

function DesktopRaceRow({ index, race }: { index: number; race: RecommendationRace }) {
  return (
    <div
      style={{
        padding: "28px 32px",
        borderRadius: 16,
        background: "linear-gradient(135deg, rgba(230,185,74,.08), rgba(230,185,74,.02))",
        border: `1px solid ${COLORS.goldSoft}`,
        display: "grid",
        gridTemplateColumns: "60px 200px 1fr 200px",
        gap: 32,
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-roman)",
          fontSize: 56,
          fontWeight: 500,
          color: COLORS.gold,
          lineHeight: 1,
        }}
      >
        {`0${index}`.slice(-2)}
      </div>

      <div>
        <div style={{ fontSize: 11, color: COLORS.inkMute, letterSpacing: ".2em" }}>
          VENUE / RACE
        </div>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 24,
            fontWeight: 700,
            marginTop: 4,
          }}
        >
          {race.venue} {race.raceNumber}R
        </div>
        <div style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 4 }}>
          発走 {race.startTime ?? "—"}
        </div>
      </div>

      <div style={{ borderLeft: `1px solid ${COLORS.line}`, paddingLeft: 28 }}>
        <div
          style={{
            fontSize: 11,
            color: COLORS.gold,
            letterSpacing: ".2em",
            fontWeight: 700,
          }}
        >
          ◎ 本命
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 6 }}>
          <div
            style={{
              fontFamily: "var(--font-roman)",
              fontSize: 48,
              fontWeight: 600,
              color: COLORS.ink,
              lineHeight: 1,
            }}
          >
            {race.consensus.horseNumber}
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {race.consensus.horseName}
            </div>
            <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 4 }}>
              {race.popularityRank ? `${race.popularityRank}番人気` : "—"} · 独自AI 4基中{" "}
              <strong style={{ color: COLORS.gold }}>{race.consensus.agreedCount}基</strong> 一致
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11, color: COLORS.inkMute, letterSpacing: ".2em" }}>BUY</div>
        <div
          style={{
            fontFamily: "var(--font-roman)",
            fontSize: 32,
            fontWeight: 600,
            color: COLORS.gold,
          }}
        >
          単勝 ¥100
        </div>
        <div style={{ fontSize: 11, color: COLORS.inkMute, marginTop: 4 }}>1点固定</div>
      </div>
    </div>
  );
}

function StatBox({ label, big, note }: { label: string; big: string; note: string }) {
  return (
    <GoldCard>
      <Eyebrow>{label}</Eyebrow>
      <div
        style={{
          fontFamily: "var(--font-roman)",
          fontSize: 56,
          fontWeight: 500,
          lineHeight: 1,
          marginTop: 4,
          color: COLORS.gold,
        }}
      >
        {big}
      </div>
      <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 4 }}>{note}</div>
    </GoldCard>
  );
}

/* ============================================================
 * Desktop — Empty (該当なし or 配信対象外曜日)
 * ============================================================ */

function DesktopEmpty({ pattern }: { pattern: DailyPattern | null }) {
  const dateLabel = pattern ? formatDateShort(pattern.date, pattern.weekday) : "—";
  const isOffDay = pattern && !pattern.isLayer1Day;
  const message = !pattern
    ? "情報を取得できませんでした。しばらく経ってからリロードしてください。"
    : isOffDay
    ? `${pattern.weekday}曜は本命厳格パターンの対象外です。`
    : "条件を厳格に絞っているため、該当しない日もあります。";

  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink, minHeight: "100vh" }}>
      <Header isLoggedIn active="today" />
      <section style={{ position: "relative", padding: "100px 56px 80px", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            right: -200,
            top: -120,
            width: 700,
            height: 700,
            opacity: 0.08,
            maskImage: "radial-gradient(circle at center, black 40%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 70%)",
          }}
        >
          <Image
            src="/images/patternA_icon.png"
            alt=""
            fill
            sizes="700px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div style={{ position: "relative", maxWidth: 720 }}>
          <Eyebrow dot>TODAY · {dateLabel} · 配信なし</Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 72,
              fontWeight: 800,
              margin: "20px 0 0",
              lineHeight: 1.1,
            }}
          >
            本日は
            <br />
            <GradientGoldOnly>該当なし</GradientGoldOnly>です。
          </h1>
          <p style={{ marginTop: 22, fontSize: 16, lineHeight: 2, color: COLORS.inkSoft }}>
            {message}
            <br />
            「いつでも当てる」を装わず、勝てる根拠が立つ日だけに絞るのが本サービスの方針です。
          </p>
          <GoldCard style={{ marginTop: 36, padding: 24 }}>
            <Eyebrow>NEXT DELIVERY</Eyebrow>
            <div
              style={{
                marginTop: 10,
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              次は火・水・木のいずれか
            </div>
            <div style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 4 }}>
              対象日の朝、本ページに本命が掲載されます
            </div>
          </GoldCard>
        </div>
      </section>
      <Footer />
    </div>
  );
}

/* ============================================================
 * Desktop — NeedFriend
 * ============================================================ */

function DesktopNeedFriend({ displayName }: { displayName: string }) {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink, minHeight: "100vh" }}>
      <Header isLoggedIn active="today" />
      <section style={{ position: "relative", padding: "100px 56px 80px", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            right: -180,
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
        <div style={{ position: "relative", maxWidth: 720 }}>
          <Eyebrow dot>STEP 02 / 02 · ほぼ完了</Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 72,
              fontWeight: 800,
              margin: "20px 0 0",
              lineHeight: 1.1,
            }}
          >
            あと<GradientGoldOnly>一歩</GradientGoldOnly>です。
          </h1>
          <p style={{ marginTop: 22, fontSize: 16, lineHeight: 2, color: COLORS.inkSoft }}>
            ようこそ、<strong style={{ color: COLORS.gold }}>{displayName}</strong> さん。<br />
            本命を表示するには、
            <strong style={{ color: COLORS.gold }}>公式LINEの友だち追加</strong>が必要です。
            <br />
            追加後、もう一度ログインし直すと判定が更新されます。
          </p>

          <div
            style={{
              marginTop: 36,
              padding: 32,
              borderRadius: 16,
              background: "linear-gradient(135deg, rgba(230,185,74,.08), rgba(230,185,74,.02))",
              border: `1px solid ${COLORS.goldSoft}`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 24,
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  公式アカウントを友だち追加
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.8 }}>
                  火水木の朝に「本命配信中」のお知らせが届きます。
                  <br />
                  メッセージ通知だけ。営業案内などは送りません。
                </div>
              </div>
              <FriendAddButton />
            </div>
            <div
              style={{
                marginTop: 20,
                paddingTop: 20,
                borderTop: `1px solid ${COLORS.line}`,
                fontSize: 12,
                color: COLORS.inkMute,
              }}
            >
              → 友だち追加後、
              <Link
                href="/login"
                style={{ color: COLORS.gold, textDecoration: "underline" }}
              >
                再ログイン
              </Link>
              してください。
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function FriendAddButton({ size = "lg" }: { size?: "lg" | "md" }) {
  return (
    <a
      href={`https://line.me/R/ti/p/${encodeURIComponent(LINE_OFFICIAL_ID)}`}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: size === "lg" ? "18px 30px" : "14px 22px",
        borderRadius: 999,
        background: COLORS.green,
        color: "#fff",
        fontWeight: 800,
        fontSize: size === "lg" ? 16 : 14,
        boxShadow: "0 12px 40px rgba(6,199,85,.4)",
        textDecoration: "none",
      }}
    >
      公式LINEを友だち追加
    </a>
  );
}

/* ============================================================
 * Mobile
 * ============================================================ */

function MobileRaces({
  pattern,
  races,
}: {
  pattern: DailyPattern;
  races: RecommendationRace[];
}) {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink, minHeight: "100vh" }}>
      <Header isLoggedIn active="today" />
      <section
        style={{
          position: "relative",
          padding: "32px 16px 24px",
          overflow: "hidden",
          borderBottom: `1px solid ${COLORS.line}`,
        }}
      >
        <Eyebrow dot size="sm">
          TODAY · {formatDateShort(pattern.date, pattern.weekday)} · 配信中
        </Eyebrow>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 36,
            fontWeight: 800,
            margin: "12px 0 0",
            lineHeight: 1.1,
          }}
        >
          <GradientGold>本日の本命</GradientGold>
        </h1>
        <p style={{ marginTop: 8, fontSize: 12, color: COLORS.inkSoft }}>
          {formatDateLabel(pattern.date, pattern.weekday)} ·{" "}
          <strong style={{ color: COLORS.gold }}>{races.length}件</strong>
        </p>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              border: `1px solid ${COLORS.goldSoft}`,
            }}
          >
            <Eyebrow size="sm">RECOVERY</Eyebrow>
            <div
              style={{
                fontFamily: "var(--font-roman)",
                fontSize: 28,
                fontWeight: 500,
                color: COLORS.gold,
                lineHeight: 1,
                marginTop: 4,
              }}
            >
              396.9%
            </div>
          </div>
          <div
            style={{
              padding: 12,
              borderRadius: 10,
              border: `1px solid ${COLORS.goldSoft}`,
            }}
          >
            <Eyebrow size="sm">BUDGET</Eyebrow>
            <div
              style={{
                fontFamily: "var(--font-roman)",
                fontSize: 28,
                fontWeight: 500,
                color: COLORS.gold,
                lineHeight: 1,
                marginTop: 4,
              }}
            >
              ¥{races.length * 100}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "24px 16px" }}>
        <Eyebrow size="sm">RECOMMENDATIONS</Eyebrow>
        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {races.map((r, i) => (
            <MobileRaceRow key={r.raceId} index={i + 1} race={r} />
          ))}
        </div>
        <div
          style={{
            marginTop: 24,
            padding: 14,
            borderRadius: 10,
            border: `1px dashed ${COLORS.line}`,
            fontSize: 11,
            color: COLORS.inkMute,
            textAlign: "center",
            lineHeight: 1.7,
          }}
        >
          本命1点で投資額をカバーする運用前提です。投資判断はご自身で。
        </div>
      </section>
      <Footer />
    </div>
  );
}

function MobileRaceRow({ index, race }: { index: number; race: RecommendationRace }) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 12,
        background: "linear-gradient(135deg, rgba(230,185,74,.08), rgba(230,185,74,.02))",
        border: `1px solid ${COLORS.goldSoft}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            fontFamily: "var(--font-roman)",
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.gold,
            lineHeight: 1,
          }}
        >
          {`0${index}`.slice(-2)}
        </div>
        <div style={{ fontSize: 11, color: COLORS.inkMute }}>発走 {race.startTime ?? "—"}</div>
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: "var(--font-serif)",
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {race.venue} {race.raceNumber}R
      </div>
      <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 10 }}>
        <span
          style={{
            fontFamily: "var(--font-roman)",
            fontSize: 32,
            fontWeight: 600,
            color: COLORS.ink,
            lineHeight: 1,
          }}
        >
          {race.consensus.horseNumber}
        </span>
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {race.consensus.horseName}
        </span>
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: COLORS.inkSoft }}>
        {race.popularityRank ? `${race.popularityRank}番人気` : "—"} · AI 4基中{" "}
        <strong style={{ color: COLORS.gold }}>{race.consensus.agreedCount}基</strong> 一致
      </div>
      <div
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: `1px solid ${COLORS.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 10, color: COLORS.inkMute, letterSpacing: ".2em" }}>BUY</span>
        <span
          style={{
            fontFamily: "var(--font-roman)",
            fontSize: 20,
            fontWeight: 600,
            color: COLORS.gold,
          }}
        >
          単勝 ¥100
        </span>
      </div>
    </div>
  );
}

function MobileEmpty({ pattern }: { pattern: DailyPattern | null }) {
  const dateLabel = pattern ? formatDateShort(pattern.date, pattern.weekday) : "—";
  const isOffDay = pattern && !pattern.isLayer1Day;
  const message = !pattern
    ? "情報を取得できませんでした。"
    : isOffDay
    ? `${pattern.weekday}曜は本命厳格パターンの対象外です。`
    : "条件を厳格に絞っているため、該当しない日もあります。";

  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink, minHeight: "100vh" }}>
      <Header isLoggedIn active="today" />
      <section style={{ padding: "40px 16px" }}>
        <Eyebrow dot size="sm">
          TODAY · {dateLabel} · 配信なし
        </Eyebrow>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 36,
            fontWeight: 800,
            margin: "14px 0 0",
            lineHeight: 1.1,
          }}
        >
          本日は
          <br />
          <GradientGoldOnly>該当なし</GradientGoldOnly>です。
        </h1>
        <p style={{ marginTop: 16, fontSize: 13, lineHeight: 1.9, color: COLORS.inkSoft }}>
          {message}
        </p>
        <GoldCard style={{ marginTop: 24, padding: 16 }}>
          <Eyebrow size="sm">NEXT DELIVERY</Eyebrow>
          <div
            style={{
              marginTop: 6,
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            次は火・水・木のいずれか
          </div>
        </GoldCard>
      </section>
      <Footer />
    </div>
  );
}

function MobileNeedFriend({ displayName }: { displayName: string }) {
  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink, minHeight: "100vh" }}>
      <Header isLoggedIn active="today" />
      <section style={{ padding: "40px 16px" }}>
        <Eyebrow dot size="sm">
          STEP 02 / 02 · ほぼ完了
        </Eyebrow>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 36,
            fontWeight: 800,
            margin: "14px 0 0",
            lineHeight: 1.1,
          }}
        >
          あと<GradientGoldOnly>一歩</GradientGoldOnly>です。
        </h1>
        <p style={{ marginTop: 16, fontSize: 13, lineHeight: 1.9, color: COLORS.inkSoft }}>
          ようこそ、<strong style={{ color: COLORS.gold }}>{displayName}</strong> さん。
          <br />
          公式LINE の友だち追加で完了です。
        </p>
        <div
          style={{
            marginTop: 24,
            padding: 18,
            borderRadius: 14,
            background: "linear-gradient(135deg, rgba(230,185,74,.08), rgba(230,185,74,.02))",
            border: `1px solid ${COLORS.goldSoft}`,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            公式アカウントを友だち追加
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: COLORS.inkSoft, lineHeight: 1.7 }}>
            火水木の朝に「本命配信中」のお知らせが届きます。
          </div>
          <div style={{ marginTop: 16 }}>
            <FriendAddButton size="md" />
          </div>
          <div
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: `1px solid ${COLORS.line}`,
              fontSize: 11,
              color: COLORS.inkMute,
            }}
          >
            → 友だち追加後、
            <Link href="/login" style={{ color: COLORS.gold, textDecoration: "underline" }}>
              再ログイン
            </Link>
            してください。
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
