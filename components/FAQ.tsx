'use client';

import { useState } from 'react';
import { Terminal, Plus, Minus, HelpCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const questions = [
    {
        question: "Que dia vai ser o Workshop?",
        answer: "Dia 12 de Fevereiro, às 20h00. Vai ser ao vivo, mas não se preocupe: a gravação ficará disponível vitaliciamente para você rever quando quiser."
    },
    {
        question: "Como recebo o link de acesso?",
        answer: "Assim que sua compra for confirmada, você receberá um e-mail com todas as instruções. Além disso, te convidaremos para um grupo exclusivo no WhatsApp onde mandaremos o link do meet."
    },
    {
        question: "Preciso saber programar?",
        answer: "Zero! O método Nanobanana Core é focado em ferramentas visuais e fluxos que não exigem código. Qualquer pessoa consegue aplicar, mesmo começando do absoluto zero."
    },
    {
        question: "As ferramentas utilizadas têm algum custo?",
        answer: "Não, não tem nenhum custo. Todas ferramentas utilizadas são gratuitas, e eu vou ensinar o método pra utilizar isso sem ter que gastar nada. Com o que eu ensino, você consegue utilizar de forma ilimitada o Nanobanana PRO e o VEO 3.1."
    },
    {
        question: "É uma assinatura mensal?",
        answer: "Não! É um pagamento único de R$ 27,90. Você garante sua vaga no Workshop Ao Vivo e também recebe acesso vitalício à gravação e atualizações do método."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="max-w-4xl mx-auto py-20 px-4">
            <div className="bg-[#0c0c0c] border border-gemini-border rounded-xl overflow-hidden shadow-2xl">

                {/* Header Styles like Terminal */}
                <div className="bg-[#1a1a1a] border-b border-gemini-border px-4 py-3 flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gemini-accent" />
                    <span className="font-mono text-sm text-gemini-dim">faq_doubts.txt</span>
                </div>

                <div className="p-6 md:p-8 space-y-4">
                    <h2 className="font-vt323 text-4xl text-white mb-8 text-center">
                        PERGUNTAS FREQUENTES
                    </h2>

                    <div className="space-y-3">
                        {questions.map((q, i) => (
                            <div
                                key={i}
                                className={`border transition-all duration-300 rounded-lg overflow-hidden ${openIndex === i
                                    ? 'border-gemini-accent bg-gemini-accent/5'
                                    : 'border-gemini-border bg-transparent hover:border-gemini-dim'
                                    }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full flex items-center justify-between p-4 text-left group"
                                >
                                    <span className={`font-mono text-sm md:text-base ${openIndex === i ? 'text-white' : 'text-gemini-dim group-hover:text-white'
                                        }`}>
                                        <span className="text-gemini-accent mr-2">{`>`}</span>
                                        {q.question}
                                    </span>
                                    {openIndex === i ? (
                                        <Minus className="w-4 h-4 text-gemini-accent" />
                                    ) : (
                                        <Plus className="w-4 h-4 text-gemini-dim" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {openIndex === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="px-4 pb-4 pl-8 text-sm font-mono text-gemini-dim/80 leading-relaxed border-t border-dashed border-gemini-accent/20 pt-3 mt-1">
                                                {q.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs font-mono text-gemini-dim">
                            Ainda com dúvida? <span className="text-gemini-accent">Me chama no direct.</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
