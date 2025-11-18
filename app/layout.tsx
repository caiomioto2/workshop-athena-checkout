import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workshop athena.agi - CLI Tools",
  description: "Workshop de Claude Code & Gemini CLI - Networking & Hands-on. Aprenda a dominar as ferramentas mais poderosas de IA para desenvolvimento.",
  keywords: ["Claude Code", "Gemini CLI", "Workshop", "IA", "Desenvolvimento", "athena.agi"],
  authors: [{ name: "athena.agi" }],
  openGraph: {
    title: "Workshop athena.agi - CLI Tools",
    description: "Workshop de Claude Code & Gemini CLI - Networking & Hands-on",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
