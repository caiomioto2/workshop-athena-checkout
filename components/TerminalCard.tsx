import React from 'react';

interface TerminalCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function TerminalCard({ children, title = 'bash', className = '' }: TerminalCardProps) {
  return (
    <div className={`bg-claude-dark border border-claude-border rounded-lg overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] ${className}`}>
      {/* Terminal Header */}
      <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-claude-border">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
        <div className="flex-1 text-center text-claude-dim text-xs font-mono ml-[-3.5rem]">
          {title}
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
