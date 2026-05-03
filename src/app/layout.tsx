import type { Metadata } from "next";
import "./globals.css";

// Note: Web fonts are loaded via <link> tag in <head> below instead of
// next/font/google because Shippori Mincho's many JP subsets fail to
// download reliably during Turbopack build. CDN load avoids the issue
// and matches the original design HTML's approach.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME ?? "穴党参謀AI";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} | 火水木のNAR本命厳格`,
    template: `%s | ${BRAND}`,
  },
  description:
    "独自AIの合議シグナルから、火水木のNAR(地方競馬)で条件を満たした本命だけを厳選してお届け。会員限定・無料閲覧。",
  openGraph: {
    title: BRAND,
    description: "本命の、その一頭だけを。",
    url: SITE_URL,
    siteName: BRAND,
    images: [
      {
        url: "/images/patternA_note.png",
        width: 1200,
        height: 630,
        alt: BRAND,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND,
    description: "本命の、その一頭だけを。",
    images: ["/images/patternA_note.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/patternA_icon.png",
    apple: "/images/patternA_icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800;900&family=Shippori+Mincho:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: "#0a0a0c", color: "#f4efe2" }}>
        {children}
      </body>
    </html>
  );
}
