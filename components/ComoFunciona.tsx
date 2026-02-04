'use client';

import { Terminal, Square, Circle } from 'lucide-react';

interface TopicBlock {
  id: number;
  title: string;
  content: string;
}

const TopicBlock = ({ title, content }: { title: string; content: string }) => (
  <div className="border border-gemini-border bg-gemini-surface/50 p-4 space-y-2 rounded-lg hover:border-gemini-accent transition-colors duration-300">
    <h3 className="gemini-gradient font-vt323 text-lg font-bold">
      {title}
    </h3>
    <div className="flex items-start space-x-2">
      <span className="text-gemini-accent font-vt323 font-bold mt-1">{`>`}</span>
      <p className="text-gemini-dim font-mono text-sm leading-relaxed flex-1">
        {content}
      </p>
    </div>
  </div>
);

export default function ComoFunciona() {
  const topics: TopicBlock[] = [
    {
      id: 1,
      title: "AMBIENTE 100% GRATUITO",
      content: "Aprenda a configurar um ambiente de trabalho completo sem gastar um centavo. Nada de assinaturas ou softwares pagos."
    },
    {
      id: 2,
      title: "ADEUS FERRAMENTAS LIMITADAS",
      content: "Enquanto a maioria ensina a usar ferramentas caras e limitadas como o Freepik, aqui você aprende um método ilimitado e com total liberdade."
    },
    {
      id: 3,
      title: "DESIGN INFINITO (CARROUSÉIS & ADS)",
      content: "Crie qualquer tipo de design, carrossel ou anúncio, utilizando tanto prompts quanto referências visuais que você já possui."
    },
    {
      id: 4,
      title: "COPY E DESIGN EM UM LUGAR SÓ",
      content: "Crie agentes, inclusive para escrever a copy dos seus carrosséis, centralizando todo a produção dentro de uma única plataforma."
    },
    {
      id: 5,
      title: "MEU FLUXO CRIATIVO",
      content: "Vou ensinar o meu fluxo pessoal para criar carrosséis com design impecável, da mesma forma que eu crio para minha marca e clientes."
    },
    {
      id: 6,
      title: "VÍDEOS COM VEO 3.1",
      content: "Além de imagens, crie vídeos incríveis usando o modelo VEO 3.1 totalmente de graça. Sem pagar APIs ou créditos."
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-16">
      {/* Terminal Window Container */}
      <div className="bg-gemini-surface rounded-lg overflow-hidden border border-gemini-border shadow-2xl shadow-black/40">

        {/* Terminal Header */}
        <div className="bg-gemini-bg/90 border-b border-gemini-border px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <Circle className="w-3 h-3 text-red-500 fill-current" />
              <Square className="w-3 h-3 text-yellow-500 fill-current" />
              <Circle className="w-3 h-3 text-green-500 fill-current" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-gemini-dim" />
            <span className="text-gemini-dim font-mono text-sm">como_funciona.md</span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-4 md:p-8 bg-gemini-surface">

          {/* Main Title */}
          <div className="mb-8 text-center">
            <h1 className="text-gemini-text font-vt323 text-3xl font-black mb-2">
              COMO FUNCIONA O WORKSHOP
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-gemini-accent to-transparent mx-auto"></div>
          </div>

          {/* Topics Grid */}
          <div className="space-y-4">
            {topics.map((topic) => (
              <TopicBlock
                key={topic.id}
                title={topic.title}
                content={topic.content}
              />
            ))}
          </div>

          {/* Terminal Footer */}
          <div className="mt-8 pt-6 border-t border-gemini-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-gemini-dim font-mono text-xs">{`>`}</span>
              <span className="text-gemini-dim/80 font-mono text-xs">Pronto para demitir seu designer? kkkj</span>
            </div>
            <div className="flex space-x-1">
              <span className="text-gemini-accent animate-pulse">█</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
