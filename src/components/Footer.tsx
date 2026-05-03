const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME ?? "穴党参謀AI";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 py-8">
      <div className="max-w-5xl mx-auto px-4 text-center text-xs text-zinc-500 space-y-2">
        <p className="font-bold text-zinc-400">{BRAND}</p>
        <p>
          本サービスは情報提供を目的としており、馬券の購入を強制するものではありません。<br />
          投資判断はご自身の責任で行ってください。
        </p>
        <p className="text-zinc-600">© {new Date().getFullYear()} {BRAND}</p>
      </div>
    </footer>
  );
}
