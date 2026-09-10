import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}