"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Bot,
  Cpu,
  FileJson,
  ChevronLeft,
  ChevronRight,
  Square,
  Circle,
} from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import confetti from "canvas-confetti";

// --- STYLES & CONFIG INJECTION ---
// This component loads Tailwind via CDN and configures the custom theme
// It also loads the necessary fonts.
const StyleInjector = () => {
  useEffect(() => {
    // 1. Load Fonts (check if already exists)
    const fontUrl = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=VT323&family=Poppins:wght@400;600;700&display=swap";
    if (!document.querySelector(`link[href="${fontUrl}"]`)) {
        const link = document.createElement("link");
        link.href = fontUrl;
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }

    // 2. Configure Tailwind
    // We check if tailwind is already on window, if not we add the script.
    // Note: In a real production app, you'd want to use built CSS, but for a drag-and-drop Framer component,
    // injecting the CDN is the most reliable way to get all classes working without complex setup.

    // Define the config object
    const tailwindConfig = {
      theme: {
        extend: {
          colors: {
            claude: {
              bg: '#DD8468',
              dark: '#121212',
              accent: '#FF5E3A',
              text: '#F0F0F0',
              dim: '#888888',
              border: '#333333',
            },
          },
          fontFamily: {
            'mono': ['"JetBrains Mono"', 'monospace'],
            'vt323': ['"VT323"', 'monospace'],
            'poppins': ['Poppins', 'sans-serif'],
          },
        },
      },
    };

    // Helper to check if script exists
    const existingScript = document.querySelector('script[src*="tailwindcss"]');

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => {
        // @ts-ignore
        if (window.tailwind) {
          // @ts-ignore
          window.tailwind.config = tailwindConfig;
        }
      };
      document.head.appendChild(script);
    } else {
      // If already loaded, try to extend config
      // @ts-ignore
      if (window.tailwind) {
         // @ts-ignore
         // We might be overwriting or extending. Safe bet is just setting it if it's not set for this scope.
         // But for simplicity, we assume this component "owns" the page style in the context of Framer.
         window.tailwind.config = tailwindConfig;
      }
    }

    return () => {
      // Cleanup if necessary (usually not needed for global scripts)
      // document.head.removeChild(link);
    };
  }, []);

  return null;
};

// --- SUB-COMPONENTS ---

// 1. TerminalCard
interface TerminalCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const TerminalCard = ({ children, title = 'bash', className = '' }: TerminalCardProps) => {
  return (
    <div className={`bg-claude-dark border border-claude-border rounded-lg overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] ${className}`}>
      {/* Terminal Header */}
      <div className="bg-[#1a1a1a] px-4 py-2 flex items-center gap-2 border-b border-claude-border">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
        <div className="flex-1 text-center text-claude-dim text-xs font-mono ml-[-3.5rem]">
          {title}
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

// 2. WorkshopCards (Logic included)
interface Topic {
  id: number;
  duration: string;
  title: string;
  items: string[];
  tagline: string;
  theme: 'claude' | 'router' | 'mcp' | 'spec' | 'network';
}

const topics: Topic[] = [
  {
    id: 1,
    duration: '30min',
    title: 'TOPICO_01: CLAUDE_CODE',
    items: [
      '> Comandos CLI & Arquivos',
      '> Refatoração & Debugging',
      '> Workflows Simples'
    ],
    tagline: 'INICIANDO_SISTEMA...',
    theme: 'claude'
  },
  {
    id: 2,
    duration: '25min',
    title: 'TOPICO_02: ROUTER + GLM',
    items: [
      '> Pipeline Multi-Modelo',
      '> Otimização de Custos',
      '> Lógica de Roteamento'
    ],
    tagline: 'OTIMIZANDO_CUSTOS...',
    theme: 'router'
  },
  {
    id: 3,
    duration: '30min',
    title: 'TOPICO_03: MCP_PLUGINS',
    items: [
      '> Skills & Ações',
      '> Instalação via Marketplace',
      '> Automações Práticas'
    ],
    tagline: 'CONECTANDO_PLUGINS...',
    theme: 'mcp'
  },
  {
    id: 4,
    duration: '25min',
    title: 'TOPICO_04: SPEC_ARCH',
    items: [
      '> Geração de Specs com IA',
      '> Desenv. Orientado a Specs',
      '> Coerência Estrutural'
    ],
    tagline: 'COMPILANDO_SPECS...',
    theme: 'spec'
  },
  {
    id: 5,
    duration: '20min',
    title: 'TOPICO_05: NETWORKING',
    items: [
      '> Tira-dúvidas Geral',
      '> Troca de Experiências',
      '> Encerramento'
    ],
    tagline: 'CONEXAO_ESTABELECIDA...',
    theme: 'network'
  }
];

const Card = ({ topic, index, setTopics }: { topic: Topic; index: number; setTopics: React.Dispatch<React.SetStateAction<Topic[]>> }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-5, 5]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 50) {
      setTopics((prev) => {
        const newTopics = [...prev];
        const movedTopic = newTopics.shift();
        if (movedTopic) newTopics.push(movedTopic);
        return newTopics;
      });
    }
  };

  const getIcon = (theme: string) => {
    switch (theme) {
      case 'claude': return <Bot className="w-5 h-5" />;
      case 'router': return <Cpu className="w-5 h-5" />;
      case 'mcp': return <Terminal className="w-5 h-5" />;
      case 'spec': return <FileJson className="w-5 h-5" />;
      case 'network': return <Users className="w-5 h-5" />;
      default: return <Code className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      style={{
        gridRow: 1,
        gridColumn: 1,
        x: index === 0 ? x : 0,
        rotate: index === 0 ? rotate : 0,
        opacity: index === 0 ? opacity : 1 - index * 0.15,
        scale: 1 - index * 0.05,
        zIndex: topics.length - index,
        y: index * 8, // Less vertical offset
      }}
      drag={index === 0 ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{
        scale: 1 - index * 0.05,
        y: index * 8,
        zIndex: topics.length - index,
        opacity: index < 3 ? 1 - index * 0.1 : 0 // Hide cards deeper in stack
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`relative w-full cursor-grab active:cursor-grabbing`}
    >
      <div className="bg-[#1e1e1e] border-2 border-claude-text p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-dashed border-claude-dim pb-4">
           <div className="flex items-center gap-2 font-mono text-claude-accent">
              {getIcon(topic.theme)}
              <span className="font-bold">{topic.duration}</span>
           </div>
           <div className="text-xs font-mono text-claude-dim">
             ID: 0{topic.id}
           </div>
        </div>

        <h3 className="font-vt323 text-2xl text-claude-text mb-4 uppercase tracking-wide">
          {topic.title}
        </h3>

        <ul className="space-y-3 font-mono text-sm text-claude-text mb-6">
          {topic.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-claude-dim opacity-50"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-2 border-t border-dashed border-claude-dim">
           <p className="font-mono text-xs text-claude-accent animate-pulse">
             {topic.tagline}
           </p>
        </div>
      </div>
    </motion.div>
  );
};

const WorkshopCards = () => {
  const [activeTopics, setActiveTopics] = useState(topics);

  const cycleNext = () => {
    setActiveTopics((prev) => {
      const newTopics = [...prev];
      const movedTopic = newTopics.shift();
      if (movedTopic) newTopics.push(movedTopic);
      return newTopics;
    });
  };

  const cyclePrev = () => {
    setActiveTopics((prev) => {
      const newTopics = [...prev];
      const movedTopic = newTopics.pop();
      if (movedTopic) newTopics.unshift(movedTopic);
      return newTopics;
    });
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
        <div className="h-[380px] perspective-1000 grid place-items-center mb-8">
            {activeTopics.map((topic, index) => {
                // Only render the first 3 cards
                if (index > 2) return null;
                return (
                    <Card
                        key={topic.id}
                        topic={topic}
                        index={index}
                        setTopics={setActiveTopics}
                    />
                );
            })}
        </div>

        <div className="flex justify-center items-center gap-8">
            <button
                onClick={cyclePrev}
                className="p-2 text-claude-dim hover:text-claude-accent border border-transparent hover:border-claude-accent transition-all"
                aria-label="Previous topic"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <div className="text-center text-sm font-mono text-claude-dark">
                <span>[ {activeTopics[0].id} / {topics.length} ]</span>
            </div>
            <button
                onClick={cycleNext}
                className="p-2 text-claude-dim hover:text-claude-accent border border-transparent hover:border-claude-accent transition-all"
                aria-label="Next topic"
            >
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>
    </div>
  );
};

// 3. ComoFunciona
interface TopicBlock {
  id: number;
  title: string;
  content: string;
}

const ComoFuncionaBlock = ({ title, content }: { title: string; content: string }) => (
  <div className="border border-claude-border/50 bg-claude-dark/30 p-4 space-y-2">
    <h3 className="text-orange-500 font-vt323 text-lg font-bold">
      {title}
    </h3>
    <div className="flex items-start space-x-2">
      <span className="text-orange-500 font-vt323 font-bold mt-1">{`>`}</span>
      <p className="text-gray-300 font-mono text-sm leading-relaxed flex-1">
        {content}
      </p>
    </div>
  </div>
);

const ComoFunciona = () => {
  const topics: TopicBlock[] = [
    {
      id: 1,
      title: "DOMÍNIO COMPLETO DO CLAUDE CODE",
      content: "Você vai aprender os comandos essenciais do Claude Codesetup inicial ."
    },
    {
      id: 2,
      title: "MODELOS ILIMITADOS COM ROUTER + GLM",
      content: "Conecte múltiplos modelos de IA sem gastar fortunas. Você vai ver como usar GLM, Gemini e outros modelos para reduzir custos e aumentar sua capacidade de desenvolvimento."
    },
    {
      id: 3,
      title: "PLUGINS MCP NA PRÁTICA",
      content: "Instale e configure plugins do marketplace MCP. Crie automações e integrações que funcionam de verdade, sem precisar ser programador expert."
    },
    {
      id: 4,
      title: "ARQUITETURA POR ESPECIFICAÇÃO",
      content: "Aprenda a criar specs profissionais que geram projetos completos. É assim que empresas sérias desenvolvem software... e você vai dominar isso em 25 minutos."
    },
    {
      id: 5,
      title: "BOILERPLATES IA-FIRST",
      content: "Use templates estruturados para manter qualidade e escalar seus projetos. Nada de código bagunçado... só estrutura limpa e reutilizável."
    },
    {
      id: 6,
      title: "VERSIONAMENTO INTELIGENTE",
      content: "Git + IA funcionando juntos. Você vai ver como manter histórico limpo e trabalhar com segurança usando Claude Code."
    },
    {
      id: 7,
      title: "PERGUNTAS E NETWORKING",
      content: "Tire dúvidas ao vivo e conecte com outros participantes. É sua chance de trocar ideias e descobrir próximos passos."
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-16">
      {/* Terminal Window Container */}
      <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-claude-border/30 shadow-2xl">

        {/* Terminal Header */}
        <div className="bg-gray-900 border-b border-claude-border/30 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <Circle className="w-3 h-3 text-red-500 fill-current" />
              <Square className="w-3 h-3 text-yellow-500 fill-current" />
              <Circle className="w-3 h-3 text-green-500 fill-current" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-gray-500" />
            <span className="text-gray-400 font-mono text-sm">como_funciona.md</span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-8 bg-gradient-to-b from-[#1e1e1e] to-[#1a1a1a]">

          {/* Main Title */}
          <div className="mb-8 text-center">
            <h1 className="text-orange-500 font-vt323 text-3xl font-black mb-2">
              COMO FUNCIONA O WORKSHOP
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto"></div>
          </div>

          {/* Topics Grid */}
          <div className="space-y-4">
            {topics.map((topic) => (
              <ComoFuncionaBlock
                key={topic.id}
                title={topic.title}
                content={topic.content}
              />
            ))}
          </div>

          {/* Terminal Footer */}
          <div className="mt-8 pt-6 border-t border-claude-border/30 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 font-mono text-xs">{`>`}</span>
              <span className="text-gray-400 font-mono text-xs">Pronto para transformar sua produtividade?</span>
            </div>
            <div className="flex space-x-1">
              <span className="text-gray-600 animate-pulse">█</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- UTILS ---
const fireConfetti = async () => {
  try {
    await confetti({
      particleCount: 50,
      spread: 45,
      origin: { y: 0.6 },
      colors: ["#26ccff", "#a25afd", "#ff5e7e"],
    });
  } catch (error) {
    console.error("Confetti error:", error);
  }
};


// --- MAIN COMPONENT ---

interface FramerWorkshopProps {
  // Optional: Override the API endpoint for checkout
  checkoutApiUrl?: string;
  // Optional: If true, mocks the successful checkout for preview purposes
  mockSuccess?: boolean;
}

export default function FramerWorkshop({ checkoutApiUrl, mockSuccess = false }: FramerWorkshopProps) {
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
        newFieldErrors.cpf = "CPF inválido";
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
      setErrorMessage(
        "CPF inválido. Verifique se você digitou todos os 11 dígitos corretamente.",
      );
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

    if (mockSuccess) {
        // MOCK PAYMENT FOR FRAMER PREVIEW
        setTimeout(() => {
            setPixData({
                qrCode: "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540410.005802BR5913Cicrano de Tal6008Brasilia62070503***6304E2CA",
                qrCodeUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
                paymentUrl: "#",
                billingId: "MOCK-BILLING-ID",
            });
            setPaymentStatus("success");
            fireConfetti();
            setLoading(false);
        }, 1500);
        return;
    }

    try {
      // Use provided prop or fallback to relative path (which only works in Next.js context)
      const endpoint = checkoutApiUrl || "/api/infinite-pay/checkout";

      const response = await fetch(endpoint, {
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
              price: 2000, // R$ 20,00 em centavos
            },
          ],
          order_nsu: `ATHENA-${Date.now()}`,
          redirect_url: typeof window !== 'undefined' ? `${window.location.origin}/success` : '',
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
          fireConfetti();
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
    <>
    <StyleInjector />
    <div className="min-h-screen p-4 md:p-8 bg-[#DD8468] font-mono">
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
                  src="https://github.com/caiomioto.png" // Using GitHub avatar as fallback if profile-photo.png is local
                  alt="Caio Mioto"
                  className="w-full h-full border-2 border-claude-accent shadow-[4px_4px_0px_0px_#FF5E3A] object-contain bg-[#1a1a1a]"
                  onError={(e) => {
                     // Fallback if local image fails
                     e.currentTarget.src = "https://github.com/caiomioto.png"
                  }}
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

          <div className="mt-8 mb-8">
            <ComoFunciona />
          </div>

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
    </>
  );
}
