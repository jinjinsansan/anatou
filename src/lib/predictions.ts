// ============================================================
// バックエンドAPI プロキシ層 (サーバー側のみ)
// 内部の golden-pattern API を叩いて型変換 + 内部用語を除去
// ============================================================
import { cacheLife } from "next/cache";
import { serverEnv } from "./env";
import type {
  DailyPattern,
  HistoryMonthly,
  HistoryRace,
  HistoryReport,
  HistorySummary,
  RecommendationRace,
} from "@/types";

const WD_LABELS = ["月", "火", "水", "木", "金", "土", "日"];
const LAYER1_WEEKDAYS = new Set([1, 2, 3]); // 火水木

interface InternalRace {
  race_id?: string;
  venue?: string;
  race_number?: number;
  start_time?: string | null;
  popularity_rank?: number | null;
  consensus?: {
    horse_number?: number;
    horse_name?: string;
    count?: number;
  };
  is_golden_strict?: boolean;
}

interface InternalResponse {
  date?: string;
  weekday?: string;
  races?: InternalRace[];
}

/**
 * バックエンドから本日の Layer 1 (火水木 厳格パターン) を取得。
 * 戻り値は内部用語を含まないクリーンな形式。
 */
export async function fetchTodayPattern(dateYYYYMMDD?: string): Promise<DailyPattern> {
  const base = serverEnv.predictionsApiBase();
  const token = serverEnv.predictionsApiToken();
  const date = dateYYYYMMDD ?? formatYYYYMMDD(new Date());

  const url = new URL("/api/data/golden-pattern/today", base);
  url.searchParams.set("date", date);
  url.searchParams.set("race_type", "nar");

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) {
    throw new Error(`predictions api error: ${res.status}`);
  }
  const data: InternalResponse = await res.json();

  const wdIndex = parseWeekday(date);
  const isLayer1Day = LAYER1_WEEKDAYS.has(wdIndex);

  const recommendations: RecommendationRace[] = (data.races ?? [])
    .filter((r) => r.is_golden_strict)
    .map((r) => ({
      raceId: String(r.race_id ?? ""),
      venue: String(r.venue ?? ""),
      raceNumber: Number(r.race_number ?? 0),
      startTime: r.start_time ?? null,
      popularityRank: r.popularity_rank ?? null,
      consensus: {
        horseNumber: Number(r.consensus?.horse_number ?? 0),
        horseName: String(r.consensus?.horse_name ?? ""),
        agreedCount: Number(r.consensus?.count ?? 0),
      },
    }));

  return {
    date,
    weekday: WD_LABELS[wdIndex] ?? "?",
    isLayer1Day,
    recommendations,
  };
}

function formatYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function parseWeekday(yyyymmdd: string): number {
  if (yyyymmdd.length !== 8) return -1;
  const y = parseInt(yyyymmdd.slice(0, 4), 10);
  const m = parseInt(yyyymmdd.slice(4, 6), 10) - 1;
  const d = parseInt(yyyymmdd.slice(6, 8), 10);
  // JS Date.getDay(): 0=Sun..6=Sat なので 月=0..日=6 に変換
  const day = new Date(y, m, d).getDay();
  return (day + 6) % 7;
}

interface InternalHistoryRace {
  date?: string;
  weekday?: string;
  venue?: string;
  race_number?: number;
  race_name?: string;
  horse_number?: number | null;
  horse_name?: string;
  popularity_rank?: number | null;
  agreed_count?: number;
  result_known?: boolean;
  won?: boolean;
  payout?: number;
  profit?: number | null;
}

interface InternalHistoryMonthly {
  ym?: string;
  n?: number;
  hits?: number;
  finished?: number;
  invest?: number;
  payout?: number;
  profit?: number;
  recovery_pct?: number;
}

interface InternalHistorySummary {
  n_total?: number;
  n_finished?: number;
  hits?: number;
  invest?: number;
  payout?: number;
  profit?: number;
  recovery_pct?: number;
  hit_rate_pct?: number;
}

interface InternalHistoryResponse {
  summary?: InternalHistorySummary;
  monthly?: InternalHistoryMonthly[];
  races?: InternalHistoryRace[];
}

/**
 * 全期間の Layer 1 (NAR本命厳格) 履歴を取得。
 * 1日キャッシュ — 毎回APIを叩かない。
 */
export async function fetchHistory(): Promise<HistoryReport> {
  "use cache";
  cacheLife("days");

  const base = serverEnv.predictionsApiBase();
  const token = serverEnv.predictionsApiToken();

  const url = new URL("/api/data/golden-pattern/history", base);
  url.searchParams.set("race_type", "nar");

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    headers,
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) {
    throw new Error(`history api error: ${res.status}`);
  }
  const data: InternalHistoryResponse = await res.json();

  const summary: HistorySummary = {
    nTotal: Number(data.summary?.n_total ?? 0),
    nFinished: Number(data.summary?.n_finished ?? 0),
    hits: Number(data.summary?.hits ?? 0),
    invest: Number(data.summary?.invest ?? 0),
    payout: Number(data.summary?.payout ?? 0),
    profit: Number(data.summary?.profit ?? 0),
    recoveryPct: Number(data.summary?.recovery_pct ?? 0),
    hitRatePct: Number(data.summary?.hit_rate_pct ?? 0),
  };

  const monthly: HistoryMonthly[] = (data.monthly ?? []).map((m) => ({
    ym: String(m.ym ?? ""),
    n: Number(m.n ?? 0),
    hits: Number(m.hits ?? 0),
    finished: Number(m.finished ?? 0),
    invest: Number(m.invest ?? 0),
    payout: Number(m.payout ?? 0),
    profit: Number(m.profit ?? 0),
    recoveryPct: Number(m.recovery_pct ?? 0),
  }));

  const races: HistoryRace[] = (data.races ?? []).map((r) => ({
    date: String(r.date ?? ""),
    weekday: String(r.weekday ?? ""),
    venue: String(r.venue ?? ""),
    raceNumber: Number(r.race_number ?? 0),
    raceName: String(r.race_name ?? ""),
    horseNumber: r.horse_number ?? null,
    horseName: String(r.horse_name ?? ""),
    popularityRank: r.popularity_rank ?? null,
    agreedCount: Number(r.agreed_count ?? 0),
    resultKnown: Boolean(r.result_known),
    won: Boolean(r.won),
    payout: Number(r.payout ?? 0),
    profit: r.profit ?? null,
  }));

  return { summary, monthly, races };
}
