'use client';

import { useEffect, useState, useRef } from 'react';
import { CheckCircle, ArrowLeft, Sparkles, Clock, Mail, Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import { fireConfetti, fireworksConfetti, Confetti } from '@/components/ui/confetti';
import ConfettiExplosion from 'react-confetti-explosion';

export default function SuccessPage() {
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExploding, setIsExploding] = useState(false);
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    // Trigger multiple confetti effects
    setIsExploding(true);

    // Delayed confetti for more celebration
    setTimeout(() => {
      fireConfetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
      });
    }, 500);

    setTimeout(() => {
      fireworksConfetti();
    }, 1000);

    // Get URL parameters to show order information
    const urlParams = new URLSearchParams(window.location.search);
    const billingId = urlParams.get('billing_id');
    const paymentId = urlParams.get('payment_id');

    setOrderInfo({
      billingId,
      paymentId,
      orderNumber: `WSK-${Date.now().toString().slice(-6)}`
    });
    setLoading(false);
  }, []);

  return (
    <>
      {/* Confetti Explosion on load */}
      {isExploding && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <ConfettiExplosion
            particleCount={100}
            width={2000}
            height={1600}
            colors={['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']}
          />
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Main Card */}
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none p-8 relative overflow-hidden">

            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)`,
              }}></div>
            </div>

            {/* Success Icon with Animation */}
            <div className="flex justify-center mb-6 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-green-200 rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-green-100 to-green-200 border-4 border-black rounded-full p-4 animate-bounce">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
            </div>

            {/* Title with Emoji */}
            <h1 className="text-4xl font-black text-center mb-2 relative z-10">
              Uhu! <span className="text-green-600">Aprovado!</span> 🎉
            </h1>

            <p className="text-gray-600 text-center mb-6 font-medium relative z-10">
              Sua inscrição no Workshop CLI Tools está confirmada!
            </p>

            {/* Order Information */}
            {!loading && orderInfo && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-4 border-black rounded-none p-4 mb-6 relative z-10">
                <div className="flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 mr-2 text-purple-600 animate-pulse" />
                  <span className="font-bold text-lg">Pedido #{orderInfo.orderNumber}</span>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  {orderInfo.billingId && (
                    <div className="flex items-center bg-white/50 p-2 rounded">
                      <span className="mr-2">📋</span>
                      <span>Cobrança: {orderInfo.billingId.slice(-10)}...</span>
                    </div>
                  )}
                  {orderInfo.paymentId && (
                    <div className="flex items-center bg-white/50 p-2 rounded">
                      <span className="mr-2">💳</span>
                      <span>Pagamento: {orderInfo.paymentId.slice(-10)}...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Event Details */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-4 border-black rounded-none p-4 mb-6 relative z-10">
              <h2 className="font-black text-xl mb-4 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-purple-600" />
                Detalhes do Evento
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-purple-600 mt-0.5" />
                  <div>
                    <span className="font-bold">Local:</span> Online (Ao Vivo)
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-3 text-purple-600 mt-0.5" />
                  <div>
                    <div><span className="font-bold">Data:</span> 21 de Dezembro, 2024</div>
                    <div><span className="font-bold">Horário:</span> 19h00 - 22h00 (BRT)</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 mr-3 text-purple-600 mt-0.5" />
                  <div>
                    <span className="font-bold">Acesso:</span> Link enviado 24h antes
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border-4 border-black rounded-none p-4 mb-6 relative z-10">
              <h3 className="font-black text-lg mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                O que acontece agora?
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
                  <span className="text-sm">Confirme seu e-mail</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
                  <span className="text-sm">Receba link de acesso</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
                  <span className="text-sm">Prepare suas ferramentas CLI!</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 relative z-10">
              <Link
                href="/"
                className="w-full bg-gradient-to-r from-black to-gray-800 text-white font-black py-4 px-6 border-4 border-black hover:from-gray-800 hover:to-gray-700 transition-all transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Voltar para Início
              </Link>

              <a
                href="mailto:contato@athena.agi?subject=Workshop CLI Tools - Dúvidas&body=Olá! Tenho dúvidas sobre o workshop CLI Tools."
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black py-4 px-6 border-4 border-black hover:from-pink-600 hover:to-purple-700 transition-all transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Falar com Suporte
              </a>
            </div>

            {/* Celebration Text */}
            <div className="text-center mt-6 relative z-10">
              <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 transform -rotate-2 font-bold">
                🚀 Bem-vindo ao futuro da automação!
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-6 text-sm text-gray-600">
            <p className="font-medium">✨ Obrigado por fazer parte do Workshop CLI Tools!</p>
            <p>Prepare-se para elevar suas habilidades. 🎯</p>
            <p className="font-mono text-xs text-gray-500 mt-2">
              POWERED_BY: <span className="font-bold">Agentik AI</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}