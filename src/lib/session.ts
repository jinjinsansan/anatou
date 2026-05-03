// ============================================================
// Cookie ベースの軽量セッション (iron-session)
// DB 不要。Cookie 自体に暗号化済みデータが入る。
// ============================================================
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { serverEnv } from "./env";
import type { SessionUser } from "@/types";

export interface AppSession {
  user?: SessionUser;
  /** OAuth state CSRF防止 */
  oauthState?: string;
}

function sessionOptions(): SessionOptions {
  return {
    password: serverEnv.authSessionSecret(),
    cookieName: "anatou_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      // 30日間
      maxAge: 60 * 60 * 24 * 30,
    },
  };
}

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<AppSession>(cookieStore, sessionOptions());
}

export async function destroySession() {
  const session = await getSession();
  session.destroy();
}
