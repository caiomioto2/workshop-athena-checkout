'use client';

import { useState } from 'react';
import { Sparkles, Code, Terminal, Users, Calendar, Clock, MapPin, CreditCard, CheckCircle, Loader2 } from 'lucide-react';

export default function WorkshopCheckout() {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeUrl: string; billingId: string } | null>(null);

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
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-card">
                <Sparkles className="w-8 h-8 text-primary-600" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-poppins font-bold text-text-primary tracking-tight">
                  athena.agi
                </h1>
                <p className="text-sm text-text-muted">by Agentik AI</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="badge-primary">
                WORKSHOP EXCLUSIVO
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Event Info */}
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="card p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="badge-success">
                  VAGAS LIMITADAS
                </span>
                <span className="handwritten text-lg">🔥 só hoje!</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-poppins font-bold text-text-primary mb-6 leading-tight text-balance">
                Workshop <span className="gradient-text">Claude Code Pro</span>
              </h2>

              <p className="text-xl font-poppins font-medium text-text-secondary mb-8 leading-relaxed">
                Stack IA-first: Claude Code, Router, GLM e MCP — 3h Ao Vivo
              </p>

              <div className="bg-primary-50 border border-primary-200 p-6 rounded-xl">
                <p className="text-lg font-medium leading-relaxed text-text-primary">
                  Workshop exclusivo de 3h ao vivo focado em <span className="font-poppins font-bold text-primary-700 highlight-text">Claude Code Pro</span>.
                  Domine a stack IA-first moderna com Claude Code Router, GLM e ecossistema MCP.
                  Desenvolva soluções completas, automações e microprojetos com velocidade e precisão!
                </p>
                <p className="handwritten text-primary-600 mt-4 text-lg">
                  Vamos transformar sua produtividade! 🚀
                </p>
              </div>
            </div>

            {/* Event Details */}
            <div className="card p-8 lg:p-10">
              <h3 className="text-2xl font-poppins font-bold text-text-primary mb-8 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary-600" strokeWidth={2} />
                Detalhes do Evento
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-background-surface p-6 rounded-xl border border-gray-100 hover:shadow-medium transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-primary-600" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-poppins font-semibold text-text-primary mb-1">Data</p>
                      <p className="text-text-secondary">A definir <span className="handwritten text-primary-600">em breve!</span></p>
                    </div>
                  </div>
                </div>

                <div className="bg-background-surface p-6 rounded-xl border border-gray-100 hover:shadow-medium transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-success-100 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-success-600" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-poppins font-semibold text-text-primary mb-1">Duração</p>
                      <p className="text-text-secondary">3 horas ao vivo</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background-surface p-6 rounded-xl border border-gray-100 hover:shadow-medium transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-warning-100 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-warning-600" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-poppins font-semibold text-text-primary mb-1">Formato</p>
                      <p className="text-text-secondary">Online - Call ao vivo</p>
                    </div>
                  </div>
                </div>

                <div className="bg-background-surface p-6 rounded-xl border border-gray-100 hover:shadow-medium transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-error-100 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-error-600" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-poppins font-semibold text-text-primary mb-1">Vagas</p>
                      <p className="text-text-secondary">Limitadas <span className="handwritten text-error-600">garanta já!</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Section */}
            <div className="card p-8 lg:p-10">
              <h3 className="text-2xl font-poppins font-bold text-text-primary mb-8 flex items-center gap-3">
                <Users className="w-6 h-6 text-primary-600" strokeWidth={2} />
                Sobre o Organizador
              </h3>

              <div className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 p-8 rounded-2xl">
                <div className="text-center mb-6">
                  <div className="mb-6 flex justify-center items-center gap-6">
                    <div className="relative">
                      <img
                        src="/caio-mioto-photo.png"
                        alt="Caio Mioto"
                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-medium"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full p-2">
                        <Sparkles className="w-5 h-5" strokeWidth={2} />
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-medium border border-primary-100">
                      <img
                        src="/agentik-logo-new.png"
                        alt="Agentik AI"
                        className="w-32 h-auto object-contain"
                      />
                    </div>
                  </div>
                  <h4 className="text-2xl font-poppins font-bold text-text-primary mb-2">
                    Caio Mioto
                  </h4>
                  <p className="font-poppins font-medium text-text-secondary mb-2">
                    CEO & Founder - Agentik AI
                  </p>
                  <p className="handwritten text-primary-600 text-lg">
                    Especialista em IA e desenvolvimento!
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="font-medium leading-relaxed text-text-primary">
                    Especialista em Inteligência Artificial e ferramentas de desenvolvimento,
                    com vasta experiência em automatização e otimização de processos através de IA.
                  </p>

                  <div className="bg-white/70 backdrop-blur border border-primary-100 p-6 rounded-xl">
                    <p className="font-poppins font-semibold text-text-primary mb-4">EXPERTISE:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4 text-primary-600" strokeWidth={2} />
                        <span className="text-sm text-text-primary">Claude Code & CLI Tools</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-primary-600" strokeWidth={2} />
                        <span className="text-sm text-text-primary">Automação com IA</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary-600" strokeWidth={2} />
                        <span className="text-sm text-text-primary">Otimização de Workflows</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary-600" strokeWidth={2} />
                        <span className="text-sm text-text-primary">Consultoria em AI Tools</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <p className="handwritten text-primary-600 text-lg font-medium">
                      "Vamos transformar sua produtividade com as melhores ferramentas de IA!"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Workshop Structure */}
            <div className="card p-8 lg:p-10">
              <h3 className="text-2xl font-poppins font-bold text-text-primary mb-8 flex items-center gap-3">
                <Code className="w-6 h-6 text-primary-600" strokeWidth={2} />
                Estrutura do Workshop <span className="handwritten text-primary-600">(3h Ao Vivo)</span>
              </h3>

              <div className="space-y-4">
                <div className="bg-warning-50 border border-warning-200 p-6 rounded-xl hover:shadow-medium transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-warning-200 text-warning-700 rounded-lg p-3 text-sm font-poppins font-bold">
                      30min
                    </div>
                    <div className="flex-1">
                      <p className="font-poppins font-semibold text-text-primary mb-3">
                        TÓPICO 1 — Claude Code Dominado
                      </p>
                      <ul className="space-y-2 text-sm text-text-primary">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                          <span>Comandos essenciais e manipulação de arquivos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                          <span>Refatoração e debugging assistido</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                          <span>Workflows simples e execuções guiadas</span>
                        </li>
                      </ul>
                      <p className="handwritten text-warning-600 mt-3">A base de tudo! 🛠️</p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-50 border border-primary-200 p-6 rounded-xl hover:shadow-medium transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-200 text-primary-700 rounded-lg p-3 text-sm font-poppins font-bold">
                      25min
                    </div>
                    <div className="flex-1">
                      <p className="font-poppins font-semibold text-text-primary mb-3">
                        TÓPICO 2 — Router + GLM
                      </p>
                      <ul className="space-y-2 text-sm text-text-primary">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                          <span>Múltiplos modelos e redução de custos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                          <span>Qwen, Groq, OpenRouter, Claude API</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                          <span>Pipelines multi-modelo</span>
                        </li>
                      </ul>
                      <p className="handwritten text-primary-600 mt-3">IA ilimitada por menos! 💰</p>
                    </div>
                  </div>
                </div>

                <div className="bg-success-50 border border-success-200 p-6 rounded-xl hover:shadow-medium transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-success-200 text-success-700 rounded-lg p-3 text-sm font-poppins font-bold">
                      30min
                    </div>
                    <div className="flex-1">
                      <p className="font-poppins font-semibold text-text-primary mb-3">
                        TÓPICO 3 — Plugins MCP
                      </p>
                      <ul className="space-y-2 text-sm text-text-primary">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                          <span>Skills, actions e workflows</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                          <span>Marketplace e instalação</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                          <span>Automações e integrações práticas</span>
                        </li>
                      </ul>
                      <p className="handwritten text-success-600 mt-3">O poder dos plugins! 🔌</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl hover:shadow-medium transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-200 text-purple-700 rounded-lg p-3 text-sm font-poppins font-bold">
                      25min
                    </div>
                    <div className="flex-1">
                      <p className="font-poppins font-semibold text-text-primary mb-3">
                        TÓPICO 4 — Arquitetura Spec-Driven
                      </p>
                      <ul className="space-y-2 text-sm text-text-primary">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                          <span>Especificações profissionais com IA</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                          <span>Projetos completos baseados em specs</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                          <span>Coerência e estrutura garantida</span>
                        </li>
                      </ul>
                      <p className="handwritten text-purple-600 mt-3">Projetos profissionais! 📋</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-xl">
                  <p className="font-poppins font-bold text-lg mb-3">✨ BENEFÍCIOS EXCLUSIVOS</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" strokeWidth={2} />
                      <span className="font-medium">Domínio Claude Code Pro e Router</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" strokeWidth={2} />
                      <span className="font-medium">IA ilimitada e econômica</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" strokeWidth={2} />
                      <span className="font-medium">Especialista em plugins MCP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" strokeWidth={2} />
                      <span className="font-medium">Arquitetura orientada a specs</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <CheckCircle className="w-5 h-5" strokeWidth={2} />
                      <span className="font-medium">Boilerplates IA-first para acelerar seus projetos!</span>
                    </div>
                  </div>
                  <p className="handwritten text-yellow-200 text-center mt-4 text-lg">
                    Você vai sair transformado! 🚀
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Checkout Form */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="card p-8 lg:p-10 shadow-large border-2 border-primary-100">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white p-6 rounded-2xl mb-6 shadow-medium">
                  <p className="text-sm font-poppins font-semibold mb-2 opacity-90">INVESTIMENTO ÚNICO</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl font-poppins font-bold">R$</span>
                    <span className="text-6xl font-poppins font-black">20</span>
                  </div>
                  <p className="font-poppins font-medium mt-2 opacity-90">Pagamento via Pix</p>
                </div>

                <div className="space-y-2">
                  <p className="text-text-secondary font-medium">Acesso vitalício ao conteúdo</p>
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                    <span className="text-sm text-text-secondary font-medium">Garantia de satisfação</span>
                  </div>
                </div>
              </div>

              {paymentStatus === 'idle' && (
                <form onSubmit={handleSubmit} className="space-y-6" key="checkout-form">
                  <div>
                    <label className="block font-poppins font-semibold text-text-primary mb-3 text-sm">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all text-text-primary bg-white"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins font-semibold text-text-primary mb-3 text-sm">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all text-text-primary bg-white"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary text-lg py-4 shadow-medium hover:shadow-large hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-medium flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                        <span className="font-poppins font-bold">Processando...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" strokeWidth={2} />
                        <span className="font-poppins font-bold">GARANTIR MINHA VAGA</span>
                      </>
                    )}
                  </button>

                  <div className="text-center space-y-2">
                    <p className="text-xs text-text-muted">
                      Pagamento 100% seguro via <span className="font-poppins font-semibold text-primary-600">AbacatePay</span>
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-success-500" strokeWidth={2} />
                        <span>SSL Seguro</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-success-500" strokeWidth={2} />
                        <span>Dados Protegidos</span>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {paymentStatus === 'success' && pixData && (
                <div className="space-y-8">
                  <div className="text-center">
                    <div className="inline-block bg-success-100 p-6 rounded-full mb-6 shadow-medium">
                      <CheckCircle className="w-16 h-16 text-success-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-2xl font-poppins font-bold text-text-primary mb-3">
                      QR Code Gerado!
                    </h3>
                    <p className="font-poppins font-medium text-text-secondary">
                      Escaneie o QR Code ou copie o código Pix
                    </p>
                    <p className="handwritten text-success-600 mt-2">
                      Quase lá! 🎉
                    </p>
                  </div>

                  <div className="bg-primary-50 border-2 border-primary-200 p-6 rounded-xl">
                    <div className="bg-white p-6 rounded-xl mb-6 shadow-soft flex justify-center">
                      <img src={pixData.qrCodeUrl} alt="QR Code Pix" className="w-64 h-64 rounded-lg" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="font-poppins font-semibold text-text-primary mb-3 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-primary-600" strokeWidth={2} />
                          Código Pix:
                        </p>
                        <div className="bg-white p-4 rounded-xl border border-primary-100 font-mono text-xs text-text-primary break-all shadow-soft">
                          {pixData.qrCode}
                        </div>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(pixData.qrCode)}
                        className="w-full btn-secondary flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-5 h-5" strokeWidth={2} />
                        <span className="font-poppins font-semibold">COPIAR CÓDIGO PIX</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-warning-50 border border-warning-200 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-warning-600" strokeWidth={2} />
                      <p className="text-sm font-poppins font-medium text-text-primary">
                        ⏰ Após o pagamento, você receberá as informações do evento por email
                      </p>
                    </div>
                    <p className="handwritten text-warning-600 text-center mt-3">
                      Verifique também sua caixa de spam! 😉
                    </p>
                  </div>
                </div>
              )}

              {paymentStatus === 'error' && (
                <div className="text-center space-y-6">
                  <div className="bg-error-50 border border-error-200 p-6 rounded-xl">
                    <div className="inline-block bg-error-100 p-4 rounded-full mb-4">
                      <CheckCircle className="w-12 h-12 text-error-600" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-poppins font-bold text-text-primary mb-2">
                      Ops! Algo deu errado
                    </h3>
                    <p className="font-poppins font-medium text-text-secondary">
                      Erro ao processar pagamento. Por favor, tente novamente.
                    </p>
                    <p className="handwritten text-error-600 mt-2">
                      Desculpe pelo transtorno! 😅
                    </p>
                  </div>
                  <button
                    onClick={() => setPaymentStatus('idle')}
                    className="btn-secondary px-8 py-3"
                  >
                    <span className="font-poppins font-semibold">TENTAR NOVAMENTE</span>
                  </button>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 card p-6 shadow-medium border border-primary-100">
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-text-primary">
                  <CheckCircle className="w-4 h-4 text-success-500" strokeWidth={2} />
                  <span className="font-poppins font-medium">Pagamento Seguro</span>
                </div>
                <div className="flex items-center gap-2 text-text-primary">
                  <Terminal className="w-4 h-4 text-primary-600" strokeWidth={2} />
                  <span className="font-poppins font-medium">Acesso Imediato</span>
                </div>
              </div>
              <p className="text-center text-xs text-text-muted mt-4">
                <span className="handwritten text-primary-600">Feito com ❤️ no Claude Code!</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background-surface border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary-600" strokeWidth={2} />
              </div>
              <span className="text-lg font-poppins font-bold text-text-primary">athena.agi</span>
            </div>

            <div className="space-y-2">
              <p className="font-poppins font-medium text-text-primary">
                © 2025 athena.agi - Workshop de CLI Tools
              </p>
              <p className="text-sm text-text-secondary">
                Dúvidas? Entre em contato pelo email fornecido após a compra
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-text-muted pt-4 border-t border-gray-200">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-success-500" strokeWidth={2} />
                Desenvolvido por Agentik AI
              </span>
              <span className="handwritten text-primary-600">
                Potenciado por Claude Code! 🚀
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
