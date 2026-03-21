# EstudaEasy - Plataforma Completa de Ferramentas de Estudos

<div align="center">

![EstudaEasy](https://img.shields.io/badge/EstudaEasy-Study%20Platform-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)

**Simplifique sua rotina de estudos com uma plataforma completa, colaborativa e inteligente.**

</div>

---

## 📋 Sobre o Projeto

Este é o front-end da plataforma SaaS **EstudaEasy** desenvolvida para disciplina de Projeto de Desenvolvimento de Software, com foco em estudantes que desejam otimizar sua rotina de estudos. Concentra diversas técnicas e ferramentas em um único lugar, oferecendo uma experiência integrada, colaborativa e potencializada por inteligência artificial.

> "Estude mais, inteligentemente, com a ajuda da IA e a colaboração da comunidade"

### ✨ Destaques Principais

- 🎓 **7+ Ferramentas de Estudo** integradas em uma única plataforma
- 🤖 **Assistente IA (tIA)** que ajuda a criar questões e converter recursos
- 👥 **Grupos de Estudo** para colaboração e compartilhamento
- 📊 **Estatísticas Detalhadas** de progresso e desempenho
- ✏️ **WhiteBoard Digital** para anotações e visualizações criativas
- 🔗 **Compartilhamento de Recursos** com links direcionados
- 🔐 **Autenticação com Google OAuth**
- 📱 **Interface Responsiva** e intuitiva

---

## 🎯 Funcionalidades Principais

### 📇 **Flashcards**

- Crie e organize decks de flashcards para memorização eficiente
- Interface flip-card para estudo interativo
- Acompanhamento de progresso por deck
- Compartilhamento de decks com a comunidade

### 🧠 **Quizzes**

- Crie quizzes com múltiplas escolhas
- Teste seus conhecimentos de forma interativa
- Resultados detalhados com feedback da IA
- Conversão de flashcards em quizzes

### ✅ **Tasks (Tarefas)**

- Gerencie sua rotina de estudos com tarefas
- Organização por data e prioridade
- Integração com cronograma de estudos
- Conversão de outras ferramentas em tarefas

### ⏱️ **Pomodoro**

- Técnica Pomodoro para gerenciamento de tempo
- Sessões de foco com pausas estratégicas
- Acompanhamento diário de tarefas
- Integração com dailies de estudo

### 📔 **Diário de Estudos**

- Registre suas reflexões e aprendizados
- Organize anotações por data
- Compartilhe seus diários com o grupo
- Busca e filtros avançados

### ✏️ **WhiteBoard Digital**

- Desenhe, escreva e visualize conceitos
- Interface intuitiva com tldraw
- Compartilhe e colabore em tempo real
- Export de trabalhos

### 👥 **Grupos de Estudo**

- Crie grupos com seus colegas
- Compartilhe recursos apenas com o grupo
- Colaboração e discussão
- Gerenciamento de membros

### 🤖 **Assistente IA (tIA)**

- Converta flashcards ↔ quizzes ↔ tarefas
- Geração automática de questões
- Explicações e ajuda com dúvidas
- Disponível 24/7

---

## 📁 Estrutura do Projeto

```
src/
├── app/                          # App Router do Next.js
│   ├── (auth)/                   # Rotas de autenticação
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── google-auth/
│   │   └── social-login/
│   ├── (core)/                   # Rotas protegidas
│   │   ├── home/                 # Dashboard principal
│   │   ├── profile/              # Perfil do usuário
│   │   ├── groups/               # Gerenciamento de grupos
│   │   ├── tia/                  # Interface da IA
│   │   └── tools/                # Ferramentas de estudo
│   │       ├── quiz/
│   │       ├── flashcards/
│   │       ├── tasks/
│   │       ├── pomodoro/
│   │       ├── diary/
│   │       ├── whiteboard/
│   │       └── shared-resources/
│   ├── share/                    # Compartilhamento de recursos
│   ├── api/                      # API routes
│   ├── globals.css               # Estilos globais
│   └── layout.tsx                # Layout root
│
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base (shadcn)
│   ├── feature/                  # Componentes de funcionalidades
│   ├── AIAssistant/              # Assistente IA
│   ├── ResourceConverter/        # Conversor de recursos
│   ├── DeckForm/                 # Formulário de flashcards
│   ├── QuizForm/                 # Formulário de quizzes
│   ├── FlashcardForm/            # Criação de flashcards
│   ├── GroupForm/                # Criação de grupos
│   ├── Sidebar/                  # Menu lateral
│   ├── Container/                # Layout container
│   └── ...outros componentes
│
├── context/                      # Context API
│   ├── auth/                     # Contexto de autenticação
│   ├── pomodoro/                 # Contexto do Pomodoro
│   └── resourceConverter/        # Contexto do conversor
│
├── hooks/                        # Custom React Hooks
│   ├── useActivities.ts          # Atividades
│   ├── useDiaries.ts             # Diários
│   ├── useFavorites.ts           # Favoritos
│   ├── useTasks.ts               # Tarefas
│   ├── useAudioRecorder.ts       # Gravação de áudio
│   └── ...outros hooks
│
├── services/                     # Camada de negócio
│   ├── api.ts                    # Cliente HTTP
│   ├── auth/                     # Autenticação
│   ├── deck/                     # Flashcards
│   ├── quiz/                     # Quizzes
│   ├── task/                     # Tarefas
│   ├── diary/                    # Diários
│   ├── group/                    # Grupos
│   ├── resource/                 # Recursos
│   ├── user/                     # Usuário
│   └── whiteboard/               # Whiteboard
│
├── types/                        # Tipos TypeScript
│   ├── api.ts                    # Tipos gerados da API
│   ├── auth.ts                   # Autenticação
│   ├── deck.ts                   # Flashcards
│   ├── quiz.ts                   # Quizzes
│   ├── task.ts                   # Tarefas
│   └── ...outros tipos
│
├── lib/                          # Utilitários
│   ├── utils.ts                  # Funções comuns
│   ├── errorMessage.ts           # Mensagens de erro
│   ├── activityStorage.ts        # Armazenamento local
│   └── favoriteStorage.ts        # Favoritos locais
│
├── styles/                       # Estilos customizados
│   ├── variants.ts               # Variantes Tailwind
│   └── variantClasses.ts         # Classes de variantes
│
├── assets/                       # Imagens e animações
│   ├── Loading.json              # Animações Lottie
│   └── ...
│
├── public/                       # Arquivos estáticos
│
├── next.config.ts                # Configuração Next.js
├── tsconfig.json                 # Configuração TypeScript
├── tailwind.config.ts            # Configuração Tailwind
└── package.json                  # Dependências do projeto
```

---

## 🚀 Como Começar

### Pré-requisitos

- **Node.js** 18+ ou superior
- **npm**, **yarn** ou **pnpm**

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/estuda-easy-front.git
cd estuda-easy-front
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

````env
# API Backend
NEXT_PUBLIC_API_URL=sua_url_da_api_aqui

4. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
````

5. **Acesse a aplicação**

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

<div align="center">

**[⬆ volta ao topo](#estudaeasy---plataforma-completa-de-ferramentas-de-estudos)**

</div>
