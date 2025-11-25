'use client';

import { Terminal, Square, Circle } from 'lucide-react';

export default function ComoFunciona() {
  return (
    <div className="w-full">
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
            <span className="text-gray-400 font-mono text-sm">strategy.md</span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-8 bg-gradient-to-b from-[#1e1e1e] to-[#1a1a1a]">

          {/* Main Title */}
          <div className="mb-6">
            <h1 className="text-claude-accent font-vt323 text-3xl font-black mb-2 uppercase">
              GLM 4.6 + Gemini 3.0 Pro
            </h1>
            <p className="font-mono text-xs text-claude-dim mb-6">
              // POR QUE ESSA COMBINAÇÃO?
            </p>
          </div>

          <div className="space-y-6 font-mono text-sm leading-relaxed text-gray-300">
             <p>
               <strong className="text-white">GLM 4.6 (Z.AI)</strong> oferece alto throughput e custo por token muito baixo — perfeito para operações em volume.
             </p>
             <p>
               <strong className="text-white">Gemini 3.0 Pro</strong> entra quando a tarefa exige maior raciocínio e contexto.
             </p>
             <div className="bg-claude-dark/50 p-4 border-l-2 border-claude-accent">
               <p className="text-claude-text">
                 O <span className="text-claude-accent">Claude Code Router</span> permite orquestrar os dois de forma automática, garantindo performance e economia.
               </p>
             </div>
          </div>

          {/* Terminal Footer */}
          <div className="mt-8 pt-6 border-t border-claude-border/30 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 font-mono text-xs">{`>`}</span>
              <span className="text-gray-400 font-mono text-xs">EOF</span>
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
