"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { Bot, Cpu, Terminal, FileJson, Users, CheckCircle } from 'lucide-react';

const content = [
    {
        title: "SETUP_ZERO_CUSTO",
        description: (
            <ul className="space-y-3 font-mono text-sm text-gemini-dim">
                <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-gemini-accent" />
                    <span>Configuração sem custo</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-gemini-accent" />
                    <span>Sem instalação local</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-gemini-accent" />
                    <span>Acesso imediato</span>
                </li>
                <li className="mt-4 text-xs text-gemini-accent font-bold pt-2 border-t border-dashed border-gemini-dim/20">
                    SETUP_PRONTO...
                </li>
            </ul>
        ),
        content: (
            <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
                <Bot className="w-20 h-20 text-gemini-accent opacity-80" />
            </div>
        ),
    },
    {
        title: "MEU_FLUXO_DE_CRIACAO",
        description: (
            <ul className="space-y-3 font-mono text-sm text-gemini-dim">
                <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-gemini-accent" />
                    <span>Como eu crio hoje</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-gemini-accent" />
                    <span>Carrosséis com IA</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-gemini-accent" />
                    <span>Do zero à publicação</span>
                </li>
                <li className="mt-4 text-xs text-gemini-accent font-bold pt-2 border-t border-dashed border-gemini-dim/20">
                    CRIANDO_CARROSSEIS...
                </li>
            </ul>
        ),
        content: (
            <div className="h-full w-full flex items-center justify-center text-white">
                <FileJson className="w-20 h-20 text-indigo-400 opacity-80" />
            </div>
        ),
    },
    {
        title: "CRIACAO_DE_VIDEO",
        description: (
            <ul className="space-y-3 font-mono text-sm text-gemini-dim">
                <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-gemini-accent" />
                    <span>Visão geral da plataforma</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-gemini-accent" />
                    <span>Como gerar vídeos</span>
                </li>
                <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-gemini-accent" />
                    <span>Ajustes básicos</span>
                </li>
                <li className="mt-4 text-xs text-gemini-accent font-bold pt-2 border-t border-dashed border-gemini-dim/20">
                    GERANDO_VIDEO...
                </li>
            </ul>
        ),
        content: (
            <div className="h-full w-full flex items-center justify-center text-white">
                <Cpu className="w-20 h-20 text-orange-400 opacity-80" />
            </div>
        ),
    },
];

export function WorkshopStickyScroll() {
    return (
        <div className="">
            <StickyScroll content={content} />
        </div>
    );
}
