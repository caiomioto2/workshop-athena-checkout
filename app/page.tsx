'use client';

import { useState } from 'react';
import { Sparkles, Code, Terminal, Users, Calendar, Clock, MapPin, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import WorkshopCards from '../components/WorkshopCards';
import TerminalCard from '../components/TerminalCard';

export default function WorkshopCheckout() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: ''
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [pixData, setPixData] = useState<{ qrCode?: string; qrCodeUrl?: string; paymentUrl?: string; billingId: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaymentStatus('processing');

    try {
      const response = await fetch('/api/abacate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: 2000 // R$ 20,00 em centavos
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPixData({
          qrCode: data.qrCode,
          qrCodeUrl: data.qrCodeUrl,
          paymentUrl: data.paymentUrl,
          billingId: data.billingId
        });
        setPaymentStatus('success');
        console.log('Cobrança criada:', data);
      } else {
        setPaymentStatus('error');
        console.error('Erro pagamento:', data);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-claude-dark border border-claude-border p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
             <Terminal className="w-8 h-8 text-claude-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-vt323 text-claude-dark">
              WORKSHOP_CLAUDE_CODE
            </h1>
            <p className="text-sm font-mono text-claude-dark/70">por Agentik AI</p>
          </div>
        </div>
        <div className="hidden sm:block">
             <div className="bg-claude-dark text-claude-text border border-claude-border px-4 py-2 font-vt323 text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                MODO_WORKSHOP: ATIVO
             </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-12">
             <TerminalCard title="welcome.sh">
                <div className="flex items-center gap-3 mb-6">
                    <span className="bg-claude-accent text-claude-dark px-2 py-1 font-bold font-mono text-xs">VAGAS_LIMITADAS</span>
                    <span className="text-claude-accent font-vt323 text-xl animate-pulse">🔥 oferta_expira_em_breve</span>
                </div>

                <h2 className="text-5xl md:text-6xl font-vt323 text-claude-text mb-6 leading-none">
                   WORKSHOP <br/>
                   <span className="text-claude-accent">CLAUDE_CODE_PRO</span>
                </h2>

                <p className="text-xl font-mono text-claude-dim mb-8 border-l-2 border-claude-accent pl-4">
                   Stack IA-first: Claude Code, Router, GLM e MCP — 3h Ao Vivo
                </p>

                <div className="bg-[#1a1a1a] border border-claude-border p-6 font-mono text-sm text-claude-dim">
                   <p className="mb-4">
                      <span className="text-claude-accent mr-2">$</span>
                      <span className="text-claude-text">./run_workshop --focus=productivity</span>
                   </p>
                   <p>
                      Carregando módulo... <span className="text-claude-accent">Claude Code Router</span><br/>
                      Carregando módulo... <span className="text-claude-accent">GLM</span><br/>
                      Carregando módulo... <span className="text-claude-accent">Ecossistema MCP</span><br/>
                      <br/>
                      <span className="text-[#27C93F]">{`>>`} PRONTO PARA ACELERAR O DESENVOLVIMENTO</span>
                   </p>
                </div>
             </TerminalCard>

             <TerminalCard title="detalhes_evento.json">
                <h3 className="text-2xl font-vt323 text-claude-text mb-6 flex items-center gap-2">
                   <Calendar className="w-6 h-6 text-claude-accent" />
                   DETALHES_DO_EVENTO
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                   {[
                      { icon: Calendar, label: 'DATA', value: 'EM_BREVE' },
                      { icon: Clock, label: 'DURAÇÃO', value: '3H_AO_VIVO' },
                      { icon: MapPin, label: 'LOCAL', value: 'ONLINE_MEET' },
                      { icon: Users, label: 'CAPACIDADE', value: 'VAGAS_LIMITADAS' }
                   ].map((item, i) => (
                      <div key={i} className="bg-[#1a1a1a] border border-claude-border p-4 hover:border-claude-accent transition-colors group">
                         <div className="flex items-center gap-3 mb-2">
                            <item.icon className="w-5 h-5 text-claude-dim group-hover:text-claude-accent transition-colors" />
                            <span className="font-mono text-xs text-claude-dim">{item.label}</span>
                         </div>
                         <p className="font-vt323 text-xl text-claude-text">{item.value}</p>
                      </div>
                   ))}
                </div>
             </TerminalCard>

             <TerminalCard title="organizer.txt">
                 <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-32 h-32 shrink-0">
                      <img
                        src="/profile-photo.png"
                        alt="Caio Mioto"
                        className="w-full h-full border-2 border-claude-accent shadow-[4px_4px_0px_0px_#FF5E3A] object-contain bg-[#1a1a1a]"
                      />
                   </div>
                    <div className="text-center md:text-left">
                       <h4 className="text-3xl font-vt323 text-claude-text mb-2">CAIO MIOTO</h4>
                       <p className="font-mono text-claude-accent text-sm mb-4">CEO @ AGENTIK_AI</p>
                       <p className="font-mono text-sm text-claude-dim leading-relaxed">
                          "Especialista em IA e ferramentas de desenvolvimento. Vamos transformar sua produtividade com as melhores ferramentas do mercado."
                       </p>
                    </div>
                 </div>
             </TerminalCard>

             <TerminalCard title="curriculum.tree">
                <h3 className="text-2xl font-vt323 text-claude-text mb-8">ESTRUTURA_DO_WORKSHOP</h3>
                <div className="min-h-[350px]">
                   <WorkshopCards />
                </div>
             </TerminalCard>
          </div>

          {/* Right Column */}
          <div className="lg:sticky lg:top-8 h-fit">
             <TerminalCard title="payment_gateway.exe" className="border-claude-accent">
                <div className="text-center mb-8 border-b border-claude-border pb-8">
                   <div className="inline-block bg-claude-accent text-claude-dark px-4 py-1 font-vt323 text-xl mb-4">
                      OFERTA_UNICA
                   </div>
                   <div className="flex items-baseline justify-center gap-1 mb-2">
                      <span className="text-2xl font-mono text-claude-dim">R$</span>
                      <span className="text-7xl font-vt323 text-claude-text">20</span>
                   </div>
                   <p className="font-mono text-xs text-claude-dim">METODO_PAGAMENTO: PIX</p>
                </div>

                {paymentStatus === 'idle' && !showForm && (
                   <div className="text-center">
                      <button
                        onClick={() => setShowForm(true)}
                        className="w-full bg-claude-accent text-claude-dark font-vt323 text-2xl py-4 border-2 border-claude-text shadow-[4px_4px_0px_0px_#F0F0F0] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#F0F0F0] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
                      >
                        [ GARANTIR_VAGA ]
                      </button>
                      <p className="font-mono text-xs text-claude-dim mt-4">
                         {`>`} Conexão segura estabelecida...
                      </p>
                   </div>
                )}

                {paymentStatus === 'idle' && showForm && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { id: 'name', label: 'NOME' },
                      { id: 'email', label: 'EMAIL' },
                      { id: 'phone', label: 'TELEFONE' },
                      { id: 'cpf', label: 'CPF' }
                    ].map((field) => (
                      <div key={field.id}>
                        <label className="block font-mono text-xs text-claude-accent mb-1 uppercase">
                          {field.label}
                        </label>
                        <input
                          type={field.id === 'email' ? 'email' : 'text'}
                          name={field.id}
                          required
                          value={(formData as any)[field.id]}
                          onChange={handleInputChange}
                          className="w-full bg-[#1a1a1a] border border-claude-border text-claude-text font-mono px-4 py-3 focus:outline-none focus:border-claude-accent transition-colors"
                          placeholder={`Digite ${field.label}...`}
                        />
                      </div>
                    ))}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-6 bg-claude-accent text-claude-dark font-vt323 text-2xl py-4 border-2 border-claude-text shadow-[4px_4px_0px_0px_#F0F0F0] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#F0F0F0] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                           <Loader2 className="w-5 h-5 animate-spin" />
                           PROCESSANDO...
                        </>
                      ) : (
                        '[ CONFIRMAR_TRANSACAO ]'
                      )}
                    </button>
                  </form>
                )}

                {paymentStatus === 'success' && pixData && (
                   <div className="text-center space-y-6">
                      <div className="bg-[#27C93F]/20 border border-[#27C93F] p-4">
                         <p className="font-vt323 text-2xl text-[#27C93F]">TRANSACTION_CREATED</p>
                      </div>

                      {pixData.qrCodeUrl ? (
                        <div className="bg-white p-4 inline-block mx-auto border-4 border-white">
                           <img src={pixData.qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                        </div>
                      ) : (
                        <div className="w-full space-y-4">
                           <p className="font-mono text-sm text-claude-dim mb-2">Finalize o pagamento abaixo:</p>

                           {/* Iframe for integrated payment */}
                           {pixData.paymentUrl && (
                             <div className="w-full h-[600px] border-2 border-claude-dim bg-white">
                               <iframe
                                 src={pixData.paymentUrl}
                                 className="w-full h-full"
                                 title="Pagamento PIX"
                               />
                             </div>
                           )}

                           {/* Fallback button */}
                           <a
                             href={pixData.paymentUrl}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="inline-block bg-claude-accent text-claude-dark font-vt323 text-xl py-2 px-6 border-2 border-claude-text shadow-[4px_4px_0px_0px_#F0F0F0] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#F0F0F0] transition-all"
                           >
                             [ ABRIR_EM_NOVA_ABA ]
                           </a>
                        </div>
                      )}

                      {pixData.qrCode && (
                        <div className="space-y-2">
                           <p className="font-mono text-xs text-claude-dim">PIX_COPY_PASTE:</p>
                           <div className="bg-[#1a1a1a] p-3 border border-claude-border font-mono text-xs text-claude-dim break-all">
                              {pixData.qrCode}
                           </div>
                           <button
                              onClick={() => navigator.clipboard.writeText(pixData.qrCode!)}
                              className="w-full border border-claude-dim text-claude-dim font-mono text-xs py-2 hover:bg-claude-dim hover:text-claude-dark transition-colors"
                           >
                              [ COPY_CODE ]
                           </button>
                        </div>
                      )}
                   </div>
                )}

                {paymentStatus === 'error' && (
                   <div className="bg-red-500/20 border border-red-500 p-6 text-center">
                      <p className="font-vt323 text-xl text-red-500 mb-4">ERROR: TRANSACTION_FAILED</p>
                      <button
                        onClick={() => setPaymentStatus('idle')}
                        className="text-red-500 font-mono text-xs underline decoration-red-500"
                      >
                        {`>`} RETRY_CONNECTION
                      </button>
                   </div>
                )}

                <div className="mt-8 pt-6 border-t border-claude-border flex justify-center gap-6">
                   <div className="flex items-center gap-2 text-claude-dim">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-mono text-xs">SSL_SECURE</span>
                   </div>
                   <div className="flex items-center gap-2 text-claude-dim">
                      <Terminal className="w-4 h-4" />
                      <span className="font-mono text-xs">INSTANT_ACCESS</span>
                   </div>
                </div>
             </TerminalCard>
          </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-claude-dark/20 text-center pb-8">
         <p className="font-mono text-xs text-claude-dark/60">
            © 2025 FERRAMENTAS_CLI_WORKSHOP <br/>
            POWERED_BY: <span className="font-bold">CLAUDE_CODE</span>
         </p>
      </footer>
    </div>
  );
}
