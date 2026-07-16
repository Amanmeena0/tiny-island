import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tool Shed 🛠️ — A Pegboard of Tiny, Wonderful Things",
  description: "A showcase directory of tiny, free, and open-source games and tools, powered entirely by GitHub Issues and Actions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
