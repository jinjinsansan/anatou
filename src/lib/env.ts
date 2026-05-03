// ============================================================
// 環境変数の型付きアクセサ
// 不足している場合は早期エラー
// ============================================================

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

function optional(name: string, defaultValue = ""): string {
  return process.env[name] ?? defaultValue;
}

// クライアント側で参照できる値（NEXT_PUBLIC_ 接頭辞のみ）
export const publicEnv = {
  supabaseUrl: optional("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: optional("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  siteUrl: optional("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  brandName: optional("NEXT_PUBLIC_BRAND_NAME", "穴党参謀AI"),
};

// サーバー側専用（クライアントには絶対に渡さない）
export const serverEnv = {
  supabaseServiceRoleKey: () => required("SUPABASE_SERVICE_ROLE_KEY"),
  lineLoginChannelId: () => required("LINE_LOGIN_CHANNEL_ID"),
  lineLoginChannelSecret: () => required("LINE_LOGIN_CHANNEL_SECRET"),
  lineLoginRedirectUri: () => required("LINE_LOGIN_REDIRECT_URI"),
  lineOfficialAccountId: () => optional("LINE_OFFICIAL_ACCOUNT_ID"),
  lineChannelSecret: () => required("LINE_CHANNEL_SECRET"),
  lineChannelAccessToken: () => required("LINE_CHANNEL_ACCESS_TOKEN"),
  predictionsApiBase: () => required("PREDICTIONS_API_BASE"),
  predictionsApiToken: () => optional("PREDICTIONS_API_TOKEN"),
  authSessionSecret: () => required("AUTH_SESSION_SECRET"),
};
