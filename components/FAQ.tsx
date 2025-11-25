'use client';

import { Terminal } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: "Vai ter gravação?",
      a: "Sim. O acesso à gravação será disponibilizado para todos os inscritos."
    },
    {
      q: "Preciso ser avançado?",
      a: "Não. O workshop foi desenhado para ser prático e acessível, independente do nível."
    },
    {
      q: "Preciso pagar Anthropic?",
      a: "Não — o workshop mostra alternativas econômicas e estratégias para usar modelos como GLM 4.6 e Gemini 3.0 Pro."
    }
  ];

  return (
    <div className="space-y-4">
      {faqs.map((item, i) => (
        <div key={i} className="border border-claude-border bg-[#1a1a1a] p-4">
          <p className="font-vt323 text-xl text-claude-accent mb-2">
            <span className="text-claude-dim mr-2">Q:</span>
            {item.q}
          </p>
          <p className="font-mono text-sm text-claude-text pl-6 border-l border-claude-dim/30">
            {item.a}
          </p>
        </div>
      ))}
    </div>
  );
}
