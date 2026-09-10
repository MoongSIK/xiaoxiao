import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const suite = localFont({
  src: "../public/fonts/SUITE-Variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Xiaoxiao Feed Generator",
  description: "피드 스타일 이미지 생성기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={suite.className}>
        {children}
      </body>
    </html>
  );
}