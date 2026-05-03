import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_JP({
  variable: "--font-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

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
    description: "火水木のNAR本命厳格。会員限定・無料閲覧。",
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
    description: "火水木のNAR本命厳格。会員限定・無料閲覧。",
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
    <html lang="ja" className={`${notoSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        {children}
      </body>
    </html>
  );
}
