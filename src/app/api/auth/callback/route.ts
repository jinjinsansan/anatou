import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForToken,
  fetchProfile,
  fetchFriendshipStatus,
} from "@/lib/line-login";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/?login_error=${encodeURIComponent(error)}`, url));
  }
  if (!code || !state) {
    return NextResponse.redirect(new URL("/?login_error=missing_params", url));
  }

  const session = await getSession();
  if (!session.oauthState || session.oauthState !== state) {
    return NextResponse.redirect(new URL("/?login_error=state_mismatch", url));
  }
  // state は使い捨て
  session.oauthState = undefined;

  try {
    const token = await exchangeCodeForToken(code);
    const [profile, friendship] = await Promise.all([
      fetchProfile(token.access_token),
      fetchFriendshipStatus(token.access_token),
    ]);

    session.user = {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      isFriend: friendship.friendFlag,
      loggedInAt: Date.now(),
    };
    await session.save();

    if (!friendship.friendFlag) {
      // 友だち追加が未完了 → 案内ページへ
      return NextResponse.redirect(new URL("/today?need_friend=1", url));
    }
    return NextResponse.redirect(new URL("/today", url));
  } catch (e) {
    console.error("[auth/callback] error", e);
    await session.save();
    return NextResponse.redirect(new URL("/?login_error=token_exchange", url));
  }
}
