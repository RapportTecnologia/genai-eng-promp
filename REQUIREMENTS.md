# GenAI Eng Prompt - Requisitos do Sistema

## 1. Visão Geral

O **GenAI Eng Prompt** é uma aplicação web que otimiza prompts utilizando as melhores práticas de engenharia de prompt. A aplicação oferece sugestões em tempo real enquanto o usuário escreve e gera uma versão otimizada do prompt ao finalizar.

---

## 2. Arquitetura

### 2.1 Frontend (React.js)
- **Framework**: React.js com Vite
- **Estilização**: TailwindCSS + shadcn/ui
- **HTTP Client**: Axios
- Interface web responsiva para interação com o usuário
- Sugestões em tempo real durante a digitação
- Exibição de propagandas
- Gerenciamento de estado com Context API ou Zustand

#### Design Visual
- **Paleta de Cores**:
  - **Fundo principal**: Laranja (#FF8C42, #FFA500 ou tons similares)
  - **Bordas dos frames**: Marrom claro (#8B4513, #A0522D ou tons similares)
  - **Frames**: Tom sobre tom laranja (variações mais claras/escuras do laranja principal)
  - **Texto**: Branco (#FFFFFF) sempre que possível para contraste
  - **Texto alternativo**: Tons escuros apenas quando necessário para legibilidade
- **Estilo dos Frames**:
  - Bordas leves em marrom
  - Cantos arredondados suaves
  - Sombras sutis para profundidade
  - Fundo em tons de laranja variados (tom sobre tom)

### 2.2 Backend (Node.js + Express)
- **Framework**: Express.js
- **Runtime**: Node.js
- **API**: RESTful
- **Servidor de arquivos estáticos**: Serve o frontend React buildado na raiz (`/`)
- Integração com múltiplos provedores de IA via SDKs oficiais
- Sistema de configuração flexível (JSON + .env)
- Middleware para CORS, validação e tratamento de erros

---

## 3. Funcionalidades Principais

### 3.1 Editor de Prompt (Input)
- **Campo de entrada**: Área onde o usuário digita o prompt original
- **Sugestões em tempo real**: Conforme o usuário escreve, o sistema sugere:
  - Novas palavras
  - Complementos de frases
  - Melhorias no texto
- **Botão "Otimizar Prompt"**: Envia o prompt para processamento

### 3.2 Visualizador de Prompt Otimizado (Output)
- **Exibição do prompt otimizado**: Mostra o resultado gerado seguindo as melhores práticas
- **Contador de tokens**: Calcula e exibe quantos tokens foram gerados
- **Botão "Copiar"**: Copia o texto do prompt otimizado para a área de transferência

### 3.3 Sistema de Propagandas
- **Localização**: Área na base da página
- **Exibição**: 3 propagandas exibidas simultaneamente de forma aleatória
- **Conteúdo**: Cada propaganda contém:
  - Título
  - Imagem (com link clicável para o site do anunciante)
  - Link de destino
- **Fonte de dados**: Arquivo `/etc/genai-eng-prompt/ads.conf` (formato JSON)

---

## 4. Integrações com Provedores de IA

O sistema deve suportar integração com os seguintes provedores:

| Provedor | Autenticação | Engine | Embeddings | URL Customizável |
|----------|--------------|--------|------------|------------------|
| **OpenAI** | API Key | OpenAI | ✅ Sim | Não |
| **OpenRouter** | API Key | OpenAI | ❌ Não | Não |
| **Ollama** | Local | Ollama | ✅ Sim | ✅ Sim |
| **Anthropic** | API Key | Anthropic | ❌ Não | Não |
| **Perplexity** | API Key | Perplexity | ❌ Não | Não |
| **OpenWebUI** | API Key | OpenAI | ✅ Sim | ✅ Sim |
| **GenerAtiva** | API Key | OpenAI | ✅ Sim | ✅ Sim |

---

## 5. Configuração do Sistema

### 5.1 Arquivo de Configuração Principal
- **Localização**: `/etc/genai-eng-prompt/config.json`
- **Formato**: JSON
- **Conteúdo obrigatório**:
  - **Porta do servidor**: Porta onde o backend Express irá executar (padrão: 3010)
  - **Engine a ser utilizada**: Provedor de IA ativo
  - **Credenciais de acesso**: API keys dos provedores
  - **URL da API RESTful**: Quando aplicável (Ollama, OpenWebUI, etc.)
  - **Flag indicando se gera embeddings**: Para provedores que suportam

### 5.2 Configuração Local (Desenvolvimento)
- **Arquivo**: `.env` (na raiz do projeto)
- **Prioridade**: Se existir, sobrescreve as configurações de `/etc/genai-eng-prompt/config.json`
- **Uso**: Desenvolvimento e testes locais
- **Variáveis principais**:
  - `PORT`: Porta do servidor (ex: 3010)
  - `NODE_ENV`: Ambiente (development, production)
  - `PROVIDER`: Provedor de IA ativo
  - `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc.

### 5.3 Arquivo de Propagandas
- **Localização**: `/etc/genai-eng-prompt/ads.conf`
- **Formato**: JSON
- **Estrutura**:
```json
[
  {
    "titulo": "Título da propaganda",
    "link": "https://exemplo.com",
    "imagePath": "/caminho/para/imagem.png"
  }
]
```
- **Observação sobre imagePath**: Pode ser uma URL completa (ex: `https://exemplo.com/imagem.png`) ou um caminho local de diretório (ex: `/var/www/images/banner.png`)

---

## 6. Requisitos Técnicos

### 6.1 Backend (Node.js + Express)

#### Dependências Principais
- **express**: Framework web
- **cors**: Middleware para CORS
- **dotenv**: Gerenciamento de variáveis de ambiente
- **express-validator** ou **joi**: Validação de entrada
- **openai**: SDK oficial da OpenAI
- **@anthropic-ai/sdk**: SDK oficial da Anthropic
- **axios**: Cliente HTTP para APIs genéricas
- **tiktoken** ou **gpt-tokenizer**: Cálculo de tokens

#### Funcionalidades
- API RESTful para processamento de prompts
- Suporte a múltiplas engines de IA com abstração comum
- Sistema de configuração baseado em arquivos JSON e .env
- Geração de embeddings (quando suportado pelo provedor)
- Cálculo preciso de tokens
- Tratamento de erros robusto
- Logging e monitoramento

#### Endpoints da API
- **POST** `/api/optimize` - Otimizar prompt completo
- **POST** `/api/suggest` - Sugestões em tempo real
- **GET** `/api/ads` - Obter propagandas aleatórias
- **GET** `/api/health` - Health check
- **GET** `/api/providers` - Listar provedores disponíveis

### 6.2 Frontend (React.js + Vite)

#### Dependências Principais
- **react**: Biblioteca principal
- **react-dom**: Renderização DOM
- **vite**: Build tool e dev server
- **axios**: Cliente HTTP
- **tailwindcss**: Framework CSS
- **shadcn/ui**: Componentes UI
- **lucide-react**: Ícones
- **react-textarea-autocomplete**: Autocompletar

#### Componentes Principais
- **PromptEditor**: Editor com sugestões em tempo real
  - Frame com fundo laranja claro
  - Borda marrom suave
  - Texto branco
- **OptimizedPromptViewer**: Visualizador do resultado
  - Frame com fundo laranja médio (tom sobre tom)
  - Borda marrom suave
  - Texto branco
- **AdsBanner**: Sistema de propagandas
  - Frame com fundo laranja escuro (tom sobre tom)
  - Borda marrom suave
- **TokenCounter**: Contador de tokens
  - Texto branco com destaque

#### Funcionalidades
- Interface responsiva e moderna
- Sugestões em tempo real (autocompletar com debouncing)
- Copiar para área de transferência
- Exibição aleatória de 3 propagandas
- Contador de tokens em tempo real
- Estados de loading e tratamento de erros
- Animações e transições suaves

#### Especificações de Design
- **Tipografia**: Fontes sans-serif modernas (Inter, Roboto ou similar)
- **Espaçamento**: Padding e margin generosos para respiração visual
- **Botões**: 
  - Fundo em tons de laranja mais escuro
  - Texto branco
  - Bordas marrom ao hover
  - Efeitos de hover suaves
- **Inputs**:
  - Fundo laranja claro semi-transparente
  - Bordas marrom suave
  - Texto branco com placeholder em branco opaco
  - Focus com borda marrom mais intensa

### 6.3 Segurança
- API keys armazenadas em arquivos de configuração seguros
- Suporte a variáveis de ambiente para desenvolvimento local
- Validação e sanitização de inputs
- Rate limiting para prevenir abuso
- CORS configurado adequadamente
- HTTPS em produção

### 6.4 DevOps e Deploy

#### Estrutura de Deploy
- **Desenvolvimento**: Frontend (Vite dev server - porta 5173) + Backend (porta configurável, padrão 3010)
- **Produção**: Backend Express serve frontend e API (porta configurável)
  - Porta definida em `config.json` ou variável de ambiente `PORT`
  - Frontend buildado (`npm run build`) copiado para `backend/public`
  - Express serve arquivos estáticos na raiz: `https://localhost:{PORT}/`
  - API acessível em: `https://localhost:{PORT}/api/*`

#### Build e Deploy
- Frontend: `npm run build` gera arquivos em `frontend/dist`
- Arquivos buildados copiados para `backend/public` (ou `backend/dist/public`)
- Backend Express configurado com `express.static()` para servir `public`
- Rota catch-all (`/*`) retorna `index.html` para suporte a SPA

#### Containerização
- **Docker**: Containerização da aplicação
- **Docker Compose**: Orquestração de containers
- **CI/CD**: Pipeline automatizado (GitHub Actions, GitLab CI, etc.)

### 6.5 Testes

#### Backend
- **Jest**: Framework de testes
- **Supertest**: Testes de API
- Testes unitários para engines e serviços
- Testes de integração para endpoints

#### Frontend
- **Vitest**: Framework de testes
- **React Testing Library**: Testes de componentes
- **MSW (Mock Service Worker)**: Mock de APIs
- Testes E2E com Playwright ou Cypress (opcional)

---

## 7. Fluxo de Uso

1. Usuário acessa a aplicação web
2. Usuário digita o prompt no campo de entrada
3. Sistema oferece sugestões em tempo real
4. Usuário clica em "Otimizar Prompt"
5. Backend processa o prompt usando a engine configurada
6. Sistema exibe o prompt otimizado com contador de tokens
7. Usuário pode copiar o prompt otimizado
8. Propagandas são exibidas na base da página
