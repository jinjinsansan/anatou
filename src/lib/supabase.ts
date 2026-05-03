// ============================================================
// Supabase クライアント (サーバー側専用)
// 現状はユーザーログイン履歴の保存等の用途で使用予定。
// ============================================================
import { createClient } from "@supabase/supabase-js";
import { publicEnv, serverEnv } from "./env";

let _admin: ReturnType<typeof createClient> | null = null;

/**
 * service_role key を使う管理者クライアント。
 * **絶対にクライアントサイドへ渡さないこと。**
 */
export function getSupabaseAdmin() {
  if (!_admin) {
    _admin = createClient(publicEnv.supabaseUrl, serverEnv.supabaseServiceRoleKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _admin;
}
