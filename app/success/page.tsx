"use client";

import Image from "next/image";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function Success() {
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL || "#";

  return (
    <div className="min-h-screen bg-[#050505] text-gemini-text font-sans selection:bg-gemini-accent selection:text-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(18,18,18,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] -z-10" />

      <main className="max-w-xl w-full bg-[#0c0c0c] border border-gemini-border rounded-2xl p-8 md:p-12 text-center shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500 space-y-8">

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight font-vt323">
            PAGAMENTO CONFIRMADO!
          </h1>
          <p className="text-gemini-dim font-mono text-sm md:text-base leading-relaxed">
            Sua vaga no Workshop Nanobanana Core está garantida. Agora, o próximo passo é entrar no nosso grupo exclusivo.
          </p>
        </div>

        <div className="pt-6 border-t border-dashed border-gemini-dim/30">
          <p className="text-xs font-mono text-gemini-accent mb-4 uppercase tracking-widest">
            Próximo Passo Obrigatório
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold py-4 rounded-xl text-lg transition-all active:scale-95 font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]"
          >
            <span>[ ENTRAR NO GRUPO VIP ]</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="mt-4 text-[10px] text-gemini-dim font-mono opacity-60">
            * Avisos e links das aulas serão enviados por lá.
          </p>
        </div>
      </main>

      <footer className="mt-12 text-center space-y-4 relative z-10">
        <div className="flex items-center justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <Image
            src="/agentik-logo-new.png"
            alt="Agentik AI"
            width={24}
            height={24}
            className="object-contain"
          />
          <span className="text-[10px] font-mono text-gemini-text tracking-wider">
            POWERED BY AGENTIK
          </span>
        </div>
      </footer>
    </div>
  );
}
