import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { buildAuthorizeUrl } from "@/lib/line-login";
import { getSession } from "@/lib/session";

/**
 * /login → state生成 → セッション保存 → LINE認可エンドポイントへリダイレクト
 */
export default async function LoginPage() {
  const session = await getSession();
  if (session.user) {
    redirect("/today");
  }

  const state = randomBytes(16).toString("hex");
  session.oauthState = state;
  await session.save();

  const url = buildAuthorizeUrl(state);
  redirect(url);
}
