import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow, GoldCard, GradientGoldOnly } from "@/components/ui";
import { COLORS, GRADIENTS } from "@/lib/design-tokens";
import { getSession } from "@/lib/session";
import { fetchHistory } from "@/lib/predictions";
import type { HistoryRace, HistoryReport, HistoryMonthly } from "@/types";

const LINE_OFFICIAL_ID = process.env.LINE_OFFICIAL_ACCOUNT_ID ?? "@770clfua";

export const metadata = { title: "的中実績" };
export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const session = await getSession();

  if (!session.user) redirect("/login");

  if (!session.user.isFriend) {
    return (
      <>
        <Header isLoggedIn />
        <main className="flex-1" style={{ background: COLORS.bg, color: COLORS.ink }}>
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
            <Eyebrow dot>MEMBERS ONLY</Eyebrow>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 800, margin: "16px 0 12px" }}>
              あと一歩です
            </h1>
            <p style={{ fontSize: 14, color: COLORS.inkSoft, lineHeight: 1.8, marginBottom: 32 }}>
              実績を表示するには公式LINEの友だち追加が必要です。
            </p>
            <a
              href={`https://line.me/R/ti/p/${encodeURIComponent(LINE_OFFICIAL_ID)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 28px", borderRadius: 999,
                background: COLORS.green, color: "#fff", fontWeight: 800, fontSize: 15,
                textDecoration: "none",
              }}
            >
              公式LINEを友だち追加
            </a>
            <div style={{ marginTop: 20 }}>
              <Link href="/login" style={{ fontSize: 13, color: COLORS.gold }}>
                → 友だち追加後、再ログイン
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  let report: HistoryReport | null = null;
  let fetchError = false;
  try {
    report = await fetchHistory();
  } catch (e) {
    console.error("[/results] fetchHistory failed", e);
    fetchError = true;
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <DesktopResults isLoggedIn report={report} fetchError={fetchError} />
      </div>
      {/* Mobile */}
      <div className="block md:hidden">
        <MobileResults isLoggedIn report={report} fetchError={fetchError} />
      </div>
    </>
  );
}

/* ============================================================
 * Desktop
 * ============================================================ */
function DesktopResults({
  isLoggedIn,
  report,
  fetchError,
}: {
  isLoggedIn: boolean;
  report: HistoryReport | null;
  fetchError: boolean;
}) {
  const s = report?.summary;
  const maxRecovery = report ? Math.max(...report.monthly.map((m) => m.recoveryPct)) : 100;

  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink }}>
      <Header isLoggedIn={isLoggedIn} active="results" />

      {/* Hero — 累計サマリ主役 */}
      <section
        style={{
          position: "relative",
          padding: "80px 56px 60px",
          overflow: "hidden",
          borderBottom: `1px solid ${COLORS.line}`,
        }}
      >
        {/* watermark icon */}
        <div
          style={{
            position: "absolute", right: -180, top: -120,
            width: 720, height: 720,
            backgroundImage: "url(/images/patternA_icon.png)",
            backgroundSize: "cover",
            opacity: 0.12,
            maskImage: "radial-gradient(circle at center, black 35%, transparent 65%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 35%, transparent 65%)",
            borderRadius: "50%",
          }}
        />

        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 56, alignItems: "center" }}>
          {/* Left */}
          <div>
            <Eyebrow dot>TRACK RECORD · ALL TIME · LIVE</Eyebrow>
            <h1
              style={{
                fontFamily: "var(--font-serif)", fontSize: 88, fontWeight: 800,
                lineHeight: 1, margin: "20px 0 0", letterSpacing: "-.02em",
              }}
            >
              <span
                style={{
                  background: GRADIENTS.goldText,
                  WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
                }}
              >
                的中実績
              </span>
            </h1>
            <p style={{ marginTop: 22, fontSize: 15, lineHeight: 1.95, color: COLORS.inkSoft, maxWidth: 480 }}>
              全期間の本命厳格パターン（火・水・木のみ配信）における、
              <strong style={{ color: COLORS.gold }}>全レース・全結果の透明公開</strong>です。
              都合の良い切り抜きはしません。
            </p>
            <div style={{ marginTop: 30, display: "flex", gap: 32, alignItems: "baseline" }}>
              <div>
                <div style={{ fontSize: 9.5, color: COLORS.inkMute, letterSpacing: ".22em", fontWeight: 700 }}>UNIT</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 700, marginTop: 2 }}>
                  単勝 ¥100 / 各本命固定
                </div>
              </div>
              <div style={{ width: 1, height: 32, background: COLORS.line }} />
              <div>
                <div style={{ fontSize: 9.5, color: COLORS.inkMute, letterSpacing: ".22em", fontWeight: 700 }}>SOURCE</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 700, marginTop: 2 }}>
                  Layer 1 全件 · 自動集計
                </div>
              </div>
            </div>
          </div>

          {/* Right: recovery stat card */}
          <div
            style={{
              position: "relative", padding: "44px 36px", borderRadius: 20,
              background: "linear-gradient(135deg, rgba(230,185,74,.16), rgba(230,185,74,.04) 50%, rgba(7,7,8,.6))",
              border: `1px solid ${COLORS.goldSoft}`,
              backdropFilter: "blur(12px)",
              boxShadow: "0 24px 60px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.04)",
            }}
          >
            <Eyebrow>RECOVERY · CUMULATIVE</Eyebrow>
            <div
              style={{
                fontFamily: "var(--font-roman)", fontSize: 168, fontWeight: 500,
                lineHeight: 0.9, marginTop: 12, letterSpacing: "-.04em", fontStyle: "italic",
                background: `linear-gradient(180deg, ${COLORS.gold} 0%, ${COLORS.goldDeep} 100%)`,
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              }}
            >
              {s ? s.recoveryPct.toFixed(1) : "—"}
              <span style={{ fontSize: 64, fontStyle: "normal" }}>%</span>
            </div>
            <div
              style={{
                marginTop: 18, paddingTop: 18, borderTop: `1px solid ${COLORS.line}`,
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14,
              }}
            >
              <MiniStat label="INVEST" value={s ? fmtYen(s.invest) : "—"} />
              <MiniStat label="PAYOUT" value={s ? fmtYen(s.payout) : "—"} />
              <MiniStat label="PROFIT" value={s ? `+${fmtYen(s.profit)}` : "—"} highlight />
            </div>
          </div>
        </div>
      </section>

      {fetchError && (
        <div style={{ padding: "24px 56px", color: "#e94560", fontSize: 14 }}>
          実績データを取得できませんでした。しばらく経ってからリロードしてください。
        </div>
      )}

      {report && (
        <>
          {/* KPI strip */}
          <section
            style={{
              padding: "44px 56px", borderBottom: `1px solid ${COLORS.line}`,
              background: "linear-gradient(180deg, rgba(230,185,74,.04), transparent)",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0 }}>
              {[
                { l: "TOTAL", v: String(report.summary.nTotal), sub: "RACES" },
                { l: "FINISHED", v: String(report.summary.nFinished), sub: "確定済み" },
                { l: "HITS", v: String(report.summary.hits), sub: "的中" },
                { l: "HIT RATE", v: `${report.summary.hitRatePct.toFixed(1)}%`, sub: "的中率" },
                { l: "PROFIT", v: `+${fmtYen(report.summary.profit)}`, sub: "累計収支", hi: true },
                { l: "RECOVERY", v: `${report.summary.recoveryPct.toFixed(1)}%`, sub: "回収率", hi: true },
              ].map((k, i) => (
                <div
                  key={i}
                  style={{ padding: "8px 24px", borderLeft: i === 0 ? "none" : `1px solid ${COLORS.line}` }}
                >
                  <div style={{ fontSize: 9.5, color: COLORS.gold, letterSpacing: ".22em", fontWeight: 700 }}>{k.l}</div>
                  <div
                    style={{
                      fontFamily: "var(--font-roman)", fontSize: 44, fontWeight: 500,
                      lineHeight: 1, marginTop: 8, color: k.hi ? COLORS.gold : COLORS.ink,
                    }}
                  >
                    {k.v}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.inkSoft, marginTop: 6, letterSpacing: ".05em" }}>{k.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Monthly */}
          {report.monthly.length > 0 && (
            <section style={{ padding: "60px 56px", borderBottom: `1px solid ${COLORS.line}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
                <div>
                  <Eyebrow>SECTION · 01</Eyebrow>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)", fontSize: 38, fontWeight: 700,
                      margin: "8px 0 0", letterSpacing: "-.01em",
                    }}
                  >
                    月別の<GradientGoldOnly>軌跡</GradientGoldOnly>
                  </h2>
                </div>
                <div style={{ fontSize: 11, color: COLORS.inkMute, letterSpacing: ".18em", fontWeight: 700 }}>
                  {report.monthly.length} MONTHS
                </div>
              </div>

              {/* Bar chart */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${report.monthly.length}, 1fr)`,
                  gap: 18, marginBottom: 32,
                }}
              >
                {report.monthly.map((m) => {
                  const h = (m.recoveryPct / maxRecovery) * 100;
                  return (
                    <div key={m.ym} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ fontFamily: "var(--font-roman)", fontSize: 22, fontWeight: 600, color: COLORS.gold, lineHeight: 1 }}>
                        {m.recoveryPct.toFixed(0)}<span style={{ fontSize: 12 }}>%</span>
                      </div>
                      <div
                        style={{
                          width: "100%", height: 160, marginTop: 10,
                          position: "relative", background: "rgba(230,185,74,.04)",
                          borderRadius: 6, overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                            height: `${h}%`,
                            background: `linear-gradient(180deg, ${COLORS.gold} 0%, ${COLORS.goldDeep} 100%)`,
                            borderRadius: "6px 6px 0 0",
                            boxShadow: "0 -4px 16px rgba(230,185,74,.3)",
                          }}
                        />
                      </div>
                      <div style={{ marginTop: 12, fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 700 }}>
                        {fmtYm(m.ym)}
                      </div>
                      <div style={{ fontSize: 10.5, color: COLORS.inkMute, marginTop: 2 }}>
                        {m.hits}/{m.n} 的中
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Monthly table */}
              <div
                style={{
                  borderRadius: 14, border: `1px solid ${COLORS.goldSoft}`,
                  overflow: "hidden",
                  background: "linear-gradient(135deg, rgba(230,185,74,.04), transparent)",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "rgba(230,185,74,.06)" }}>
                      {["月", "該当", "的中", "投資", "払戻", "収支", "回収率"].map((h, i) => (
                        <th
                          key={i}
                          style={{
                            padding: "14px 20px", textAlign: i === 0 ? "left" : "right",
                            fontSize: 9.5, color: COLORS.gold, letterSpacing: ".2em", fontWeight: 700,
                            borderBottom: `1px solid ${COLORS.goldSoft}`,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.monthly.map((m, i) => (
                      <MonthlyRow key={m.ym} m={m} first={i === 0} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Race history */}
          {report.races.length > 0 && (
            <section style={{ padding: "60px 56px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
                <div>
                  <Eyebrow>SECTION · 02</Eyebrow>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)", fontSize: 38, fontWeight: 700,
                      margin: "8px 0 0", letterSpacing: "-.01em",
                    }}
                  >
                    全レース<GradientGoldOnly>履歴</GradientGoldOnly>
                  </h2>
                  <p style={{ marginTop: 8, fontSize: 12, color: COLORS.inkSoft }}>
                    外れも含め全件公開
                  </p>
                </div>
              </div>

              <div style={{ borderRadius: 14, border: `1px solid ${COLORS.line}`, overflow: "hidden" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 120px 100px 1fr 80px 90px 140px 110px",
                    padding: "12px 24px",
                    background: "rgba(230,185,74,.06)",
                    fontSize: 9.5, color: COLORS.gold, letterSpacing: ".2em", fontWeight: 700,
                    borderBottom: `1px solid ${COLORS.goldSoft}`,
                  }}
                >
                  <div>DATE</div>
                  <div>VENUE</div>
                  <div>NO.</div>
                  <div>HORSE</div>
                  <div style={{ textAlign: "center" }}>POP</div>
                  <div style={{ textAlign: "center" }}>AI</div>
                  <div style={{ textAlign: "center" }}>RESULT</div>
                  <div style={{ textAlign: "right" }}>PROFIT</div>
                </div>
                {report.races.map((r, i) => (
                  <RaceRowDesktop key={`${r.date}-${r.venue}-${r.raceNumber}-${i}`} race={r} striped={i % 2 === 1} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Disclaimer */}
      <section style={{ padding: "0 56px 60px" }}>
        <div
          style={{
            padding: "20px 28px", borderRadius: 12,
            border: `1px dashed ${COLORS.line}`,
            fontSize: 11.5, color: COLORS.inkMute, lineHeight: 1.9, textAlign: "center",
          }}
        >
          本命1点 単勝¥100固定の運用前提です。<br />
          過去のデータに基づく数値であり、将来の利益を保証するものではありません。投資判断はご自身の責任で。
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ============================================================
 * Mobile
 * ============================================================ */
function MobileResults({
  isLoggedIn,
  report,
  fetchError,
}: {
  isLoggedIn: boolean;
  report: HistoryReport | null;
  fetchError: boolean;
}) {
  const s = report?.summary;
  const maxRecovery = report ? Math.max(...report.monthly.map((m) => m.recoveryPct)) : 100;

  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink }}>
      <Header isLoggedIn={isLoggedIn} active="results" />

      {/* Hero */}
      <section
        style={{
          position: "relative", padding: "44px 20px 28px",
          overflow: "hidden", borderBottom: `1px solid ${COLORS.line}`,
        }}
      >
        <div
          style={{
            position: "absolute", right: -100, top: -60,
            width: 360, height: 360,
            backgroundImage: "url(/images/patternA_icon.png)",
            backgroundSize: "cover",
            opacity: 0.12,
            maskImage: "radial-gradient(circle at center, black 40%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div style={{ position: "relative" }}>
          <Eyebrow dot size="sm">TRACK RECORD · ALL TIME</Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-serif)", fontSize: 44, fontWeight: 800,
              margin: "14px 0 0", lineHeight: 1.05,
            }}
          >
            <span
              style={{
                background: GRADIENTS.goldText,
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              }}
            >
              的中実績
            </span>
          </h1>
          <p style={{ marginTop: 10, fontSize: 12.5, color: COLORS.inkSoft, lineHeight: 1.8 }}>
            全期間・全件公開。火水木の本命厳格パターン。
          </p>

          {/* Hero stat card */}
          <div
            style={{
              marginTop: 22, padding: "26px 22px", borderRadius: 16,
              background: "linear-gradient(135deg, rgba(230,185,74,.16), rgba(230,185,74,.04))",
              border: `1px solid ${COLORS.goldSoft}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 9, color: COLORS.gold, letterSpacing: ".22em", fontWeight: 700 }}>
              RECOVERY · CUMULATIVE
            </div>
            <div
              style={{
                fontFamily: "var(--font-roman)", fontSize: 92, fontWeight: 500,
                lineHeight: 0.95, marginTop: 8, fontStyle: "italic",
                background: `linear-gradient(180deg, ${COLORS.gold} 0%, ${COLORS.goldDeep} 100%)`,
                WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              }}
            >
              {s ? s.recoveryPct.toFixed(1) : "—"}
              <span style={{ fontSize: 36, fontStyle: "normal" }}>%</span>
            </div>
            <div
              style={{
                marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.line}`,
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6,
              }}
            >
              {[
                ["INVEST", s ? fmtYen(s.invest) : "—", false],
                ["PAYOUT", s ? fmtYen(s.payout) : "—", false],
                ["PROFIT", s ? `+${fmtYen(s.profit)}` : "—", true],
              ].map(([k, v, hi], i) => (
                <div key={i}>
                  <div style={{ fontSize: 8, color: COLORS.inkMute, letterSpacing: ".18em", fontWeight: 700 }}>{k as string}</div>
                  <div
                    style={{
                      fontFamily: "var(--font-roman)", fontSize: 14, fontWeight: 600,
                      marginTop: 2, color: hi ? "#5edc7a" : COLORS.ink,
                    }}
                  >
                    {v as string}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12, fontSize: 9.5, color: COLORS.inkMute, textAlign: "center", letterSpacing: ".1em" }}>
            単勝¥100固定
          </div>
        </div>
      </section>

      {fetchError && (
        <div style={{ padding: "16px 20px", color: "#e94560", fontSize: 13 }}>
          データを取得できませんでした。リロードしてください。
        </div>
      )}

      {report && (
        <>
          {/* KPI 2x2 */}
          <section style={{ padding: "28px 16px", borderBottom: `1px solid ${COLORS.line}` }}>
            <Eyebrow size="sm">SUMMARY</Eyebrow>
            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { l: "TOTAL", v: String(report.summary.nTotal), sub: "該当レース" },
                { l: "HITS", v: String(report.summary.hits), sub: "的中件数" },
                { l: "HIT RATE", v: `${report.summary.hitRatePct.toFixed(1)}%`, sub: "的中率" },
                { l: "RECOVERY", v: `${report.summary.recoveryPct.toFixed(1)}%`, sub: "回収率" },
              ].map((k, i) => (
                <div key={i}>
                  <div style={{ fontSize: 9, color: COLORS.gold, letterSpacing: ".22em", fontWeight: 700 }}>{k.l}</div>
                  <div
                    style={{
                      fontFamily: "var(--font-roman)", fontSize: 36, fontWeight: 500,
                      lineHeight: 1, marginTop: 4,
                    }}
                  >
                    {k.v}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.inkSoft, marginTop: 4 }}>{k.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Monthly bars + cards */}
          {report.monthly.length > 0 && (
            <section style={{ padding: "32px 16px", borderBottom: `1px solid ${COLORS.line}` }}>
              <Eyebrow size="sm">SECTION · 01</Eyebrow>
              <h2
                style={{
                  fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 700,
                  margin: "8px 0 18px",
                }}
              >
                月別の<GradientGoldOnly>軌跡</GradientGoldOnly>
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${report.monthly.length}, 1fr)`,
                  gap: 8, marginBottom: 20,
                }}
              >
                {report.monthly.map((m) => {
                  const h = (m.recoveryPct / maxRecovery) * 100;
                  return (
                    <div key={m.ym} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ fontFamily: "var(--font-roman)", fontSize: 14, fontWeight: 600, color: COLORS.gold }}>
                        {m.recoveryPct.toFixed(0)}%
                      </div>
                      <div
                        style={{
                          width: "100%", height: 110, marginTop: 6,
                          background: "rgba(230,185,74,.04)", borderRadius: 4,
                          position: "relative", overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute", bottom: 0, left: 0, right: 0,
                            height: `${h}%`,
                            background: `linear-gradient(180deg, ${COLORS.gold} 0%, ${COLORS.goldDeep} 100%)`,
                            borderRadius: "4px 4px 0 0",
                          }}
                        />
                      </div>
                      <div style={{ marginTop: 8, fontFamily: "var(--font-serif)", fontSize: 12, fontWeight: 700 }}>
                        {fmtYm(m.ym)}
                      </div>
                      <div style={{ fontSize: 9, color: COLORS.inkMute, marginTop: 1 }}>
                        {m.hits}/{m.n}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                {report.monthly.map((m) => (
                  <div
                    key={m.ym}
                    style={{
                      padding: "12px 14px", borderRadius: 10,
                      background: "linear-gradient(135deg, rgba(230,185,74,.06), transparent)",
                      border: `1px solid ${COLORS.goldSoft}`,
                      display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, fontWeight: 700 }}>{fmtYm(m.ym)}</div>
                      <div style={{ fontSize: 10, color: COLORS.inkSoft, marginTop: 2 }}>
                        {m.hits}/{m.n} 的中 · {fmtYen(m.invest)}投資
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 8.5, color: COLORS.inkMute, letterSpacing: ".18em" }}>PROFIT</div>
                      <div
                        style={{
                          fontFamily: "var(--font-roman)", fontSize: 13, fontWeight: 600,
                          color: m.profit >= 0 ? "#5edc7a" : "#e94560",
                        }}
                      >
                        {m.profit >= 0 ? "+" : "−"}{fmtYen(m.profit)}
                      </div>
                    </div>
                    <div style={{ fontFamily: "var(--font-roman)", fontSize: 22, fontWeight: 600, color: COLORS.gold }}>
                      {m.recoveryPct.toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Race history */}
          {report.races.length > 0 && (
            <section style={{ padding: "32px 16px" }}>
              <Eyebrow size="sm">SECTION · 02</Eyebrow>
              <h2
                style={{
                  fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 700,
                  margin: "8px 0 14px",
                }}
              >
                全レース<GradientGoldOnly>履歴</GradientGoldOnly>
              </h2>

              <div style={{ display: "grid", gap: 8 }}>
                {report.races.map((r, i) => (
                  <RaceRowMobile key={`${r.date}-${r.venue}-${r.raceNumber}-${i}`} race={r} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Disclaimer */}
      <section style={{ padding: "0 16px 32px" }}>
        <div
          style={{
            padding: 14, borderRadius: 10, border: `1px dashed ${COLORS.line}`,
            fontSize: 10.5, color: COLORS.inkMute, lineHeight: 1.8, textAlign: "center",
          }}
        >
          単勝¥100固定の運用前提。過去数値は将来の利益を保証しません。
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ============================================================
 * Shared atoms
 * ============================================================ */
function MiniStat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: COLORS.inkMute, letterSpacing: ".22em", fontWeight: 700 }}>{label}</div>
      <div
        style={{
          fontFamily: "var(--font-roman)", fontSize: 19, fontWeight: 600, marginTop: 4,
          color: highlight ? "#5edc7a" : COLORS.ink,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function MonthlyRow({ m, first }: { m: HistoryMonthly; first: boolean }) {
  return (
    <tr style={{ borderTop: first ? "none" : `1px solid ${COLORS.line}` }}>
      <td style={{ padding: "16px 20px", fontFamily: "var(--font-serif)", fontWeight: 700, fontSize: 15 }}>
        {fmtYm(m.ym)}
      </td>
      <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-roman)", fontSize: 15 }}>{m.n}</td>
      <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-roman)", fontSize: 15 }}>{m.hits}</td>
      <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-roman)", color: COLORS.inkSoft }}>
        {fmtYen(m.invest)}
      </td>
      <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-roman)" }}>
        {fmtYen(m.payout)}
      </td>
      <td
        style={{
          padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-roman)",
          color: m.profit >= 0 ? "#5edc7a" : "#e94560", fontWeight: 600,
        }}
      >
        {m.profit >= 0 ? "+" : "−"}{fmtYen(m.profit)}
      </td>
      <td
        style={{
          padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-roman)",
          fontSize: 17, fontWeight: 600, color: COLORS.gold,
        }}
      >
        {m.recoveryPct.toFixed(1)}%
      </td>
    </tr>
  );
}

function RaceRowDesktop({ race, striped }: { race: HistoryRace; striped: boolean }) {
  const isWin = race.resultKnown && race.won;
  const isMiss = race.resultKnown && !race.won;
  const popText = race.popularityRank ? `${race.popularityRank}人気` : "—";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "100px 120px 100px 1fr 80px 90px 140px 110px",
        padding: "16px 24px", alignItems: "center",
        background: striped ? "rgba(230,185,74,.02)" : "transparent",
        borderTop: `1px solid ${COLORS.line}`,
        borderLeft: isWin ? `3px solid ${COLORS.gold}` : "3px solid transparent",
      }}
    >
      <div style={{ fontFamily: "var(--font-roman)", fontSize: 14, color: COLORS.inkSoft }}>
        {fmtDate(race.date)}
        <span style={{ marginLeft: 4, fontSize: 11, color: COLORS.inkMute }}>({race.weekday})</span>
      </div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, fontWeight: 700 }}>
        {race.venue} <span style={{ color: COLORS.gold }}>{race.raceNumber}R</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: COLORS.gold, fontSize: 14 }}>◎</span>
        <span style={{ fontFamily: "var(--font-roman)", fontSize: 18, fontWeight: 600 }}>{race.horseNumber}</span>
      </div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 14, fontWeight: 700 }}>{race.horseName}</div>
      <div style={{ textAlign: "center", fontSize: 11, color: COLORS.inkSoft }}>{popText}</div>
      <div style={{ textAlign: "center" }}>
        <span style={{ fontSize: 11, fontFamily: "var(--font-roman)", color: COLORS.gold, fontWeight: 600 }}>
          {race.agreedCount}/4
        </span>
      </div>
      <div style={{ textAlign: "center" }}>
        {isWin ? (
          <span
            style={{
              display: "inline-block", padding: "5px 12px", borderRadius: 999,
              background: "rgba(94,220,122,.12)", border: "1px solid rgba(94,220,122,.4)",
              color: "#5edc7a", fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em",
            }}
          >
            ✓ 的中 {fmtYen(race.payout)}
          </span>
        ) : isMiss ? (
          <span style={{ fontSize: 11, color: COLORS.inkMute, letterSpacing: ".1em" }}>外れ</span>
        ) : (
          <span style={{ fontSize: 11, color: COLORS.inkMute, letterSpacing: ".1em" }}>未確定</span>
        )}
      </div>
      <div
        style={{
          textAlign: "right", fontFamily: "var(--font-roman)", fontSize: 14, fontWeight: 600,
          color: race.profit !== null && race.profit > 0 ? "#5edc7a" : COLORS.inkMute,
        }}
      >
        {race.profit === null ? "—" : `${race.profit > 0 ? "+" : race.profit < 0 ? "−" : ""}${fmtYen(race.profit)}`}
      </div>
    </div>
  );
}

function RaceRowMobile({ race }: { race: HistoryRace }) {
  const isWin = race.resultKnown && race.won;
  const isMiss = race.resultKnown && !race.won;

  return (
    <div
      style={{
        padding: "12px 14px", borderRadius: 10,
        background: isWin
          ? "linear-gradient(135deg, rgba(94,220,122,.07), rgba(230,185,74,.03))"
          : "rgba(20,18,16,.4)",
        border: `1px solid ${isWin ? "rgba(94,220,122,.25)" : COLORS.line}`,
        borderLeft: isWin ? "3px solid #5edc7a" : `1px solid ${COLORS.line}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontFamily: "var(--font-roman)", fontSize: 12, color: COLORS.inkSoft }}>
          {fmtDate(race.date)}
          <span style={{ marginLeft: 3, fontSize: 10, color: COLORS.inkMute }}>({race.weekday})</span>
          <span style={{ marginLeft: 8, fontFamily: "var(--font-serif)", color: COLORS.ink, fontWeight: 700 }}>
            {race.venue}
          </span>
          <span style={{ marginLeft: 5, color: COLORS.gold, fontFamily: "var(--font-serif)", fontWeight: 700 }}>
            {race.raceNumber}R
          </span>
        </div>
        <div
          style={{
            fontFamily: "var(--font-roman)", fontSize: 13, fontWeight: 600,
            color: race.profit !== null && race.profit > 0 ? "#5edc7a" : COLORS.inkMute,
          }}
        >
          {race.profit === null ? "—" : `${race.profit > 0 ? "+" : race.profit < 0 ? "−" : ""}${fmtYen(race.profit)}`}
        </div>
      </div>
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: COLORS.gold, fontSize: 13 }}>◎</span>
        <span style={{ fontFamily: "var(--font-roman)", fontSize: 17, fontWeight: 600 }}>{race.horseNumber}</span>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 13.5, fontWeight: 700, flex: 1 }}>{race.horseName}</span>
        {isWin && (
          <span
            style={{
              padding: "3px 9px", borderRadius: 999,
              background: "rgba(94,220,122,.15)", border: "1px solid rgba(94,220,122,.4)",
              color: "#5edc7a", fontSize: 9.5, fontWeight: 700, letterSpacing: ".1em",
            }}
          >
            ✓ 的中
          </span>
        )}
        {isMiss && (
          <span style={{ fontSize: 10, color: COLORS.inkMute, letterSpacing: ".1em" }}>外れ</span>
        )}
      </div>
      <div style={{ marginTop: 5, fontSize: 10, color: COLORS.inkMute, letterSpacing: ".05em" }}>
        {race.popularityRank}番人気 · AI{" "}
        <span style={{ color: COLORS.gold }}>{race.agreedCount}/4</span>一致
        {isWin && (
          <> · 払戻 <span style={{ color: "#5edc7a" }}>{fmtYen(race.payout)}</span></>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Utilities
 * ============================================================ */
function fmtYen(n: number): string {
  return `¥${Math.abs(n).toLocaleString()}`;
}

function fmtDate(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return yyyymmdd;
  const m = yyyymmdd.slice(4, 6).replace(/^0/, "");
  const d = yyyymmdd.slice(6, 8).replace(/^0/, "");
  return `${m}/${d}`;
}

function fmtYm(ym: string): string {
  const [y, m] = ym.split("-");
  return `${y}.${m}`;
}
