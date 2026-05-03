// ============================================================
// バックエンドAPI プロキシ層 (サーバー側のみ)
// 内部の golden-pattern API を叩いて型変換 + 内部用語を除去
// ============================================================
import { serverEnv } from "./env";
import type { DailyPattern, RecommendationRace } from "@/types";

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
