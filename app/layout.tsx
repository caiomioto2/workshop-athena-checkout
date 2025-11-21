import type { Metadata } from "next";
import "./globals.css";

// Google Fonts imports
import { JetBrains_Mono, VT323 } from 'next/font/google';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
});

export const metadata: Metadata = {
  title: "Workshop Claude Code Pro - 3h Ao Vivo com Caio Mioto",
  description: "Workshop exclusivo de Claude Code Pro, Router, GLM e MCP pelo CEO da Agentik AI. Stack IA-first moderna, 100% prático e ao vivo. Domine o ecossistema Claude Code com velocidade e precisão.",
  keywords: ["Claude Code", "Claude Code Router", "GLM", "MCP", "Workshop", "IA", "Desenvolvimento", "Agentik AI", "Caio Mioto"],
  authors: [{ name: "Caio Mioto - Agentik AI" }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: "Workshop Claude Code Pro - 3h Ao Vivo com Caio Mioto",
    description: "Workshop Claude Code Pro focado em Router, GLM e ecossistema MCP. Stack IA-first moderna para desenvolvimento acelerado.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body
        className={`${jetbrainsMono.variable} ${vt323.variable} font-mono antialiased bg-claude-bg text-claude-text`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
