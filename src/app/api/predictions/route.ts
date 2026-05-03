import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { fetchTodayPattern } from "@/lib/predictions";

/**
 * GET /api/predictions?date=YYYYMMDD
 * 認証必須 + 友だち追加必須。
 * クライアント JSが直接バックエンドを叩かないようプロキシ経由にする。
 */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!session.user.isFriend) {
    return NextResponse.json({ error: "friend_required" }, { status: 403 });
  }

  const date = req.nextUrl.searchParams.get("date") ?? undefined;
  try {
    const data = await fetchTodayPattern(date);
    return NextResponse.json(data, {
      headers: {
        // BFF 側でブランド名等の漏れを防ぐため、cache を短めに
        "Cache-Control": "private, max-age=60",
      },
    });
  } catch (e) {
    console.error("[api/predictions] error", e);
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 });
  }
}
