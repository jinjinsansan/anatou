import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSession } from "@/lib/session";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME ?? "穴党参謀AI";

export default async function HomePage() {
  const session = await getSession();
  const isLoggedIn = Boolean(session.user);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/patternA_wallpaper.png"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/70 to-zinc-950" />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-20 sm:py-28 text-center">
          <Image
            src="/images/patternA_icon.png"
            alt={BRAND}
            width={120}
            height={120}
            priority
            className="mx-auto rounded-2xl shadow-2xl ring-1 ring-amber-400/30"
          />
          <h1 className="mt-8 text-4xl sm:text-5xl font-black tracking-tight">
            <span className="brand-gradient">{BRAND}</span>
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-zinc-300 font-medium">
            火水木のNAR本命厳格 — 会員限定・無料閲覧
          </p>
          <div className="brand-divider w-32 mx-auto my-6" />
          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
            独自AIの合議シグナルから、<br className="sm:hidden" />
            条件を満たした<strong className="text-amber-300">本命のみ</strong>を厳選。<br />
            毎週<strong className="text-amber-300">火・水・木</strong>に配信します。
          </p>

          {!isLoggedIn ? (
            <div className="mt-10 flex flex-col items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#06C755] hover:bg-[#05b94d] text-white font-bold text-base shadow-lg transition-transform hover:scale-105"
              >
                <LineIcon />
                LINEで会員登録 (無料)
              </Link>
              <p className="text-xs text-zinc-500">
                LINEログイン + 公式アカウント友だち追加が必要です
              </p>
            </div>
          ) : (
            <div className="mt-10">
              <Link
                href="/today"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-base shadow-lg transition-transform hover:scale-105"
              >
                本日の本命を見る →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why */}
      <section className="py-16 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">
            <span className="brand-gradient">なぜ火水木だけなのか</span>
          </h2>
          <div className="space-y-6 text-zinc-300">
            <Card title="統計的根拠">
              過去2ヶ月のクリーンデータで <strong className="text-amber-300">火水木 限定 + 旧強5会場 + 5-8人気 + 6-12頭 + 独自AI 2-3基一致</strong> という条件を満たすレースは、サンプル数 145件 / 回収率 396.9% / Bootstrap 95% 信頼区間下限 225% という統計を示しています。
            </Card>
            <Card title="月・金は配信しません">
              他曜日では同条件が揃わず、サンプル不足で安定した期待値を示せないため<strong className="text-amber-300">あえて配信を見送ります</strong>。「いつでも当てる」を装わず、「ここしかない」だけを正直に届けます。
            </Card>
            <Card title="本命のみ・押し付けない">
              買い目は <strong className="text-amber-300">単勝 100円</strong> 固定。1点で投資額をカバーする運用前提で、外れる日もあります。投資判断はあなた自身で。
            </Card>
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="py-16 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-10">
            <span className="brand-gradient">使い方</span>
          </h2>
          <ol className="space-y-4">
            <Step n={1}>
              <strong>LINEログイン</strong> + <strong>公式アカウント友だち追加</strong>（どちらも無料）
            </Step>
            <Step n={2}>
              <strong>火・水・木の朝</strong>、本日の本命ページにアクセス
            </Step>
            <Step n={3}>
              該当レースが出ていれば <strong>各本命に単勝100円</strong>。該当なしの日は配信なし
            </Step>
            <Step n={4}>
              翌日、戦果サマリで結果と回収率を確認
            </Step>
          </ol>
        </div>
      </section>

      {/* CTA */}
      {!isLoggedIn && (
        <section className="py-16 border-t border-zinc-800">
          <div className="max-w-xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-black mb-4">
              <span className="brand-gradient">今すぐ無料で始める</span>
            </h2>
            <p className="text-sm text-zinc-400 mb-8">
              LINEでログインして、公式アカウントを友だち追加するだけ。<br />
              月額課金や決済情報の登録は一切ありません。
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#06C755] hover:bg-[#05b94d] text-white font-bold shadow-lg transition-transform hover:scale-105"
            >
              <LineIcon />
              LINEで会員登録
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6">
      <h3 className="text-lg font-bold text-amber-300 mb-2">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-300">{children}</p>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-4 items-start">
      <span className="flex-none w-9 h-9 rounded-full bg-amber-500 text-zinc-950 font-black flex items-center justify-center">
        {n}
      </span>
      <p className="pt-1.5 text-sm leading-relaxed text-zinc-300">{children}</p>
    </li>
  );
}

function LineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.952 11.022c0-3.554-3.564-6.444-7.945-6.444s-7.946 2.89-7.946 6.444c0 3.184 2.825 5.852 6.642 6.355.258.056.61.171.7.391.08.2.052.514.025.717l-.114.681c-.035.201-.16.787.69.43.852-.358 4.583-2.7 6.252-4.62 1.152-1.262 1.696-2.541 1.696-3.954zm-10.74 1.901h-1.578c-.23 0-.418-.187-.418-.418V9.464c0-.23.187-.418.418-.418.23 0 .418.187.418.418v2.624h1.16c.232 0 .419.187.419.418 0 .23-.187.417-.419.417zm1.66-.418c0 .23-.187.418-.417.418-.231 0-.419-.187-.419-.418V9.464c0-.23.188-.418.419-.418.23 0 .417.187.417.418v3.041zm3.65 0c0 .18-.115.34-.286.397-.043.014-.088.021-.132.021-.131 0-.255-.062-.334-.167l-1.61-2.198v1.947c0 .23-.188.418-.42.418-.23 0-.417-.187-.417-.418V9.464c0-.18.115-.34.286-.397.043-.013.088-.021.132-.021.131 0 .256.063.334.167l1.61 2.198V9.464c0-.23.188-.418.419-.418.23 0 .418.188.418.418v3.041zm2.752-1.937c.231 0 .418.187.418.418 0 .23-.187.417-.418.417h-1.16v.685h1.16c.231 0 .418.188.418.419 0 .23-.187.417-.418.417h-1.578c-.23 0-.418-.187-.418-.417V9.464c0-.23.188-.418.418-.418h1.578c.231 0 .418.187.418.418 0 .23-.187.418-.418.418h-1.16v.686h1.16z" />
    </svg>
  );
}
