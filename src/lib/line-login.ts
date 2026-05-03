// ============================================================
// LINE Login (OAuth 2.0 + OpenID Connect) ヘルパー
// ============================================================
import { serverEnv } from "./env";

const LINE_AUTHORIZE_URL = "https://access.line.me/oauth2/v2.1/authorize";
const LINE_TOKEN_URL = "https://api.line.me/oauth2/v2.1/token";
const LINE_VERIFY_URL = "https://api.line.me/oauth2/v2.1/verify";
const LINE_PROFILE_URL = "https://api.line.me/v2/profile";
const LINE_FRIENDSHIP_STATUS_URL =
  "https://api.line.me/friendship/v1/status";

/**
 * 認可URLを構築。
 * bot_prompt=aggressive で 公式LINE 友だち追加を強く促す。
 * https://developers.line.biz/en/docs/line-login/integrate-line-login/#using-line-login-bot-link
 */
export function buildAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: serverEnv.lineLoginChannelId(),
    redirect_uri: serverEnv.lineLoginRedirectUri(),
    state,
    scope: "profile openid",
    bot_prompt: "aggressive",
  });
  return `${LINE_AUTHORIZE_URL}?${params.toString()}`;
}

export interface LineTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  id_token?: string;
}

export async function exchangeCodeForToken(code: string): Promise<LineTokenResponse> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: serverEnv.lineLoginRedirectUri(),
    client_id: serverEnv.lineLoginChannelId(),
    client_secret: serverEnv.lineLoginChannelSecret(),
  });
  const res = await fetch(LINE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LINE token exchange failed: ${res.status} ${text}`);
  }
  return res.json();
}

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

export async function fetchProfile(accessToken: string): Promise<LineProfile> {
  const res = await fetch(LINE_PROFILE_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`LINE profile fetch failed: ${res.status}`);
  }
  return res.json();
}

/**
 * 公式LINE 友だち追加状態を取得。
 * scope に profile が含まれていれば呼べる。
 */
export async function fetchFriendshipStatus(
  accessToken: string,
): Promise<{ friendFlag: boolean }> {
  const res = await fetch(LINE_FRIENDSHIP_STATUS_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    // 失敗時は friend=false 扱い（安全側）
    return { friendFlag: false };
  }
  return res.json();
}

export async function verifyAccessToken(accessToken: string): Promise<boolean> {
  const res = await fetch(`${LINE_VERIFY_URL}?access_token=${accessToken}`);
  return res.ok;
}
