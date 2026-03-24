import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RandomPage — 随机书页",
  description: "碎片化时代的阅读方式——随机推荐书籍片段",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" data-theme="dark">
      <body className="font-serif min-h-screen bg-base-100">
        {children}
      </body>
    </html>
  );
}
