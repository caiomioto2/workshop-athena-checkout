"use client";

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Loader2, AlertCircle, Terminal, Sparkles, ShieldCheck, Timer, Users, CheckCircle } from "lucide-react";
import WorkshopCards from '@/components/WorkshopCards';
import ComoFunciona from '@/components/ComoFunciona';
import { ShimmerButton } from "@/components/ShimmerButton";
import { MorphingText } from "@/components/ui/morphing-text";

const TerminalCard = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#0c0c0c] border border-gemini-dim rounded-lg overflow-hidden shadow-2xl ${className}`}>
    <div className="bg-[#1a1a1a] border-b border-gemini-dim px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Terminal className="w-4 h-4 text-gemini-accent" />
        <span className="font-mono text-sm text-gemini-text opacity-80">{title}</span>
      </div>
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500/50" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
        <div className="w-3 h-3 rounded-full bg-green-500/50" />
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Banner = ({ src, alt, label }: { src: string; alt: string; label?: string }) => (
  <div className="relative overflow-hidden rounded-2xl border border-gemini-border bg-[#0c0c0c] shadow-[0_0_30px_rgba(38,204,255,0.18)]">
    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/60" />
    {label ? (
      <div className="absolute left-6 top-6 z-10 rounded-full border border-gemini-accent/40 bg-black/70 px-4 py-2 font-mono text-xs uppercase tracking-widest text-gemini-accent shadow-[0_0_20px_rgba(38,204,255,0.35)]">
        {label}
      </div>
    ) : null}
    <Image
      src={src}
      alt={alt}
      width={1400}
      height={700}
      className="h-auto w-full object-cover"
      priority={false}
    />
  </div>
);

export default function WorkshopCheckout() {
  const checkoutRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  const jumpToCheckout = () => {
    setShowForm(true);
    requestAnimationFrame(() => {
      checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2')
        .substring(0, 15);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/mercadopago/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone.replace(/\D/g, ''),
          description: 'Workshop Nanobanana Core'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao iniciar pagamento');
      }

      const redirectUrl = data.init_point || data.sandbox_init_point;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        throw new Error('Link de pagamento não recebido.');
      }

    } catch (error: any) {
      console.error('Checkout Error:', error);
      setErrorMessage(error.message || 'Erro inesperado.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-gemini-text font-sans selection:bg-gemini-accent selection:text-black pb-20">
      {/* <div className="fixed inset-0 bg-[linear-gradient(rgba(18,18,18,0)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none opacity-70" /> */}

      <main className="container mx-auto px-4 pt-16 md:pt-20 relative z-10 max-w-6xl space-y-20">
        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-gemini-surface/70 border border-gemini-border px-4 py-2 rounded-full font-mono text-xs text-gemini-dim">
              <span className="text-green-400">●</span> WORKSHOP AO VIVO · VAGAS LIMITADAS
            </div>
            <div className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-gemini-text leading-tight flex flex-wrap items-center font-sans">
              <span>Crie</span>
              <MorphingText
                className="inline-flex items-center w-[180px] md:w-[280px] h-[1em] text-3xl md:text-5xl lg:text-6xl font-black text-gemini-accent text-left leading-none mt-[-0.1em] ml-3"
                texts={["anúncios", "carrosséis", "vídeos"]}
              />
              <span className="whitespace-nowrap">com IA de graça.</span>
            </div>
            <p className="text-gemini-dim font-mono text-sm md:text-base max-w-xl">
              Vou te mostrar como eu configuro um ambiente zero custo e como uso a API do Google de forma ilimitada, sem pagar APIs e sem precisar desenvolver nada.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <ShimmerButton
                onClick={jumpToCheckout}
                shimmerColor="#ffffff"
                background="#4AA9FF"
                className="shadow-[0_0_30px_rgba(74,169,255,0.6)]"
              >
                <span className="flex items-center gap-2 font-black tracking-widest text-white">
                  GARANTIR MINHA VAGA
                </span>
              </ShimmerButton>
              <div className="text-gemini-dim font-mono text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gemini-accent" />
                Checkout seguro pelo Mercado Pago
              </div>
            </div>
            <div className="flex flex-wrap gap-6 text-xs font-mono text-gemini-dim">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-gemini-accent" />
                Configuração rápida e sem código
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gemini-accent" />
                Ambiente gratuito e ilimitado
              </div>
            </div>
          </div>

          <div className="bg-gemini-surface/60 border border-gemini-border rounded-2xl p-6 md:p-8 shadow-[0_0_40px_rgba(38,204,255,0.2)] space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-vt323 text-3xl text-gemini-text">O que você leva</h2>
              <span className="text-xs font-mono text-gemini-dim">[ premium ]</span>
            </div>
            <ul className="space-y-3 text-sm font-mono text-gemini-dim">
              <li>{`>`} Setup zero custo (passo a passo)</li>
              <li>{`>`} Uso real da API do Google sem cobrança</li>
              <li>{`>`} Design e vídeo com IA, sem dev</li>
              <li>{`>`} Como eu crio carrosséis e vídeos para o Instagram</li>
            </ul>
            <div className="pt-4 border-t border-dashed border-gemini-dim/60 flex items-center justify-between">
              <span className="text-gemini-accent font-mono text-xs">{`>>`} Vagas limitadas</span>
              <span className="text-gemini-text font-mono text-sm">R$ 27,90</span>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-mono text-gemini-accent text-sm">
              <span>{`>`}</span>
              <span>CONTEÚDO DO WORKSHOP</span>
            </div>
            <WorkshopCards />
          </div>

          <div className="bg-[#0c0c0c] border border-gemini-border rounded-xl p-6">
            <h3 className="font-vt323 text-2xl text-gemini-text mb-3">Para quem é</h3>
            <ul className="space-y-3 text-sm font-mono text-gemini-dim">
              <li>{`>`} Quem quer cortar custos com ferramentas e assinaturas</li>
              <li>{`>`} Empreendedores que buscam autonomia e escala</li>
              <li>{`>`} Donos de negócio que não querem depender de agências</li>
            </ul>
            <div className="mt-6 border-t border-dashed border-gemini-dim/60 pt-4 text-xs font-mono text-gemini-dim">
              {`>>`} Se você quer parar de gastar e começar a lucrar com IA, essa turma é pra você.
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div className="space-y-8">
            <Banner src="/1.png" alt="Nano banana core" label="NANO BANANA CORE" />
            <Banner src="/2.png" alt="Ambiente 100% gratuito" />
            <Banner src="/veo31.png" alt="VEO 3.1" label="VEO 3.1" />
          </div>

          <aside className="lg:sticky lg:top-24 space-y-4 rounded-2xl border border-gemini-border bg-gemini-surface/70 p-6 shadow-[0_0_30px_rgba(38,204,255,0.18)]">
            <div className="text-xs font-mono text-gemini-dim">{`>>`} Garanta sua vaga agora</div>
            <h3 className="font-vt323 text-3xl text-gemini-text">Nanobanana Core</h3>
            <p className="text-sm font-mono text-gemini-dim">
              Ambiente zero custo para design e vídeo com IA. Sem dev, sem pagar APIs.
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-gemini-dim">R$</span>
              <span className="text-3xl font-mono text-white">27</span>
              <span className="text-sm text-gemini-dim">,90</span>
            </div>
            <ShimmerButton
              onClick={jumpToCheckout}
              shimmerColor="#ffffff"
              background="#4AA9FF"
              className="w-full shadow-[0_0_30px_rgba(74,169,255,0.6)]"
            >
              <span className="font-black tracking-widest text-white">GARANTIR MINHA VAGA</span>
            </ShimmerButton>
            <div className="text-xs font-mono text-gemini-dim">
              Checkout seguro via Mercado Pago
            </div>
          </aside>
        </section>

        <ComoFunciona />

        <section className="grid md:grid-cols-2 gap-12 items-center bg-[#0c0c0c] border border-gemini-border rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gemini-accent/5 rounded-full blur-3xl -z-10" />

          <div className="relative w-48 md:w-64 mx-auto md:mx-0">
            <div className="relative aspect-square w-full rounded-full overflow-hidden border-2 border-gemini-accent/20 shadow-2xl shadow-gemini-accent/10">
              <Image
                src="/caio-mioto-photo.png"
                alt="Caio Mioto"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 -right-4 bg-black/90 backdrop-blur-md border border-gemini-border/50 rounded-full p-2 px-4 flex items-center gap-2 shadow-xl z-10">
              <div className="relative w-5 h-5">
                <Image
                  src="/agentik-logo-new.png"
                  alt="Agentik AI"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[10px] font-mono text-gemini-text/80 tracking-wider">
                POWERED BY AGENTIK
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-gemini-surface border border-gemini-border px-3 py-1 rounded-full font-mono text-xs text-gemini-dim">
              <span className="text-gemini-accent">@</span> SEU MENTOR
            </div>

            <h2 className="font-vt323 text-3xl md:text-5xl text-gemini-text leading-none">
              Caio Mioto
            </h2>

            <div className="space-y-4 font-mono text-gemini-dim text-sm md:text-base leading-relaxed">
              <p>
                Founder da <span className="text-gemini-accent">Agentik AI</span>. Criei o método Core porque cansei de pagar caro em ferramentas que eu poderia rodar localmente.
              </p>
              <p>
                Hoje ajudo empreendedores e donos de negócio a montarem seu próprio laboratório de IA, focando em liberdade criativa e zero custo fixo.
              </p>
              <p>
                O objetivo desse workshop <strong className="text-white">não é eu ganhar dinheiro</strong>, mas você pagar uma taxa simbólica para dar valor. Porque o que é gratuito, a gente acaba não priorizando.
              </p>
              <p>
                Não é sobre "prompt", é sobre <strong className="text-white">fluxo de trabalho</strong>.
              </p>
            </div>

            <div className="pt-6 border-t border-dashed border-gemini-border/50">
              <p className="text-xs font-mono text-gemini-dim">
                {`>>`} Especialista em Automação Criativa & IA Generativa
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto text-center bg-[#0c0c0c] border border-gemini-border rounded-2xl p-6 md:p-8 shadow-[0_0_24px_rgba(38,204,255,0.12)]">
          <p className="text-sm md:text-base text-gemini-dim font-mono">
            Bom, se você chegou até aqui e não tá convencido ainda, é melhor você ficar pagando ferramenta limitada mesmo, tipo Freepik.
          </p>
          <p className="mt-3 text-xs md:text-sm text-gemini-dim font-mono">
            Compra logo essa porra e aprende a não gastar mais com essas porcarias aí.
          </p>
        </section>

        <section ref={checkoutRef} className="max-w-2xl mx-auto scroll-mt-24">
          <TerminalCard title="workshop_checkout.exe" className="border-gemini-accent/50">
            <div className="mb-8 text-center">
              <h1 className="font-vt323 text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 uppercase tracking-wider drop-shadow-[0_0_15px_rgba(74,169,255,0.4)]">
                WORKSHOP <span className="text-gemini-accent">NANOBANANA</span> CORE
              </h1>
              <div className="inline-block bg-gemini-surface border border-gemini-accent/20 px-3 py-1 rounded text-sm text-gemini-dim font-mono">
                <span className="text-green-400">●</span> VAGAS LIMITADAS
              </div>

              <div className="mt-6 mb-8 text-left max-w-sm mx-auto space-y-3 font-mono text-sm text-gemini-dim">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gemini-accent" />
                  <span className="text-white">Acesso ao Workshop Ao Vivo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gemini-accent" />
                  <span>Gravação Vitalícia</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gemini-accent" />
                  <span>Setup do Ambiente Zero Custo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gemini-accent" />
                  <span>Pack de Prompts Nanobanana</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gemini-accent" />
                  <span>Bônus: Criação de Vídeos com VEO 3.1</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center items-baseline gap-1">
                <span className="text-sm text-gemini-dim">R$</span>
                <span className="text-4xl font-mono text-white">27</span>
                <span className="text-sm text-gemini-dim">,90</span>
              </div>
            </div>

            {!showForm ? (
              <div className="text-center mt-6">
                <ShimmerButton
                  onClick={() => setShowForm(true)}
                  shimmerColor="#ffffff"
                  background="#4AA9FF"
                  className="w-full py-4 shadow-[0_0_30px_rgba(74,169,255,0.6)]"
                >
                  <span className="font-black tracking-widest text-white text-lg">GARANTIR MINHA VAGA</span>
                </ShimmerButton>
                <p className="mt-4 text-xs text-gemini-dim font-mono">
                  * Você será redirecionado para o Checkout Seguro
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6">
                <div className="space-y-4">
                  {[
                    { id: "name", label: "NOME COMPLETO *", type: "text", placeholder: "SEU NOME", required: true },
                    { id: "email", label: "EMAIL *", type: "email", placeholder: "SEU MELHOR EMAIL", required: true },
                    { id: "phone", label: "WHATSAPP (COM DDD) *", type: "tel", placeholder: "(00) 90000-0000", maxLength: 15, required: true },
                  ].map((field) => (
                    <div key={field.id}>
                      <label className="block font-mono text-xs text-gemini-accent mb-1 ml-1 opacity-80">{field.label}</label>
                      <input
                        type={field.type}
                        name={field.id}
                        value={(formData as any)[field.id]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        maxLength={field.maxLength}
                        className="w-full bg-[#0a0a0a] border border-gemini-dim text-white px-4 py-3 rounded focus:border-gemini-accent outline-none font-mono placeholder:text-gray-800 transition-colors focus:bg-[#111]"
                        required={field.required}
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <ShimmerButton
                    type="submit"
                    disabled={loading}
                    shimmerColor="#ffffff"
                    background="#4AA9FF"
                    className="w-full py-4 shadow-[0_0_20px_rgba(74,169,255,0.4)] hover:shadow-[0_0_30px_rgba(74,169,255,0.6)]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2 text-white">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="animate-pulse">CARREGANDO...</span>
                      </div>
                    ) : (
                      <span className="font-bold text-lg text-white">IR PARA PAGAMENTO</span>
                    )}
                  </ShimmerButton>
                  <p className="mt-4 text-xs text-gemini-dim font-mono text-center">
                    Ambiente seguro via Mercado Pago
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 border border-red-500/50 bg-red-500/10 rounded text-center animate-in fade-in">
                    <p className="text-red-400 font-mono text-xs">{errorMessage}</p>
                  </div>
                )}
              </form>
            )}
          </TerminalCard>
        </section>
      </main>
    </div>
  );
}
