import type { Metadata } from "next";
import "./globals.css";
import FaultyTerminal from "@/components/FaultyTerminal";

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
  title: "Workshop Infinity Canvas - Crie Design com IA (Gratuito)",
  description: "Aprenda a usar o Nanobanana e ferramentas de IA gratuitas para criar designs incríveis. Vídeos com VEO 3.1 sem custo. Workshop prático com Caio Mioto.",
  keywords: ["Nanobanana", "Design IA", "Ferramentas Gratuitas", "VEO 3.1", "Workshop", "Infinity Canvas", "Caio Mioto"],
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
    title: "Workshop Infinity Canvas - Design Infinito com IA",
    description: "Crie qualquer design com IA usando ferramentas 100% gratuitas. Método completo com Nanobanana e VO3.1.",
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
        className={`${jetbrainsMono.variable} ${vt323.variable} font-mono antialiased text-gemini-text bg-transparent`}
        suppressHydrationWarning={true}
      >
        <FaultyTerminal
          scale={1}
          digitSize={1.5}
          scanlineIntensity={0.3}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={0}
          chromaticAberration={0}
          dither={false}
          curvature={0.2}
          tint="#ffffff"
          mouseReact={true}
          mouseStrength={0.2}
          brightness={1}
          pageLoadAnimation={false}
          className="fixed inset-0 z-0 pointer-events-none opacity-70"
        />
        <div className="relative z-10 w-full min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
