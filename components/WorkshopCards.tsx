'use client';

import { useState } from 'react';
import { Bot, Cpu, Terminal, FileJson, Users, CheckCircle } from 'lucide-react';

interface Topic {
  id: number;
  duration: string;
  title: string;
  items: string[];
  tagline: string;
  theme: 'gemini' | 'router' | 'mcp' | 'spec' | 'network';
}

const topics: Topic[] = [
  {
    id: 1,
    duration: 'RÁPIDO',
    title: 'SETUP ZERO CUSTO',
    items: [
      '> Configuração sem custo',
      '> Sem instalação local',
      '> Acesso imediato'
    ],
    tagline: 'SETUP_PRONTO...',
    theme: 'gemini'
  },
  {
    id: 2,
    duration: 'PRÁTICO',
    title: 'MEU FLUXO DE CRIAÇÃO',
    items: [
      '> Como eu crio hoje',
      '> Carrosséis com IA',
      '> Do zero à publicação'
    ],
    tagline: 'CRIANDO_CARROSSEIS...',
    theme: 'spec'
  },
  {
    id: 3,
    duration: 'DEMO',
    title: 'CRIAÇÃO DE VÍDEO',
    items: [
      '> Visão geral da plataforma',
      '> Como gerar vídeos',
      '> Ajustes básicos'
    ],
    tagline: 'GERANDO_VIDEO...',
    theme: 'router'
  }
];

export default function WorkshopCards() {
  const [activeId, setActiveId] = useState<number>(topics[0].id);
  const activeTopic = topics.find((topic) => topic.id === activeId) || topics[0];

  const getIcon = (theme: string) => {
    switch (theme) {
      case 'gemini': return <Bot className="w-5 h-5" />;
      case 'router': return <Cpu className="w-5 h-5" />;
      case 'mcp': return <Terminal className="w-5 h-5" />;
      case 'spec': return <FileJson className="w-5 h-5" />;
      case 'network': return <Users className="w-5 h-5" />;
      default: return <Terminal className="w-5 h-5" />;
    }
  };

  return (
    <div className="grid lg:grid-cols-[0.55fr_1fr] gap-6">
      <div className="space-y-3">
        <div className="text-xs font-mono text-gemini-dim">
          {`>`} Clique para navegar pelos tópicos
        </div>
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setActiveId(topic.id)}
            className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${activeId === topic.id
              ? 'border-gemini-accent bg-gemini-surface shadow-[0_0_18px_rgba(38,204,255,0.25)]'
              : 'border-gemini-border bg-[#0c0c0c] hover:border-gemini-accent/60'
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gemini-accent font-mono text-sm">
                {getIcon(topic.theme)}
                <span className="font-bold">{topic.duration}</span>
              </div>
              <span className="text-xs font-mono text-gemini-dim">0{topic.id}</span>
            </div>
            <div className="mt-2 font-vt323 text-lg text-gemini-text uppercase tracking-wide">
              {topic.title}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gemini-border bg-gemini-surface/70 p-6 shadow-[0_0_30px_rgba(38,204,255,0.18)]">
        <div className="flex items-center gap-3 text-gemini-accent font-mono text-sm">
          {getIcon(activeTopic.theme)}
          <span>{activeTopic.duration}</span>
          <span className="text-gemini-dim">/</span>
          <span>TOPICO {activeTopic.id}</span>
        </div>
        <h3 className="mt-4 font-vt323 text-3xl text-gemini-text uppercase tracking-wide">
          {activeTopic.title}
        </h3>
        <ul className="mt-4 space-y-3 font-mono text-sm text-gemini-text">
          {activeTopic.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 h-4 w-4 text-gemini-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
