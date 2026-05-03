# 穴党参謀AI フロントエンド

火水木の NAR 本命厳格パターンを会員限定で配信する Next.js フロントエンド。

## 必要環境

- Node.js 22+
- pnpm 10+

## ローカル起動

```bash
pnpm install
cp .env.example .env.local
# .env.local の値を埋める
pnpm dev
```

→ http://localhost:3000

## ディレクトリ構成

```
src/
├── app/
│   ├── page.tsx          # LP（TOP）
│   ├── login/            # LINE Login 起動
│   ├── today/            # 本日の本命表示（要認証＋友だち）
│   ├── about/            # 運用ルール
│   └── api/
│       ├── auth/callback # LINE Login コールバック
│       ├── auth/logout
│       └── predictions   # バックエンド API プロキシ
├── components/           # 共通 UI
├── lib/                  # サーバー側ヘルパー
│   ├── env.ts            # 型付き環境変数
│   ├── session.ts        # iron-session
│   ├── line-login.ts     # LINE OAuth
│   ├── predictions.ts    # バックエンド API プロキシ
│   └── supabase.ts       # Supabase admin
└── types/                # 共通型
public/images/            # 画像アセット
```

## 認証フロー

1. `/login` でセッションに OAuth state を保存し、`https://access.line.me/oauth2/v2.1/authorize` へリダイレクト
2. LINE 側で承認 → `/api/auth/callback` に code が返る
3. code を `access_token` に交換、profile + friendship status を取得
4. session に `SessionUser` を保存して `/today` へ
5. `friendFlag=false` の場合は `/today?need_friend=1` で友だち追加を促す

## ブランド分離ポリシー

- 内部技術名・データソース名は一切 UI に出さない
- バックエンド API プロキシ（`/api/predictions`）は外部に内部URL を漏らさない
- HTTP ヘッダーや HTML コメントから内部識別子を除去

## ビルドとデプロイ

```bash
pnpm build
pnpm start
```

Vercel デプロイ時は環境変数を Vercel ダッシュボードで設定すること。`AUTH_SESSION_SECRET` は `openssl rand -base64 32` で生成した値を使う。

## 重要

- `_credentials_DO_NOT_COMMIT.txt` および `.env.local` は **絶対に git commit しない**
- `assets-source/` は本番ビルドに含まれない（`.gitignore` 対象）
