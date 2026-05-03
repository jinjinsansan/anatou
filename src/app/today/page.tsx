import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSession } from "@/lib/session";
import { fetchTodayPattern } from "@/lib/predictions";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME ?? "穴党参謀AI";
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
        <Header isLoggedIn />
        <main className="flex-1">
          <div className="max-w-xl mx-auto px-4 py-16">
            <h1 className="text-2xl font-black text-center mb-2">
              <span className="brand-gradient">あと一歩です</span>
            </h1>
            <p className="text-center text-zinc-400 text-sm mb-8">
              {session.user.displayName} さん、ようこそ。<br />
              本命を表示するには、<strong className="text-amber-300">公式LINEの友だち追加</strong>が必要です。
            </p>
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 text-center">
              <p className="text-sm text-zinc-300 mb-6">
                公式アカウントを友だち追加すると、<br />
                火水木の朝に「本命配信中」のお知らせが届きます。
              </p>
              <a
                href={`https://line.me/R/ti/p/${encodeURIComponent(LINE_OFFICIAL_ID)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#06C755] hover:bg-[#05b94d] text-white font-bold shadow-lg transition-transform hover:scale-105"
              >
                公式LINEを友だち追加
              </a>
              <p className="text-xs text-zinc-500 mt-4">
                追加後、もう一度ログインし直すと判定が更新されます。
              </p>
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

  // 予想取得（失敗してもページ自体は表示する）
  let pattern;
  try {
    pattern = await fetchTodayPattern();
  } catch (e) {
    console.error("[/today] fetchTodayPattern failed", e);
  }

  return (
    <>
      <Header isLoggedIn />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-black text-center">
            <span className="brand-gradient">本日の本命</span>
          </h1>
          <p className="text-center text-zinc-500 text-sm mt-2">
            {pattern ? formatDateLabel(pattern.date, pattern.weekday) : "—"}
          </p>

          <div className="mt-10">
            {!pattern && (
              <Notice
                title="情報を取得できませんでした"
                body="しばらく経ってからリロードしてください。"
                tone="warn"
              />
            )}

            {pattern && !pattern.isLayer1Day && (
              <Notice
                title="本日は配信ありません"
                body={`${pattern.weekday}曜は本命厳格パターンの対象外です。次回は火・水・木のいずれかでお会いしましょう。`}
                tone="muted"
              />
            )}

            {pattern && pattern.isLayer1Day && pattern.recommendations.length === 0 && (
              <Notice
                title="本日は該当なし"
                body="条件を厳格に絞っているため、該当しない日もあります。無理に買わない日があるのも本サービスの方針です。"
                tone="muted"
              />
            )}

            {pattern && pattern.isLayer1Day && pattern.recommendations.length > 0 && (
              <div className="space-y-4">
                <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 text-center">
                  <p className="text-sm font-bold text-amber-300">
                    本命 {pattern.recommendations.length} 件 — 各単勝 100円
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    過去2ヶ月実績 回収率 396.9% / CI下限 225%
                  </p>
                </div>
                {pattern.recommendations
                  .slice()
                  .sort((a, b) => (a.startTime ?? "99:99").localeCompare(b.startTime ?? "99:99"))
                  .map((race, i) => (
                    <RaceCard key={race.raceId} index={i + 1} race={race} />
                  ))}
              </div>
            )}
          </div>

          <div className="mt-12 text-center text-xs text-zinc-500 space-y-1">
            <p>本命 1点で投資額をカバーする運用前提です。</p>
            <p>外れる日もあります。投資判断はご自身で。</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface RaceCardProps {
  index: number;
  race: {
    venue: string;
    raceNumber: number;
    startTime: string | null;
    popularityRank: number | null;
    consensus: { horseNumber: number; horseName: string; agreedCount: number };
  };
}

function RaceCard({ index, race }: RaceCardProps) {
  const popText = race.popularityRank ? `${race.popularityRank}番人気` : "?番人気";
  return (
    <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-amber-300 tracking-wider">
          本命 {index}
        </span>
        <span className="text-sm text-zinc-400">
          ⏰ {race.startTime ?? "—"}
        </span>
      </div>
      <p className="text-sm text-zinc-400 mb-2">
        📍 <strong className="text-zinc-200">{race.venue} {race.raceNumber}R</strong>
      </p>
      <p className="text-xl font-black mb-2">
        ◎ <span className="text-amber-300">{race.consensus.horseNumber}番 {race.consensus.horseName}</span>
        <span className="text-sm text-zinc-400 font-normal ml-2">({popText})</span>
      </p>
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span>🎯 単勝 100円</span>
        <span>🤝 独自AI 4基中 {race.consensus.agreedCount}基が一致</span>
      </div>
    </div>
  );
}

function Notice({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "warn" | "muted";
}) {
  const cls =
    tone === "warn"
      ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
      : "bg-zinc-900 border-zinc-800 text-zinc-300";
  return (
    <div className={`rounded-xl border p-6 text-center ${cls}`}>
      <p className="font-bold mb-2">{title}</p>
      <p className="text-sm">{body}</p>
    </div>
  );
}

function formatDateLabel(yyyymmdd: string, weekday: string): string {
  if (yyyymmdd.length !== 8) return weekday;
  const m = parseInt(yyyymmdd.slice(4, 6), 10);
  const d = parseInt(yyyymmdd.slice(6, 8), 10);
  return `${m}/${d} (${weekday})`;
}
