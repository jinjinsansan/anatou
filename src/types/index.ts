// ============================================================
// 穴党参謀AI 共通型定義
// ============================================================

export type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

/**
 * セッションに保存するユーザー情報
 * 機密情報は含めないこと（Cookie で送られる）
 */
export interface SessionUser {
  /** LINE Login の userId (固有ID) */
  userId: string;
  displayName: string;
  pictureUrl?: string;
  /** 公式LINE 友だち追加済みフラグ。LINE Login response の friendFlag より取得 */
  isFriend: boolean;
  /** 認証時刻 (epoch ms) */
  loggedInAt: number;
}

/**
 * バックエンドから取得する予想データ。
 * 内部実装の詳細（エンジン名等）は型からも除外する。
 */
export interface RecommendationRace {
  raceId: string;
  venue: string;
  raceNumber: number;
  startTime: string | null;
  popularityRank: number | null;
  consensus: {
    horseNumber: number;
    horseName: string;
    /** 一致した独自AIの数（具体的な名前は伝えない） */
    agreedCount: number;
  };
}

export interface DailyPattern {
  date: string; // YYYYMMDD
  weekday: string;
  isLayer1Day: boolean; // 火水木 のみ true
  recommendations: RecommendationRace[];
}
