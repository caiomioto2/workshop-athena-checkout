'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { CheckCircle, Code, Bot, Terminal, Cpu, FileJson, Users, ChevronLeft, ChevronRight, Zap, DollarSign } from 'lucide-react';

interface Topic {
  id: number;
  duration: string;
  title: string;
  items: string[];
  tagline: string;
  theme: 'claude' | 'router' | 'mcp' | 'spec' | 'demo' | 'economy';
}

const topics: Topic[] = [
  {
    id: 1,
    duration: 'MODULO_01',
    title: 'CLAUDE_CODE',
    items: [
      '> Geração & Refatoração',
      '> Debugging Assistido',
      '> Execução de Comandos'
    ],
    tagline: 'FLUXO_COMPLETO_TERMINAL...',
    theme: 'claude'
  },
  {
    id: 2,
    duration: 'MODULO_02',
    title: 'ROUTER_&_MULTIMODEL',
    items: [
      '> Integração GLM 4.6',
      '> Integração Gemini 3.0',
      '> Orquestração Automática'
    ],
    tagline: 'OTIMIZANDO_PERFORMANCE...',
    theme: 'router'
  },
  {
    id: 3,
    duration: 'MODULO_03',
    title: 'PLUGINS_MCP',
    items: [
      '> Skills & Actions',
      '> Conexão com APIs',
      '> Processos Internos'
    ],
    tagline: 'EXPANDINDO_CAPACIDADES...',
    theme: 'mcp'
  },
  {
    id: 4,
    duration: 'MODULO_04',
    title: 'SPEC_DRIVEN_ARCH',
    items: [
      '> Specs Profissionais',
      '> Código Consistente',
      '> Escalabilidade'
    ],
    tagline: 'GERANDO_ESTRUTURA...',
    theme: 'spec'
  },
  {
    id: 5,
    duration: 'MODULO_05',
    title: 'DEMOS_AO_VIVO',
    items: [
      '> API via Spec',
      '> Automações Reais',
      '> Pipelines Híbridos'
    ],
    tagline: 'BUILDING_IN_PUBLIC...',
    theme: 'demo'
  },
  {
    id: 6,
    duration: 'MODULO_06',
    title: 'ECONOMIA_DE_SCALE',
    items: [
      '> IA Massiva',
      '> Baixo Custo',
      '> High Throughput'
    ],
    tagline: 'REDUZINDO_CUSTOS...',
    theme: 'economy'
  }
];

const Card = ({ topic, index, setTopics }: { topic: Topic; index: number; setTopics: React.Dispatch<React.SetStateAction<Topic[]>> }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-5, 5]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 50) {
      setTopics((prev) => {
        const newTopics = [...prev];
        const movedTopic = newTopics.shift();
        if (movedTopic) newTopics.push(movedTopic);
        return newTopics;
      });
    }
  };

  const getIcon = (theme: string) => {
    switch (theme) {
      case 'claude': return <Bot className="w-5 h-5" />;
      case 'router': return <Cpu className="w-5 h-5" />;
      case 'mcp': return <Terminal className="w-5 h-5" />;
      case 'spec': return <FileJson className="w-5 h-5" />;
      case 'demo': return <Zap className="w-5 h-5" />;
      case 'economy': return <DollarSign className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      style={{
        gridRow: 1,
        gridColumn: 1,
        x: index === 0 ? x : 0,
        rotate: index === 0 ? rotate : 0,
        opacity: index === 0 ? opacity : 1 - index * 0.15,
        scale: 1 - index * 0.05,
        zIndex: topics.length - index,
        y: index * 8, // Less vertical offset
      }}
      drag={index === 0 ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{
        scale: 1 - index * 0.05,
        y: index * 8,
        zIndex: topics.length - index,
        opacity: index < 3 ? 1 - index * 0.1 : 0 // Hide cards deeper in stack
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`relative w-full cursor-grab active:cursor-grabbing`}
    >
      <div className="bg-[#1e1e1e] border-2 border-claude-text p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] h-full flex flex-col min-h-[300px]">
        <div className="flex justify-between items-center mb-6 border-b border-dashed border-claude-dim pb-4">
           <div className="flex items-center gap-2 font-mono text-claude-accent">
              {getIcon(topic.theme)}
              <span className="font-bold">{topic.duration}</span>
           </div>
           <div className="text-xs font-mono text-claude-dim">
             ID: 0{topic.id}
           </div>
        </div>

        <h3 className="font-vt323 text-2xl text-claude-text mb-4 uppercase tracking-wide leading-tight">
          {topic.title.replace(/_/g, ' ')}
        </h3>

        <ul className="space-y-3 font-mono text-sm text-claude-text mb-6">
          {topic.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-claude-dim opacity-50"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-2 border-t border-dashed border-claude-dim">
           <p className="font-mono text-xs text-claude-accent animate-pulse">
             {topic.tagline}
           </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function WorkshopCards() {
  const [activeTopics, setActiveTopics] = useState(topics);

  const cycleNext = () => {
    setActiveTopics((prev) => {
      const newTopics = [...prev];
      const movedTopic = newTopics.shift();
      if (movedTopic) newTopics.push(movedTopic);
      return newTopics;
    });
  };

  const cyclePrev = () => {
    setActiveTopics((prev) => {
      const newTopics = [...prev];
      const movedTopic = newTopics.pop();
      if (movedTopic) newTopics.unshift(movedTopic);
      return newTopics;
    });
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
        <div className="h-[380px] perspective-1000 grid place-items-center mb-8">
            {activeTopics.map((topic, index) => {
                // Only render the first 3 cards
                if (index > 2) return null;
                return (
                    <Card
                        key={topic.id}
                        topic={topic}
                        index={index}
                        setTopics={setActiveTopics}
                    />
                );
            })}
        </div>

        <div className="flex justify-center items-center gap-8">
            <button
                onClick={cyclePrev}
                className="p-2 text-claude-dim hover:text-claude-accent border border-transparent hover:border-claude-accent transition-all"
                aria-label="Previous topic"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <div className="text-center text-sm font-mono text-claude-dark">
                <span>[ {activeTopics[0].id} / {topics.length} ]</span>
            </div>
            <button
                onClick={cycleNext}
                className="p-2 text-claude-dim hover:text-claude-accent border border-transparent hover:border-claude-accent transition-all"
                aria-label="Next topic"
            >
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>
    </div>
  );
}
