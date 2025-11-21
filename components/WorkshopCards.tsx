'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { CheckCircle, Code, Bot, Terminal, Cpu, FileJson, Users, ChevronLeft, ChevronRight } from 'lucide-react';

interface Topic {
  id: number;
  duration: string;
  title: string;
  items: string[];
  tagline: string;
  theme: 'claude' | 'router' | 'mcp' | 'spec' | 'network';
}

const topics: Topic[] = [
  {
    id: 1,
    duration: '30min',
    title: 'TOPICO_01: CLAUDE_CODE',
    items: [
      '> Comandos CLI & Arquivos',
      '> Refatoração & Debugging',
      '> Workflows Simples'
    ],
    tagline: 'INICIANDO_SISTEMA...',
    theme: 'claude'
  },
  {
    id: 2,
    duration: '25min',
    title: 'TOPICO_02: ROUTER + GLM',
    items: [
      '> Pipeline Multi-Modelo',
      '> Otimização de Custos',
      '> Lógica de Roteamento'
    ],
    tagline: 'OTIMIZANDO_CUSTOS...',
    theme: 'router'
  },
  {
    id: 3,
    duration: '30min',
    title: 'TOPICO_03: MCP_PLUGINS',
    items: [
      '> Skills & Ações',
      '> Instalação via Marketplace',
      '> Automações Práticas'
    ],
    tagline: 'CONECTANDO_PLUGINS...',
    theme: 'mcp'
  },
  {
    id: 4,
    duration: '25min',
    title: 'TOPICO_04: SPEC_ARCH',
    items: [
      '> Geração de Specs com IA',
      '> Desenv. Orientado a Specs',
      '> Coerência Estrutural'
    ],
    tagline: 'COMPILANDO_SPECS...',
    theme: 'spec'
  },
  {
    id: 5,
    duration: '20min',
    title: 'TOPICO_05: NETWORKING',
    items: [
      '> Tira-dúvidas Geral',
      '> Troca de Experiências',
      '> Encerramento'
    ],
    tagline: 'CONEXAO_ESTABELECIDA...',
    theme: 'network'
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
      case 'network': return <Users className="w-5 h-5" />;
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
      <div className="bg-[#1e1e1e] border-2 border-claude-text p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-dashed border-claude-dim pb-4">
           <div className="flex items-center gap-2 font-mono text-claude-accent">
              {getIcon(topic.theme)}
              <span className="font-bold">{topic.duration}</span>
           </div>
           <div className="text-xs font-mono text-claude-dim">
             ID: 0{topic.id}
           </div>
        </div>

        <h3 className="font-vt323 text-2xl text-claude-text mb-4 uppercase tracking-wide">
          {topic.title}
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
