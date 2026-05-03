import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { buildAuthorizeUrl } from "@/lib/line-login";
import { getSession } from "@/lib/session";

/**
 * /login → state生成 → セッション保存 → LINE認可エンドポイントへリダイレクト
 *
 * Route Handler として実装することで Cookie 書き込み（session.save()）が可能。
 */
export async function GET(req: Request) {
  const session = await getSession();
  if (session.user) {
    return NextResponse.redirect(new URL("/today", req.url));
  }

  const state = randomBytes(16).toString("hex");
  session.oauthState = state;
  await session.save();

  const url = buildAuthorizeUrl(state);
  return NextResponse.redirect(url);
}
