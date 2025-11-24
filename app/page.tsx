"use client";

import { useState } from "react";
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
} from "lucide-react";
import WorkshopCards from "../components/WorkshopCards";
import TerminalCard from "../components/TerminalCard";
import { fireConfetti } from "@/components/ui/confetti";

export default function WorkshopCheckout() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [pixData, setPixData] = useState<{
    qrCode?: string;
    qrCodeUrl?: string;
    paymentUrl?: string;
    billingId: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    phone?: string;
    cpf?: string;
  }>({});

  // CPF validation function
  const validateCPF = (cpf: string): boolean => {
    // Remove all non-digit characters
    const cleanCPF = cpf.replace(/\D/g, "");

    // Check if CPF has exactly 11 digits
    if (cleanCPF.length !== 11) return false;

    // Check if all digits are the same (invalid CPF)
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

    // Calculate first verification digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;

    // Calculate second verification digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;

    // Check if the calculated digits match the provided ones
    return (
      parseInt(cleanCPF.charAt(9)) === digit1 &&
      parseInt(cleanCPF.charAt(10)) === digit2
    );
  };

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation function (Brazilian phone numbers)
  const validatePhone = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, "");

    // Check if it has 10 or 11 digits (with or without 9)
    return cleanPhone.length === 10 || cleanPhone.length === 11;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Real-time validation
    const newFieldErrors = { ...fieldErrors };

    if (name === "email") {
      if (value && !validateEmail(value)) {
        newFieldErrors.email = "Email inválido";
      } else {
        delete newFieldErrors.email;
      }
    }

    if (name === "phone") {
      if (value && !validatePhone(value)) {
        newFieldErrors.phone = "Celular inválido";
      } else {
        delete newFieldErrors.phone;
      }
    }

    if (name === "cpf") {
      if (value && !validateCPF(value)) {
        newFieldErrors.cpf = "";
      } else {
        delete newFieldErrors.cpf;
      }
    }

    setFieldErrors(newFieldErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate CPF first
    if (!validateCPF(formData.cpf)) {
      setPaymentStatus("error");
      setErrorMessage("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      setPaymentStatus("error");
      setErrorMessage(
        "Email inválido. Verifique se você digitou um email válido (ex: nome@dominio.com).",
      );
      setLoading(false);
      return;
    }

    // Validate phone
    if (!validatePhone(formData.phone)) {
      setPaymentStatus("error");
      setErrorMessage(
        "Celular inválido. Verifique se você digitou um número válido com DDD (ex: (11) 99999-9999).",
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setPaymentStatus("processing");

    try {
      const response = await fetch("/api/infinite-pay/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            document: formData.cpf,
          },
          items: [
            {
              name: "Workshop Claude Code Pro",
              description:
                "Workshop de Claude Code & Gemini CLI - Networking & Hands-on",
              quantity: 1,
              price: 500, // R$ 5,00 em centavos (para teste)
            },
          ],
          order_nsu: `ATHENA-${Date.now()}`,
          redirect_url: `${window.location.origin}/success`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to Infinite Pay checkout URL
        if (data.url) {
          window.location.href = data.url;
        } else {
          // Fallback: Show checkout URL as QR code for manual access
          setPixData({
            qrCode: data.url || "checkout-url-unavailable",
            qrCodeUrl: data.url || "#",
            paymentUrl: data.url,
            billingId: data.order_nsu,
          });
          setPaymentStatus("success");
        }
        console.log("Cobrança criada:", data);

        // Trigger basic confetti when payment is successful
        setTimeout(() => {
          fireConfetti({
            particleCount: 50,
            spread: 45,
            origin: { y: 0.6 },
            colors: ["#26ccff", "#a25afd", "#ff5e7e"],
          });
        }, 300);
      } else {
        setPaymentStatus("error");
        // Check if error might be related to invalid CPF
        const errorMsg = data.error || "";
        if (
          errorMsg.toLowerCase().includes("taxid") ||
          errorMsg.toLowerCase().includes("cpf")
        ) {
          setErrorMessage("Erro ao conectar com o servidor. Tente novamente.");
        } else {
          setErrorMessage(
            `${data.error || "Erro ao processar pagamento. Tente novamente."}`,
          );
        }
        console.error("Erro pagamento:", data);
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      setPaymentStatus("error");
      setErrorMessage(
        `Erro ao conectar com o servidor. Tente novamente. ⚠️ Verifique se seu CPF está correto.`,
      );
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
            <p className="text-sm font-mono text-claude-dark/70">
              por Agentik AI
            </p>
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
              <span className="bg-claude-accent text-claude-dark px-2 py-1 font-bold font-mono text-xs">
                VAGAS_LIMITADAS
              </span>
              <span className="text-claude-accent font-vt323 text-xl animate-pulse">
                🔥 oferta_expira_em_breve
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-vt323 text-claude-text mb-6 leading-none">
              WORKSHOP <br />
              <span className="text-claude-accent">CLAUDE_CODE_PRO</span>
            </h2>

            <p className="text-xl font-mono text-claude-dim mb-8 border-l-2 border-claude-accent pl-4">
              Stack IA-first: Claude Code, Router, GLM e MCP — 3h Ao Vivo
            </p>

            <div className="bg-[#1a1a1a] border border-claude-border p-6 font-mono text-sm text-claude-dim">
              <p className="mb-4">
                <span className="text-claude-accent mr-2">$</span>
                <span className="text-claude-text">
                  ./run_workshop --focus=productivity
                </span>
              </p>
              <p>
                Carregando módulo...{" "}
                <span className="text-claude-accent">Claude Code Router</span>
                <br />
                Carregando módulo...{" "}
                <span className="text-claude-accent">GLM</span>
                <br />
                Carregando módulo...{" "}
                <span className="text-claude-accent">Ecossistema MCP</span>
                <br />
                <br />
                <span className="text-[#27C93F]">
                  {`>>`} PRONTO PARA ACELERAR O DESENVOLVIMENTO
                </span>
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
                { icon: Calendar, label: "DATA", value: "EM_BREVE" },
                { icon: Clock, label: "DURAÇÃO", value: "3H_AO_VIVO" },
                { icon: MapPin, label: "LOCAL", value: "ONLINE_MEET" },
                { icon: Users, label: "CAPACIDADE", value: "VAGAS_LIMITADAS" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-[#1a1a1a] border border-claude-border p-4 hover:border-claude-accent transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="w-5 h-5 text-claude-dim group-hover:text-claude-accent transition-colors" />
                    <span className="font-mono text-xs text-claude-dim">
                      {item.label}
                    </span>
                  </div>
                  <p className="font-vt323 text-xl text-claude-text">
                    {item.value}
                  </p>
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
                <h4 className="text-3xl font-vt323 text-claude-text mb-2">
                  CAIO MIOTO
                </h4>
                <p className="font-mono text-claude-accent text-sm mb-4">
                  CEO @ AGENTIK_AI
                </p>
                <p className="font-mono text-sm text-claude-dim leading-relaxed">
                  "Especialista em Automação & IA para Marketing e Vendas. Vou
                  ser seu guia e mostrar como eu uso o Claude Code para
                  construir sites igual esse que você está agora."
                </p>
              </div>
            </div>
          </TerminalCard>

          <TerminalCard title="curriculum.tree">
            <h3 className="text-2xl font-vt323 text-claude-text mb-8">
              ESTRUTURA_DO_WORKSHOP
            </h3>
            <div className="min-h-[350px]">
              <WorkshopCards />
            </div>
          </TerminalCard>
        </div>

        {/* Right Column */}
        <div className="lg:sticky lg:top-8 h-fit">
          <TerminalCard
            title="payment_gateway.exe"
            className="border-claude-accent"
          >
            <div className="text-center mb-8 border-b border-claude-border pb-8">
              <div className="inline-block bg-claude-accent text-claude-dark px-4 py-1 font-vt323 text-xl mb-4">
                OFERTA_UNICA
              </div>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-2xl font-mono text-claude-dim">R$</span>
                <span className="text-7xl font-vt323 text-claude-text">20</span>
              </div>
              <p className="font-mono text-xs text-claude-dim">
                METODO_PAGAMENTO: PIX
              </p>
            </div>

            {paymentStatus === "idle" && !showForm && (
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

            {paymentStatus === "idle" && showForm && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: "name", label: "NOME" },
                  { id: "email", label: "EMAIL" },
                  { id: "phone", label: "CELULAR" },
                  { id: "cpf", label: "CPF" },
                ].map((field) => (
                  <div key={field.id}>
                    <label className="block font-mono text-xs text-claude-accent mb-1 uppercase">
                      {field.label}
                    </label>
                    <input
                      type={
                        field.id === "email"
                          ? "email"
                          : field.id === "phone"
                            ? "tel"
                            : "text"
                      }
                      name={field.id}
                      required
                      value={(formData as any)[field.id]}
                      onChange={handleInputChange}
                      className={`w-full bg-[#1a1a1a] border font-mono px-4 py-3 focus:outline-none transition-colors ${
                        fieldErrors[field.id as keyof typeof fieldErrors]
                          ? "border-red-500 text-red-400"
                          : "border-claude-border text-claude-text focus:border-claude-accent"
                      }`}
                      placeholder={`Digite ${field.label}...`}
                    />
                    {fieldErrors[field.id as keyof typeof fieldErrors] && (
                      <p className="text-red-500 text-xs font-mono mt-1">
                        ⚠️ {fieldErrors[field.id as keyof typeof fieldErrors]}
                      </p>
                    )}
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
                    "[ CONFIRMAR_TRANSACAO ]"
                  )}
                </button>
              </form>
            )}

            {paymentStatus === "success" && pixData && (
              <div className="text-center space-y-6">
                <div className="bg-[#27C93F]/20 border border-[#27C93F] p-4">
                  <p className="font-vt323 text-2xl text-[#27C93F]">
                    TRANSACTION_CREATED
                  </p>
                </div>

                {pixData.qrCodeUrl ? (
                  <div className="bg-white p-4 inline-block mx-auto border-4 border-white">
                    <img
                      src={pixData.qrCodeUrl}
                      alt="QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <p className="font-mono text-sm text-claude-dim mb-2">
                      Finalize o pagamento abaixo:
                    </p>

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
                      className="inline-block bg-claude-accent text-claude-dark font-vt323 text-xl py-2 px-6 border-2 border-claude-text shadow-[4px_4px_0px_0px_#F0F0F0] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#F0F0F0] transition-all"
                    >
                      [ ABRIR_EM_NOVA_ABA ]
                    </a>
                  </div>
                )}

                {pixData.qrCode && (
                  <div className="space-y-2">
                    <p className="font-mono text-xs text-claude-dim">
                      PIX_COPY_PASTE:
                    </p>
                    <div className="bg-[#1a1a1a] p-3 border border-claude-border font-mono text-xs text-claude-dim break-all">
                      {pixData.qrCode}
                    </div>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(pixData.qrCode!)
                      }
                      className="w-full border border-claude-dim text-claude-dim font-mono text-xs py-2 hover:bg-claude-dim hover:text-claude-dark transition-colors"
                    >
                      [ COPY_CODE ]
                    </button>
                  </div>
                )}
              </div>
            )}

            {paymentStatus === "error" && (
              <div className="bg-red-500/20 border border-red-500 p-6 text-center">
                <p className="font-vt323 text-xl text-red-500 mb-4">
                  ERROR: TRANSACTION_FAILED
                </p>
                {errorMessage && (
                  <p className="text-red-400 text-sm mb-4 font-mono">
                    {errorMessage}
                  </p>
                )}
                <button
                  onClick={() => {
                    setPaymentStatus("idle");
                    setErrorMessage("");
                  }}
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
          © 2025 FERRAMENTAS_CLI_WORKSHOP <br />
          POWERED_BY: <span className="font-bold">Agentik AI</span>
        </p>
      </footer>
    </div>
  );
}
