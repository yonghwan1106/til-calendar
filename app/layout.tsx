import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TIL Calendar - 매일 배움 기록",
  description: "매일 배운 것을 기록하고 시각화하는 캘린더 웹앱. 시간을 지배한 사나이에서 영감을 받은 프로젝트.",
  keywords: ["TIL", "Today I Learned", "학습", "기록", "캘린더", "자기계발"],
  authors: [{ name: "yonghwan1106" }],
  openGraph: {
    title: "TIL Calendar - 매일 배움 기록",
    description: "매일 배운 것을 기록하고 시각화하는 캘린더 웹앱",
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
