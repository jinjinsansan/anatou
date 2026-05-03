import Image from "next/image";
import Link from "next/link";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME ?? "穴党参謀AI";

export function Header({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/images/patternA_icon.png"
            alt=""
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="font-bold text-base tracking-tight group-hover:text-amber-300 transition">
            {BRAND}
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/today"
            className="text-zinc-300 hover:text-amber-300 transition"
          >
            本日の本命
          </Link>
          <Link
            href="/about"
            className="text-zinc-300 hover:text-amber-300 transition"
          >
            運用ルール
          </Link>
          {isLoggedIn ? (
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="text-zinc-400 hover:text-zinc-100 transition"
              >
                ログアウト
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold transition"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
