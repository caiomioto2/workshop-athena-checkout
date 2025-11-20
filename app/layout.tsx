import type { Metadata } from "next";
import "./globals.css";

// Google Fonts imports
import { Poppins } from 'next/font/google';
import { Inter } from 'next/font/google';
import { Patrick_Hand } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-poppins',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
});

const patrickHand = Patrick_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-handwritten',
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
        className={`${inter.variable} ${poppins.variable} ${patrickHand.variable} font-inter antialiased bg-background-primary text-text-primary`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
