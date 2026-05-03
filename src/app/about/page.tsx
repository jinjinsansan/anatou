import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSession } from "@/lib/session";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME ?? "穴党参謀AI";

export const metadata = {
  title: "運用ルール",
};

export default async function AboutPage() {
  const session = await getSession();
  const isLoggedIn = Boolean(session.user);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-black text-center mb-2">
            <span className="brand-gradient">運用ルール</span>
          </h1>
          <p className="text-center text-zinc-500 text-sm mb-10">
            {BRAND} の配信条件・買い方・実績の透明性について
          </p>

          <Section title="配信条件">
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-zinc-300">
              <li>NAR（地方競馬）限定</li>
              <li>火・水・木 のみ配信</li>
              <li>旧強5会場（園田／水沢／高知／笠松／金沢）のレースのみ</li>
              <li>出走頭数 6〜12頭</li>
              <li>本命の人気が 5〜8番人気</li>
              <li>独自AI 4基のうち 2〜3基が一致したシグナルのみ採用</li>
            </ul>
          </Section>

          <Section title="買い目">
            <p className="text-sm leading-relaxed text-zinc-300">
              全本命 <strong className="text-amber-300">単勝 100円</strong> 固定。1日に複数件出ることもあれば、該当なしで配信ゼロの日もあります。<br />
              ハイレートの単勝1点で、外れの日の-100円を取り返す運用設計です。
            </p>
          </Section>

          <Section title="過去2ヶ月実績">
            <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-6">
              <dl className="space-y-3 text-sm">
                <Row label="サンプル数 (n)" value="145件" />
                <Row label="回収率" value="396.9%" highlight />
                <Row label="Bootstrap 95% 信頼区間下限" value="225%" />
                <Row label="計測期間" value="2026-03 〜 2026-04 (clean データ)" />
              </dl>
              <p className="text-xs text-zinc-500 mt-4 leading-relaxed">
                ※ leakage（学習データ汚染）を除去した clean データで計測。<br />
                ※ 短期2ヶ月の数値は将来の利益を保証するものではありません。
              </p>
            </div>
          </Section>

          <Section title="月・金・土・日 はなぜ配信しないか">
            <p className="text-sm leading-relaxed text-zinc-300">
              月・金は同条件でのバックテストで <strong className="text-amber-300">サンプル不足 + 統計的に黒字を確認できず</strong>、配信化の根拠がありません。<br />
              土・日 は本サービスの対象外です。<br />
              「いつでも当てる」を装わず、勝てる根拠が立つ曜日だけに絞るのが本サービスの方針です。
            </p>
          </Section>

          <Section title="重要な注意事項">
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed text-zinc-400">
              <li>本サービスは情報提供のみで、馬券購入を強制するものではありません</li>
              <li>投資判断は必ず自己責任でお願いします</li>
              <li>過去の数値は将来の利益を保証するものではありません</li>
              <li>20歳未満の方は馬券を購入できません</li>
            </ul>
          </Section>

          {!isLoggedIn && (
            <div className="mt-12 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#06C755] hover:bg-[#05b94d] text-white font-bold shadow-lg transition-transform hover:scale-105"
              >
                LINEで会員登録 (無料)
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-bold text-amber-300 mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-zinc-800 last:border-0 pb-2 last:pb-0">
      <dt className="text-zinc-500">{label}</dt>
      <dd className={highlight ? "text-amber-300 font-black text-lg" : "text-zinc-200 font-bold"}>
        {value}
      </dd>
    </div>
  );
}
