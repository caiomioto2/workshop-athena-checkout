'use client';

import { useState } from 'react';
import { Sparkles, Code, Terminal, Users, Calendar, Clock, MapPin, CreditCard, CheckCircle, Loader2 } from 'lucide-react';

export default function WorkshopCheckout() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: ''
  });
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeUrl: string; txid: string } | null>(null);

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
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: 97.00 // Valor do workshop
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPixData(data);
        setPaymentStatus('success');
      } else {
        setPaymentStatus('error');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-black shadow-[4px_4px_0px_0px_#000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-pink-200 p-3 border-3 border-black rounded-sm shadow-[4px_4px_0px_0px_#000]">
                <Sparkles className="w-8 h-8" strokeWidth={3} />
              </div>
              <h1 className="text-3xl font-black tracking-tight">athena.agi</h1>
            </div>
            <div className="hidden sm:block">
              <div className="bg-green-200 px-4 py-2 border-3 border-black rounded-sm font-bold shadow-[2px_2px_0px_0px_#000]">
                WORKSHOP
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Event Info */}
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 rounded-md">
              <div className="inline-block bg-yellow-300 px-4 py-2 border-2 border-black rounded-sm font-black text-sm mb-4 shadow-[2px_2px_0px_0px_#000]">
                🔥 VAGAS LIMITADAS
              </div>
              <h2 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
                Workshop de CLI Tools
              </h2>
              <p className="text-xl font-bold mb-6 text-gray-700">
                Claude Code & Gemini CLI - Networking & Hands-on
              </p>
              <div className="bg-blue-100 border-3 border-black p-6 rounded-sm shadow-[4px_4px_0px_0px_#000]">
                <p className="text-lg leading-relaxed font-medium">
                  Aprenda a dominar as ferramentas mais poderosas de IA para desenvolvimento:
                  <span className="font-black"> Claude Code</span> e
                  <span className="font-black"> Gemini CLI</span>.
                  Networking, prática e muito aprendizado!
                </p>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 rounded-md">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6" strokeWidth={3} />
                Detalhes do Evento
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-pink-100 border-2 border-black rounded-sm">
                  <Calendar className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
                  <div>
                    <p className="font-black">Data</p>
                    <p className="font-medium">A definir (em breve)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-green-100 border-2 border-black rounded-sm">
                  <Clock className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
                  <div>
                    <p className="font-black">Duração</p>
                    <p className="font-medium">2-3 horas de conteúdo intensivo</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-blue-100 border-2 border-black rounded-sm">
                  <MapPin className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
                  <div>
                    <p className="font-black">Formato</p>
                    <p className="font-medium">Online - Call ao vivo</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-yellow-100 border-2 border-black rounded-sm">
                  <Users className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
                  <div>
                    <p className="font-black">Vagas</p>
                    <p className="font-medium">Limitadas para melhor experiência</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 rounded-md">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                <Code className="w-6 h-6" strokeWidth={3} />
                O Que Você Vai Aprender
              </h3>
              <ul className="space-y-3">
                {[
                  'Como usar Claude Code CLI e IDE de forma profissional',
                  'Dominar o Gemini CLI para produtividade máxima',
                  'Técnicas avançadas e casos de uso práticos',
                  'Networking com outros entusiastas de IA',
                  'Boas práticas e workflows eficientes'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 border-2 border-black rounded-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" strokeWidth={3} />
                    <span className="font-bold">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Checkout Form */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 rounded-md">
              <div className="text-center mb-6">
                <div className="inline-block bg-green-200 px-6 py-3 border-3 border-black rounded-sm shadow-[4px_4px_0px_0px_#000] mb-4">
                  <p className="text-sm font-black text-gray-600">INVESTIMENTO</p>
                  <p className="text-5xl font-black">R$ 97</p>
                </div>
                <p className="text-sm font-bold text-gray-600">Pagamento via Pix</p>
              </div>

              {paymentStatus === 'idle' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-black mb-2 text-sm">Nome Completo</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-3 border-black rounded-sm font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-all"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="block font-black mb-2 text-sm">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-3 border-black rounded-sm font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block font-black mb-2 text-sm">Telefone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-3 border-black rounded-sm font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-all"
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block font-black mb-2 text-sm">CPF</label>
                    <input
                      type="text"
                      name="cpf"
                      required
                      value={formData.cpf}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-3 border-black rounded-sm font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-all"
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-pink-300 hover:bg-pink-400 border-4 border-black rounded-sm py-4 font-black text-lg shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" strokeWidth={3} />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" strokeWidth={3} />
                        GARANTIR MINHA VAGA
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-600 font-medium">
                    Pagamento seguro via <span className="font-black">AbaCatePay</span>
                  </p>
                </form>
              )}

              {paymentStatus === 'success' && pixData && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-block bg-green-200 p-4 border-3 border-black rounded-full shadow-[4px_4px_0px_0px_#000] mb-4">
                      <CheckCircle className="w-12 h-12" strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-black mb-2">QR Code Gerado!</h3>
                    <p className="font-bold text-gray-600">Escaneie o QR Code ou copie o código Pix</p>
                  </div>

                  <div className="bg-blue-100 border-3 border-black p-6 rounded-sm shadow-[4px_4px_0px_0px_#000]">
                    <div className="bg-white p-4 border-2 border-black rounded-sm mb-4 flex justify-center">
                      <img src={pixData.qrCodeUrl} alt="QR Code Pix" className="w-64 h-64" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="font-black text-sm mb-2">Código Pix:</p>
                        <div className="bg-white p-3 border-2 border-black rounded-sm font-mono text-xs break-all">
                          {pixData.qrCode}
                        </div>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(pixData.qrCode)}
                        className="w-full bg-yellow-300 hover:bg-yellow-400 border-3 border-black rounded-sm py-3 font-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                      >
                        COPIAR CÓDIGO PIX
                      </button>
                    </div>
                  </div>

                  <div className="bg-pink-100 border-2 border-black p-4 rounded-sm">
                    <p className="text-sm font-bold text-center">
                      ⏰ Após o pagamento, você receberá as informações do evento por email
                    </p>
                  </div>
                </div>
              )}

              {paymentStatus === 'error' && (
                <div className="text-center space-y-4">
                  <div className="bg-red-200 border-3 border-black p-6 rounded-sm shadow-[4px_4px_0px_0px_#000]">
                    <p className="font-black text-lg mb-2">Erro ao processar pagamento</p>
                    <p className="font-medium">Por favor, tente novamente</p>
                  </div>
                  <button
                    onClick={() => setPaymentStatus('idle')}
                    className="bg-blue-300 hover:bg-blue-400 border-3 border-black rounded-sm px-6 py-3 font-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    TENTAR NOVAMENTE
                  </button>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000] p-6 rounded-sm">
              <div className="flex items-center justify-center gap-4 text-sm font-bold text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" strokeWidth={3} />
                  <span>Pagamento Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4" strokeWidth={3} />
                  <span>Acesso Imediato</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="font-bold text-gray-600">
              © 2025 athena.agi - Workshop de CLI Tools
            </p>
            <p className="text-sm font-medium text-gray-500 mt-2">
              Dúvidas? Entre em contato pelo email fornecido após a compra
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
