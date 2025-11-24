'use client';

import { Terminal, Square, Circle } from 'lucide-react';

interface TopicBlock {
  id: number;
  title: string;
  content: string;
}

const TopicBlock = ({ title, content }: { title: string; content: string }) => (
  <div className="border border-claude-border/50 bg-claude-dark/30 p-4 space-y-2">
    <h3 className="text-orange-500 font-vt323 text-lg font-bold">
      {title}
    </h3>
    <div className="flex items-start space-x-2">
      <span className="text-orange-500 font-vt323 font-bold mt-1">{`>`}</span>
      <p className="text-gray-300 font-mono text-sm leading-relaxed flex-1">
        {content}
      </p>
    </div>
  </div>
);

export default function ComoFunciona() {
  const topics: TopicBlock[] = [
    {
      id: 1,
      title: "DOMÍNIO COMPLETO DO CLAUDE CODE",
      content: "Você vai aprender os comandos essenciais do Claude Codesetup inicial ."
    },
    {
      id: 2,
      title: "MODELOS ILIMITADOS COM ROUTER + GLM",
      content: "Conecte múltiplos modelos de IA sem gastar fortunas. Você vai ver como usar GLM, Gemini e outros modelos para reduzir custos e aumentar sua capacidade de desenvolvimento."
    },
    {
      id: 3,
      title: "PLUGINS MCP NA PRÁTICA",
      content: "Instale e configure plugins do marketplace MCP. Crie automações e integrações que funcionam de verdade, sem precisar ser programador expert."
    },
    {
      id: 4,
      title: "ARQUITETURA POR ESPECIFICAÇÃO",
      content: "Aprenda a criar specs profissionais que geram projetos completos. É assim que empresas sérias desenvolvem software... e você vai dominar isso em 25 minutos."
    },
    {
      id: 5,
      title: "BOILERPLATES IA-FIRST",
      content: "Use templates estruturados para manter qualidade e escalar seus projetos. Nada de código bagunçado... só estrutura limpa e reutilizável."
    },
    {
      id: 6,
      title: "VERSIONAMENTO INTELIGENTE",
      content: "Git + IA funcionando juntos. Você vai ver como manter histórico limpo e trabalhar com segurança usando Claude Code."
    },
    {
      id: 7,
      title: "PERGUNTAS E NETWORKING",
      content: "Tire dúvidas ao vivo e conecte com outros participantes. É sua chance de trocar ideias e descobrir próximos passos."
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-16">
      {/* Terminal Window Container */}
      <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-claude-border/30 shadow-2xl">

        {/* Terminal Header */}
        <div className="bg-gray-900 border-b border-claude-border/30 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <Circle className="w-3 h-3 text-red-500 fill-current" />
              <Square className="w-3 h-3 text-yellow-500 fill-current" />
              <Circle className="w-3 h-3 text-green-500 fill-current" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-gray-500" />
            <span className="text-gray-400 font-mono text-sm">como_funciona.md</span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-8 bg-gradient-to-b from-[#1e1e1e] to-[#1a1a1a]">

          {/* Main Title */}
          <div className="mb-8 text-center">
            <h1 className="text-orange-500 font-vt323 text-3xl font-black mb-2">
              COMO FUNCIONA O WORKSHOP
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
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
          <div className="mt-8 pt-6 border-t border-claude-border/30 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 font-mono text-xs">{`>`}</span>
              <span className="text-gray-400 font-mono text-xs">Pronto para transformar sua produtividade?</span>
            </div>
            <div className="flex space-x-1">
              <span className="text-gray-600 animate-pulse">█</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}