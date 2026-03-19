"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Brain,
  Users,
  Zap,
  BarChart3,
  Lightbulb,
  GraduationCap,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const features = [
    {
      icon: BookOpen,
      title: "Flashcards",
      description: "Crie e organize flashcards para memorizar conteúdo de forma eficiente",
      bgColor: "#e0f2fe",
      iconColor: "#0ea5e9",
    },
    {
      icon: Brain,
      title: "Quizzes",
      description: "Teste seus conhecimentos com quizzes interativos e acompanhe seu progresso",
      bgColor: "#c9eaff",
      iconColor: "#2a4eca",
    },
    {
      icon: Users,
      title: "Grupos de Estudo",
      description: "Estude em grupos, compartilhe recursos e colabore com seus colegas",
      bgColor: "#cefafe",
      iconColor: "#06b6d4",
    },
    {
      icon: Zap,
      title: "Assistente IA",
      description: "IA inteligente para ajudar você a estudar e resolver dúvidas",
      bgColor: "#fff3e8",
      iconColor: "#ff6900",
    },
    {
      icon: BarChart3,
      title: "Estatísticas",
      description: "Acompanhe seu desempenho e veja seu progresso ao longo do tempo",
      bgColor: "#dcfce7",
      iconColor: "#00c950",
    },
    {
      icon: Lightbulb,
      title: "Whiteboard Digital",
      description: "Desenhe, escreva e visualize seus conceitos de forma criativa",
      bgColor: "#ffeded",
      iconColor: "#fb2c36",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              style={{ backgroundColor: "#3461fd" }}
              className="w-10 h-10 rounded-lg flex items-center justify-center"
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">EstudaEasy</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition">
              Recursos
            </a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 transition">
              Faq
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button
                variant="outline"
                style={{ borderColor: "#2a4eca", color: "#2a4eca" }}
                className="border-2 hover:text-white"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2a4eca";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#2a4eca";
                }}
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button
                style={{ backgroundColor: "#3461fd" }}
                className="hover:opacity-90 text-white border-0"
              >
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full"
              style={{ backgroundColor: "#e0f2fe" }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "#0ea5e9" }} />
              <span className="text-sm font-semibold" style={{ color: "#0ea5e9" }}>
                A melhor forma de estudar
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
              Simplifique sua rotina de{" "}
              <span
                style={{
                  color: "#3461fd",
                }}
              >
                estudos
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              EstudaEasy é a plataforma completa para estudantes que querem estudar de forma mais
              eficiente, colaborativa e inteligente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button
                  style={{ backgroundColor: "#3461fd" }}
                  className="w-full sm:w-auto px-8 py-6 hover:opacity-90 text-white border-0 text-lg rounded-lg"
                >
                  Comece Gratuitamente
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  style={{ borderColor: "#3461fd", color: "#3461fd" }}
                  className="w-full sm:w-auto px-8 py-6 border-2 text-lg rounded-lg hover:text-white"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3461fd";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#3461fd";
                  }}
                >
                  Fazer Login
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:flex items-center justify-center h-96">
            {/* Study Illustration */}
            <svg
              viewBox="0 0 400 400"
              className="relative w-full h-full max-w-sm"
              style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))" }}
            >
              {/* Background glow */}
              <circle
                cx="200"
                cy="200"
                r="180"
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="2"
                opacity="0.3"
              />

              {/* Book 1 - Left */}
              <g transform="translate(80, 160)">
                <rect
                  width="60"
                  height="100"
                  rx="4"
                  fill="#c9eaff"
                  stroke="#3461fd"
                  strokeWidth="2"
                />
                <path
                  d="M 65 0 Q 70 20 65 100"
                  fill="none"
                  stroke="#3461fd"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <line
                  x1="20"
                  y1="30"
                  x2="40"
                  y2="30"
                  stroke="#3461fd"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <line
                  x1="20"
                  y1="50"
                  x2="40"
                  y2="50"
                  stroke="#3461fd"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <line
                  x1="20"
                  y1="70"
                  x2="40"
                  y2="70"
                  stroke="#3461fd"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
              </g>

              {/* Book 2 - Center (higher) */}
              <g transform="translate(170, 120)">
                <rect
                  width="60"
                  height="100"
                  rx="4"
                  fill="#e0f2fe"
                  stroke="#0ea5e9"
                  strokeWidth="2"
                />
                <path
                  d="M 65 0 Q 70 20 65 100"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <line
                  x1="20"
                  y1="30"
                  x2="40"
                  y2="30"
                  stroke="#0ea5e9"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <line
                  x1="20"
                  y1="50"
                  x2="40"
                  y2="50"
                  stroke="#0ea5e9"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <line
                  x1="20"
                  y1="70"
                  x2="40"
                  y2="70"
                  stroke="#0ea5e9"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
              </g>

              {/* Book 3 - Right */}
              <g transform="translate(260, 160)">
                <rect
                  width="60"
                  height="100"
                  rx="4"
                  fill="#dcfce7"
                  stroke="#00c950"
                  strokeWidth="2"
                />
                <path
                  d="M 65 0 Q 70 20 65 100"
                  fill="none"
                  stroke="#00c950"
                  strokeWidth="1.5"
                  opacity="0.5"
                />
                <line
                  x1="20"
                  y1="30"
                  x2="40"
                  y2="30"
                  stroke="#00c950"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <line
                  x1="20"
                  y1="50"
                  x2="40"
                  y2="50"
                  stroke="#00c950"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <line
                  x1="20"
                  y1="70"
                  x2="40"
                  y2="70"
                  stroke="#00c950"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
              </g>

              {/* Lightbulb (idea) - Top */}
              <g transform="translate(200, 40)">
                {/* Bulb */}
                <circle cx="0" cy="0" r="20" fill="#ff6900" opacity="0.9" />
                <ellipse cx="0" cy="-5" rx="18" ry="15" fill="#ff6900" />
                {/* Inner glow */}
                <circle cx="-5" cy="-5" r="8" fill="#fff8dc" opacity="0.6" />
                {/* Base */}
                <rect x="-8" y="18" width="16" height="8" rx="2" fill="#2a4eca" />
                <line x1="-10" y1="26" x2="-4" y2="26" stroke="#2a4eca" strokeWidth="2" />
                <line x1="4" y1="26" x2="10" y2="26" stroke="#2a4eca" strokeWidth="2" />
                {/* Glow effect */}
                <circle
                  cx="0"
                  cy="0"
                  r="28"
                  fill="none"
                  stroke="#ff6900"
                  strokeWidth="1.5"
                  opacity="0.2"
                />
              </g>

              {/* Progress indicator - Bottom */}
              <g transform="translate(100, 300)">
                {/* Background circles */}
                <circle cx="0" cy="0" r="8" fill="rgba(42, 78, 202, 0.2)" />
                <circle cx="50" cy="0" r="8" fill="rgba(42, 78, 202, 0.2)" />
                <circle cx="100" cy="0" r="8" fill="rgba(42, 78, 202, 0.2)" />
                <circle cx="150" cy="0" r="8" fill="rgba(42, 78, 202, 0.2)" />
                {/* Completed circles */}
                <circle cx="0" cy="0" r="7" fill="#00c950" />
                <circle cx="50" cy="0" r="7" fill="#00c950" />
                <circle cx="100" cy="0" r="7" fill="#00c950" />
                {/* In progress */}
                <circle cx="150" cy="0" r="7" fill="#ff6900" opacity="0.7" />
                {/* Connecting lines */}
                <line x1="8" y1="0" x2="42" y2="0" stroke="#00c950" strokeWidth="2" />
                <line x1="58" y1="0" x2="92" y2="0" stroke="#00c950" strokeWidth="2" />
                <line
                  x1="108"
                  y1="0"
                  x2="142"
                  y2="0"
                  stroke="#ff6900"
                  strokeWidth="2"
                  opacity="0.5"
                />
              </g>

              {/* Floating elements */}
              <text x="150" y="80" fontSize="24" fill="#0ea5e9" opacity="0.3">
                ✓
              </text>
              <text x="280" y="220" fontSize="20" fill="#2a4eca" opacity="0.25">
                📚
              </text>
              <circle cx="140" cy="250" r="3" fill="#ff6900" opacity="0.4" />
              <circle cx="260" cy="280" r="2" fill="#0ea5e9" opacity="0.3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">Recursos Poderosos</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para estudar de forma eficiente, colaborativa e inteligente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div
                    style={{ backgroundColor: feature.bgColor }}
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-6"
                  >
                    <Icon style={{ color: feature.iconColor }} className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">Tire suas dúvidas sobre a EstudaEasy</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "Como funciona a EstudaEasy?",
                answer:
                  "EstudaEasy é uma plataforma completa de estudos que oferece flashcards, quizzes, grupos de estudo, IA inteligente e acompanhamento de progresso. Você pode criar seus próprios materiais ou usar os disponibilizados por outros usuários.",
              },
              {
                question: "Como crio grupos de estudo?",
                answer:
                  "Ao criar uma conta, você pode acessar a seção de Grupos de Estudo, criar um novo grupo e convidar seus colegas. Dentro do grupo, vocês podem compartilhar recursos e colaborar juntos.",
              },
              {
                question: "Como a IA me ajuda a estudar?",
                answer:
                  "Nosso assistente IA pode responder suas dúvidas, explicar conceitos, gerar quizzes baseados em seu material e ajudar a resolver problemas. Está disponível 24/7 para ajudar no seu aprendizado.",
              },
              {
                question: "Posso usar a EstudaEasy no celular?",
                answer:
                  "Sim! A plataforma é totalmente responsiva e funciona perfeitamente em smartphones, tablets e computadores.",
              },
              {
                question: "Meus dados estão seguros?",
                answer:
                  "Sim, utilizamos as melhores práticas de segurança para proteger seus dados. Suas informações são criptografadas e armazenadas com segurança.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                >
                  <h3 className="font-semibold text-gray-900">{item.question}</h3>
                  <ChevronDown
                    className="w-5 h-5 text-gray-500 transition-transform"
                    style={{
                      transform: openFaqIndex === index ? "rotate(180deg)" : "rotate(0)",
                    }}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ backgroundColor: "#3461fd" }} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">Pronto para começar?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que já estão usando EstudaEasy para estudar melhor
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/register">
              <Button className="px-8 py-6 bg-white hover:bg-gray-100 text-blue-600 font-bold text-lg rounded-lg">
                Criar Conta Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                style={{ borderColor: "white", color: "white" }}
                className="px-8 py-6 border-2 hover:bg-white/10 text-lg rounded-lg"
              >
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div
                  style={{ backgroundColor: "#3461fd" }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                >
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">EstudaEasy</span>
              </div>
              <p className="text-sm">Simplifique sua rotina de estudos</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Recursos
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition">
                    Faq
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Termos
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="mailto:contato@estudaeasy.com" className="hover:text-white transition">
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm">
              © {new Date().getFullYear()} EstudaEasy. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
