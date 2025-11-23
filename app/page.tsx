"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Code,
  Terminal,
  Users,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle,
  Loader2,
  Smartphone,
  QrCode,
} from "lucide-react";

export default function WorkshopCheckout() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    paymentMethod: "credit" as "credit" | "debit" | "pix",
    installments: 1,
  });
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [price] = useState(97.0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPaymentStatus("processing");

    try {
      const response = await fetch("/api/infinite-pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: price,
          productId: "wkccpro-workshop-claude-code-pro",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPaymentData(data);
        setPaymentStatus("success");

        // Redirecionar para checkout ou abrir deeplink
        if (data.checkoutUrl) {
          window.open(data.checkoutUrl, "_blank");
        } else if (data.deeplink) {
          // Tentar abrir o app Infinite Pay
          window.location.href = data.deeplink;

          // Fallback para loja em nova aba
          setTimeout(() => {
            window.open(
              "https://loja.infinitepay.io/agentikai/wkccpro-workshop-claude-code-pro",
              "_blank",
            );
          }, 2000);
        }
      } else {
        setPaymentStatus("error");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      setPaymentStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = async () => {
    if (paymentData?.qrCode) {
      try {
        await navigator.clipboard.writeText(paymentData.qrCode);
        alert("Código PIX copiado!");
      } catch (error) {
        console.error("Erro ao copiar:", error);
      }
    }
  };

  useEffect(() => {
    // Ajusta parcelas com base no método de pagamento
    if (formData.paymentMethod === "pix") {
      setFormData((prev) => ({ ...prev, installments: 1 }));
    }
  }, [formData.paymentMethod]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-black shadow-[4px_4px_0px_0px_#000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-200 p-3 border-3 border-black rounded-sm shadow-[4px_4px_0px_0px_#000]">
                <Sparkles className="w-8 h-8 text-purple-600" strokeWidth={3} />
              </div>
              <h1 className="text-3xl font-black tracking-tight">athena.agi</h1>
            </div>
            <div className="hidden sm:block">
              <div className="bg-gradient-to-r from-purple-200 to-pink-200 px-4 py-2 border-3 border-black rounded-sm font-bold shadow-[2px_2px_0px_0px_#000]">
                WORKSHOP PRO
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
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 rounded-md transform hover:scale-[1.02] transition-transform">
              <div className="inline-block bg-gradient-to-r from-purple-300 to-pink-300 px-4 py-2 border-2 border-black rounded-sm font-black text-sm mb-4 shadow-[2px_2px_0px_0px_#000]">
                🔥 OFERTA LIMITADA
              </div>
              <h2 className="text-4xl sm:text-5xl font-black mb-4 leading-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Workshop Claude Code Pro
              </h2>
              <p className="text-xl font-bold mb-6 text-gray-700">
                Domine as ferramentas de IA mais poderosas do mercado
              </p>
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-3 border-black p-6 rounded-sm shadow-[4px_4px_0px_0px_#000]">
                <p className="text-lg leading-relaxed font-medium">
                  Transforme sua produtividade com{" "}
                  <span className="font-black text-purple-600">
                    Claude Code
                  </span>{" "}
                  e <span className="font-black text-pink-600">Gemini CLI</span>
                  . Hands-on, networking e techniques avançadas!
                </p>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 rounded-md">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6" strokeWidth={3} />
                Detalhes do Workshop
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-pink-100 border-2 border-black rounded-sm hover:translate-x-1 transition-transform">
                  <Calendar
                    className="w-6 h-6 flex-shrink-0"
                    strokeWidth={2.5}
                  />
                  <div>
                    <p className="font-black">Data</p>
                    <p className="font-medium">Em breve - Inscreva-se!</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-green-100 border-2 border-black rounded-sm hover:translate-x-1 transition-transform">
                  <Clock className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
                  <div>
                    <p className="font-black">Duração</p>
                    <p className="font-medium">3 horas de conteúdo intensivo</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-blue-100 border-2 border-black rounded-sm hover:translate-x-1 transition-transform">
                  <MapPin className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
                  <div>
                    <p className="font-black">Formato</p>
                    <p className="font-medium">Online - Call ao vivo</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-purple-100 border-2 border-black rounded-sm hover:translate-x-1 transition-transform">
                  <Users className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
                  <div>
                    <p className="font-black">Vagas</p>
                    <p className="font-medium">
                      Grupo limitado para melhor aprendizado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8 rounded-md">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                <Code className="w-6 h-6" strokeWidth={3} />O Que Você Vai
                Dominar
              </h3>
              <ul className="space-y-3">
                {[
                  "Claude Code CLI - Nível profissional",
                  "Gemini CLI - Produtividade máxima",
                  "Workflows avançados e automação",
                  "Técnicas de prompt engineering",
                  "Networking com especialistas",
                  "Projetos práticos e cases reais",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-purple-50 border-2 border-black rounded-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#000] transition-all"
                  >
                    <CheckCircle
                      className="w-5 h-5 flex-shrink-0 text-green-600"
                      strokeWidth={3}
                    />
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
                <div className="inline-block bg-gradient-to-r from-green-200 to-blue-200 px-6 py-3 border-3 border-black rounded-sm shadow-[4px_4px_0px_0px_#000] mb-4">
                  <p className="text-sm font-black text-gray-600">
                    INVESTIMENTO
                  </p>
                  <p className="text-5xl font-black">R$ 97</p>
                  <p className="text-xs font-medium text-gray-500 line-through">
                    R$ 197
                  </p>
                </div>
                <div className="bg-red-100 px-3 py-1 border-2 border-black rounded-sm inline-block">
                  <p className="text-sm font-black text-red-600">
                    50% OFF - Tempo limitado
                  </p>
                </div>
              </div>

              {paymentStatus === "idle" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block font-black mb-2 text-sm">
                      Nome Completo
                    </label>
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
                    <label className="block font-black mb-2 text-sm">
                      Email
                    </label>
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
                    <label className="block font-black mb-2 text-sm">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value);
                        setFormData((prev) => ({ ...prev, phone: formatted }));
                      }}
                      className="w-full px-4 py-3 border-3 border-black rounded-sm font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-all"
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>

                  <div>
                    <label className="block font-black mb-2 text-sm">CPF</label>
                    <input
                      type="text"
                      name="cpf"
                      required
                      value={formData.cpf}
                      onChange={(e) => {
                        const formatted = formatCPF(e.target.value);
                        setFormData((prev) => ({ ...prev, cpf: formatted }));
                      }}
                      className="w-full px-4 py-3 border-3 border-black rounded-sm font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-all"
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>

                  <div>
                    <label className="block font-black mb-2 text-sm">
                      Método de Pagamento
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        name="paymentMethod"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMethod: "credit",
                          }))
                        }
                        className={`p-3 border-3 border-black rounded-sm font-bold transition-all ${
                          formData.paymentMethod === "credit"
                            ? "bg-purple-200 shadow-[2px_2px_0px_0px_#000] translate-x-[1px] translate-y-[1px]"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        Crédito
                      </button>
                      <button
                        type="button"
                        name="paymentMethod"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMethod: "debit",
                          }))
                        }
                        className={`p-3 border-3 border-black rounded-sm font-bold transition-all ${
                          formData.paymentMethod === "debit"
                            ? "bg-purple-200 shadow-[2px_2px_0px_0px_#000] translate-x-[1px] translate-y-[1px]"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        Débito
                      </button>
                      <button
                        type="button"
                        name="paymentMethod"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            paymentMethod: "pix",
                          }))
                        }
                        className={`p-3 border-3 border-black rounded-sm font-bold transition-all ${
                          formData.paymentMethod === "pix"
                            ? "bg-purple-200 shadow-[2px_2px_0px_0px_#000] translate-x-[1px] translate-y-[1px]"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        PIX
                      </button>
                    </div>
                  </div>

                  {formData.paymentMethod !== "pix" && (
                    <div>
                      <label className="block font-black mb-2 text-sm">
                        Parcelas
                      </label>
                      <select
                        name="installments"
                        value={formData.installments}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-3 border-black rounded-sm font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-all"
                      >
                        <option value={1}>
                          1x R$ {price.toFixed(2)} sem juros
                        </option>
                        <option value={2}>
                          2x R$ {(price / 2).toFixed(2)} sem juros
                        </option>
                        <option value={3}>
                          3x R$ {(price / 3).toFixed(2)} sem juros
                        </option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 border-4 border-black rounded-sm py-4 font-black text-lg shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          className="w-5 h-5 animate-spin"
                          strokeWidth={3}
                        />
                        Processando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" strokeWidth={3} />
                        GARANTIR MINHA VAGA AGORA
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-600">
                    <Smartphone className="w-4 h-4" strokeWidth={3} />
                    <span>Pagamento seguro via Infinite Pay</span>
                  </div>
                </form>
              )}

              {paymentStatus === "success" && paymentData && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-block bg-green-200 p-4 border-3 border-black rounded-full shadow-[4px_4px_0px_0px_#000] mb-4">
                      <CheckCircle className="w-12 h-12" strokeWidth={3} />
                    </div>
                    <h3 className="text-2xl font-black mb-2">
                      Pagamento Iniciado!
                    </h3>
                    <p className="font-bold text-gray-600">
                      {paymentData.checkoutUrl
                        ? "Redirecionando para checkout..."
                        : paymentData.deeplink
                          ? "Abrindo Infinite Pay..."
                          : "QR Code PIX gerado!"}
                    </p>
                  </div>

                  {paymentData.qrCode && (
                    <div className="bg-blue-100 border-3 border-black p-6 rounded-sm shadow-[4px_4px_0px_0px_#000]">
                      <div className="bg-white p-4 border-2 border-black rounded-sm mb-4 flex justify-center">
                        <QrCode className="w-32 h-32 text-black" />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="font-black text-sm mb-2">Código PIX:</p>
                          <div className="bg-white p-3 border-2 border-black rounded-sm font-mono text-xs break-all">
                            {paymentData.qrCode}
                          </div>
                        </div>
                        <button
                          onClick={copyPixCode}
                          className="w-full bg-yellow-300 hover:bg-yellow-400 border-3 border-black rounded-sm py-3 font-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                          COPIAR CÓDIGO PIX
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-purple-100 border-2 border-black p-4 rounded-sm">
                    <p className="text-sm font-bold text-center">
                      🎉 Após a confirmação, você receberá todos os detalhes por
                      email
                    </p>
                  </div>
                </div>
              )}

              {paymentStatus === "error" && (
                <div className="text-center space-y-4">
                  <div className="bg-red-200 border-3 border-black p-6 rounded-sm shadow-[4px_4px_0px_0px_#000]">
                    <p className="font-black text-lg mb-2">Erro ao processar</p>
                    <p className="font-medium">Por favor, tente novamente</p>
                  </div>
                  <button
                    onClick={() => setPaymentStatus("idle")}
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
                  <span>Pagamento 100% Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4" strokeWidth={3} />
                  <span>Acesso Imediato</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" strokeWidth={3} />
                  <span>Suporte Especial</span>
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
              © 2025 athena.agi - Workshop Claude Code Pro
            </p>
            <p className="text-sm font-medium text-gray-500 mt-2">
              Dúvidas? Entre em contato após a compra
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
