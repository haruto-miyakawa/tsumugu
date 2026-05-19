import type { Metadata } from "next";
import {
  Noto_Serif_JP,
  Noto_Sans_JP,
  Bebas_Neue,
  JetBrains_Mono,
} from "next/font/google";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import "./globals.css";

const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  preload: false,
  variable: "--font-noto-serif",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  preload: false,
  variable: "--font-noto-sans",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "つむぐ",
  description: "言葉を紡ぐ — note記事 半自動作成アプリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${notoSerifJP.variable} ${notoSansJP.variable} ${bebasNeue.variable} ${jetBrainsMono.variable}`}
    >
      <body className="bg-bg min-h-screen">
        <Header />
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
