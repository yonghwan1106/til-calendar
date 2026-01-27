import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scholar's Journal - 매일 배움 기록",
  description: "매일 배운 것을 기록하고 시각화하는 캘린더 웹앱. 시간을 지배한 사나이에서 영감을 받은 프로젝트.",
  keywords: ["TIL", "Today I Learned", "학습", "기록", "캘린더", "자기계발", "Scholar's Journal"],
  authors: [{ name: "yonghwan1106" }],
  openGraph: {
    title: "Scholar's Journal - 매일 배움 기록",
    description: "매일 배운 것을 기록하고 시각화하는 프리미엄 저널 스타일 캘린더 웹앱",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-[var(--cream)]">
        {children}
      </body>
    </html>
  );
}
