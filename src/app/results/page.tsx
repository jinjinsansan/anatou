import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSession } from "@/lib/session";
import { fetchHistory } from "@/lib/predictions";
import type { HistoryRace, HistoryReport } from "@/types";

const LINE_OFFICIAL_ID = process.env.LINE_OFFICIAL_ACCOUNT_ID ?? "@770clfua";

export const metadata = {
  title: "的中実績",
};

export const dynamic = "force-dynamic";

/**
 * /results — 過去の Layer 1 全件履歴ページ。
 * デザインは後でリデザインするため、基礎構造のみ。
 *
 * セクション:
 *   - data-section="summary"  累計サマリ
 *   - data-section="monthly"  月別集計
 *   - data-section="races"    レース一覧
 */
export default async function ResultsPage() {
  const session = await getSession();

  // 認証ゲート: /today と同条件
  if (!session.user) {
    redirect("/login");
  }

  if (!session.user.isFriend) {
    return (
      <>
        <Header isLoggedIn />
        <main className="flex-1">
          <div className="max-w-xl mx-auto px-4 py-16">
            <h1 className="text-2xl font-bold text-center mb-2">
              <span className="brand-gradient">あと一歩です</span>
            </h1>
            <p className="text-center text-zinc-400 text-sm mb-8">
              実績を表示するには公式LINEの友だち追加が必要です。
            </p>
            <div className="text-center">
              <a
                href={`https://line.me/R/ti/p/${encodeURIComponent(LINE_OFFICIAL_ID)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-8 py-3 rounded bg-[#06C755] text-white font-bold"
              >
                公式LINEを友だち追加
              </a>
              <div className="mt-6">
                <Link href="/login" className="text-sm text-amber-300 hover:underline">
                  → 友だち追加後、再ログイン
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // 履歴取得（失敗してもページ自体は表示する）
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
      <Header isLoggedIn />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-black text-center mb-2">
            <span className="brand-gradient">的中実績</span>
          </h1>
          <p className="text-center text-zinc-500 text-sm mb-10">
            全期間の本命厳格パターン（火・水・木のみ配信）
          </p>

          {fetchError && (
            <p className="text-center text-rose-400 text-sm mb-6">
              実績データを取得できませんでした。しばらく経ってからリロードしてください。
            </p>
          )}

          {report && (
            <>
              <SummarySection report={report} />
              <MonthlySection report={report} />
              <RacesSection report={report} />
            </>
          )}

          <div className="mt-12 text-center text-xs text-zinc-500 space-y-1">
            <p>本命1点 単勝100円固定の運用前提です。</p>
            <p>過去の数値は将来の利益を保証するものではありません。</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ============================================================
 * Sections — マークアップは最小限。後でリデザインしやすいよう
 * data-section / data-field 属性で要素を識別できるように。
 * ============================================================ */

function SummarySection({ report }: { report: HistoryReport }) {
  const s = report.summary;
  const profitSign = s.profit >= 0 ? "+" : "";
  return (
    <section data-section="summary" className="mb-10">
      <h2 className="text-lg font-bold text-amber-300 mb-3">累計サマリ</h2>
      <dl className="rounded border border-zinc-800 p-4 grid grid-cols-2 gap-y-2 text-sm">
        <Item label="該当レース総数" value={`${s.nTotal}件`} field="nTotal" />
        <Item label="結果確定済み" value={`${s.nFinished}件`} field="nFinished" />
        <Item label="的中" value={`${s.hits}件 (${s.hitRatePct.toFixed(1)}%)`} field="hits" />
        <Item label="投資額" value={`¥${s.invest.toLocaleString()}`} field="invest" />
        <Item label="払戻総額" value={`¥${s.payout.toLocaleString()}`} field="payout" />
        <Item
          label="収支"
          value={`${profitSign}¥${s.profit.toLocaleString()}`}
          field="profit"
          highlight
        />
        <Item
          label="回収率"
          value={`${s.recoveryPct.toFixed(1)}%`}
          field="recoveryPct"
          highlight
        />
      </dl>
    </section>
  );
}

function MonthlySection({ report }: { report: HistoryReport }) {
  if (report.monthly.length === 0) return null;
  return (
    <section data-section="monthly" className="mb-10">
      <h2 className="text-lg font-bold text-amber-300 mb-3">月別集計</h2>
      <div className="overflow-x-auto rounded border border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900/50">
            <tr>
              <Th>月</Th>
              <Th align="right">該当</Th>
              <Th align="right">的中</Th>
              <Th align="right">投資</Th>
              <Th align="right">払戻</Th>
              <Th align="right">収支</Th>
              <Th align="right">回収率</Th>
            </tr>
          </thead>
          <tbody>
            {report.monthly.map((m) => {
              const profitSign = m.profit >= 0 ? "+" : "";
              return (
                <tr key={m.ym} className="border-t border-zinc-800">
                  <Td>{m.ym}</Td>
                  <Td align="right">{m.n}</Td>
                  <Td align="right">{m.hits}</Td>
                  <Td align="right">¥{m.invest.toLocaleString()}</Td>
                  <Td align="right">¥{m.payout.toLocaleString()}</Td>
                  <Td align="right">{profitSign}¥{m.profit.toLocaleString()}</Td>
                  <Td align="right">{m.recoveryPct.toFixed(1)}%</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RacesSection({ report }: { report: HistoryReport }) {
  if (report.races.length === 0) return null;
  return (
    <section data-section="races" className="mb-10">
      <h2 className="text-lg font-bold text-amber-300 mb-3">
        全レース履歴 ({report.races.length}件)
      </h2>
      <div className="space-y-2">
        {report.races.map((r, i) => (
          <RaceRow key={`${r.date}-${r.venue}-${r.raceNumber}-${i}`} race={r} />
        ))}
      </div>
    </section>
  );
}

function RaceRow({ race }: { race: HistoryRace }) {
  const popText = race.popularityRank ? `${race.popularityRank}番人気` : "";
  let outcomeBadge: React.ReactNode;
  if (!race.resultKnown) {
    outcomeBadge = <span className="text-xs text-zinc-500" data-field="outcome">未確定</span>;
  } else if (race.won) {
    outcomeBadge = (
      <span className="text-xs font-bold text-emerald-400" data-field="outcome">
        ✓ 的中 単勝¥{race.payout.toLocaleString()}
      </span>
    );
  } else {
    outcomeBadge = <span className="text-xs text-zinc-500" data-field="outcome">外れ</span>;
  }

  const profitText =
    race.profit === null ? "—" : (race.profit >= 0 ? `+¥${race.profit.toLocaleString()}` : `¥${race.profit.toLocaleString()}`);

  return (
    <div
      data-section="race-row"
      className="rounded border border-zinc-800 px-3 py-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
    >
      <span data-field="date" className="text-xs text-zinc-500 font-mono">
        {formatDate(race.date)}({race.weekday})
      </span>
      <span data-field="venue-race" className="text-zinc-300">
        {race.venue} {race.raceNumber}R
      </span>
      <span data-field="horse" className="font-bold">
        ◎{race.horseNumber}.{race.horseName}
      </span>
      {popText && (
        <span data-field="popularity" className="text-xs text-zinc-500">
          ({popText})
        </span>
      )}
      <span data-field="agreed" className="text-xs text-zinc-500">
        {race.agreedCount}基一致
      </span>
      <span className="ml-auto flex items-center gap-3">
        {outcomeBadge}
        <span data-field="profit" className={race.profit !== null && race.profit >= 0 ? "text-emerald-400 font-mono text-xs" : "text-zinc-500 font-mono text-xs"}>
          {profitText}
        </span>
      </span>
    </div>
  );
}

/* Atom helpers */

function Item({
  label,
  value,
  field,
  highlight,
}: {
  label: string;
  value: string;
  field: string;
  highlight?: boolean;
}) {
  return (
    <>
      <dt className="text-zinc-500" data-field={`${field}-label`}>{label}</dt>
      <dd
        className={highlight ? "text-amber-300 font-bold text-right" : "text-zinc-200 text-right"}
        data-field={field}
      >
        {value}
      </dd>
    </>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      className={`px-3 py-2 text-zinc-400 font-medium text-xs ${align === "right" ? "text-right" : "text-left"}`}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <td className={`px-3 py-2 ${align === "right" ? "text-right" : "text-left"}`}>{children}</td>
  );
}

function formatDate(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) return yyyymmdd;
  const m = yyyymmdd.slice(4, 6).replace(/^0/, "");
  const d = yyyymmdd.slice(6, 8).replace(/^0/, "");
  return `${m}/${d}`;
}
