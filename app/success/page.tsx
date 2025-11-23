"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Sparkles,
  Mail,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const orderIdParam = searchParams.get("order_id");
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }

    // Simular tempo de processamento
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-black shadow-[4px_4px_0px_0px_#000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-green-200 p-3 border-3 border-black rounded-sm shadow-[4px_4px_0px_0px_#000]">
                <Sparkles className="w-8 h-8 text-green-600" strokeWidth={3} />
              </div>
              <h1 className="text-3xl font-black tracking-tight">athena.agi</h1>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border-3 border-black rounded-sm px-4 py-2 font-bold shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={3} />
              Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Success Message */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-12 rounded-md text-center">
            <div className="inline-block bg-green-200 p-6 border-3 border-black rounded-full shadow-[4px_4px_0px_0px_#000] mb-6">
              <CheckCircle
                className="w-16 h-16 text-green-600"
                strokeWidth={3}
              />
            </div>

            {isProcessing ? (
              <>
                <h1 className="text-4xl font-black mb-4">
                  Processando pagamento...
                </h1>
                <p className="text-xl font-medium text-gray-600 mb-4">
                  Aguardando confirmação do Infinite Pay
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Pagamento Confirmado!
                </h1>
                <p className="text-xl font-medium text-gray-600 mb-2">
                  Sua vaga no Workshop Claude Code Pro está garantida
                </p>
                {orderId && (
                  <p className="text-sm font-bold text-gray-500">
                    Pedido: #{orderId}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 rounded-md">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6" strokeWidth={3} />
              Próximos Passos
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-100 border-2 border-black rounded-sm">
                <Mail
                  className="w-6 h-6 flex-shrink-0 text-blue-600"
                  strokeWidth={2.5}
                />
                <div>
                  <p className="font-black">1. Confirme seu email</p>
                  <p className="font-medium">
                    Enviamos um email com todos os detalhes do workshop.
                    Verifique sua caixa de entrada e spam.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-100 border-2 border-black rounded-sm">
                <Calendar
                  className="w-6 h-6 flex-shrink-0 text-purple-600"
                  strokeWidth={2.5}
                />
                <div>
                  <p className="font-black">2. Aguarde a data</p>
                  <p className="font-medium">
                    Você receberá o link da call ao vivo 24h antes do evento.
                    Prepare suas perguntas!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-100 border-2 border-black rounded-sm">
                <Clock
                  className="w-6 h-6 flex-shrink-0 text-green-600"
                  strokeWidth={2.5}
                />
                <div>
                  <p className="font-black">3. Prepare-se</p>
                  <p className="font-medium">
                    Tenha seu computador pronto e instale as ferramentas que
                    vamos usar no workshop.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 rounded-md">
            <h2 className="text-2xl font-black mb-6">O Que Você Receberá:</h2>
            <ul className="space-y-3">
              {[
                "Acesso exclusivo ao Workshop Claude Code Pro",
                "Gravação da sessão para assistir quando quiser",
                "Materiais complementares e guias",
                "Acesso ao grupo VIP de participantes",
                "Certificado de conclusão",
                "Suporte pós-workshop",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-green-50 border-2 border-black rounded-sm"
                >
                  <CheckCircle
                    className="w-5 h-5 text-green-600"
                    strokeWidth={3}
                  />
                  <span className="font-bold">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-3 border-black p-6 rounded-md shadow-[4px_4px_0px_0px_#000]">
            <h3 className="text-xl font-black mb-2">Dúvidas?</h3>
            <p className="font-medium">
              Entre em contato através do email que enviaremos com a confirmação
              da sua inscrição. Nossa equipe está à disposição para ajudar!
            </p>
          </div>

          {/* CTA */}
          {!isProcessing && (
            <div className="text-center">
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 border-4 border-black rounded-sm px-8 py-4 font-black text-lg shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                Explorar Mais Cursos
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="font-bold text-gray-600">
              © 2025 athena.agi - Workshop Claude Code Pro
            </p>
            <p className="text-sm font-medium text-gray-500 mt-2">
              Transformando desenvolvedores em profissionais de IA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
