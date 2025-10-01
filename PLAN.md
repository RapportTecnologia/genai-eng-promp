# GenAI Eng Prompt - Plano de Execução

## Visão Geral do Projeto

Este documento descreve o plano de execução para o desenvolvimento do **GenAI Eng Prompt**, uma aplicação web que otimiza prompts utilizando múltiplos provedores de IA.

---

## Fase 1: Planejamento e Configuração Inicial

### 1.1 Definição da Stack Tecnológica
**Duração estimada**: 1-2 dias

#### Backend
- [ ] **Framework**: Node.js + Express
- [ ] **Linguagem**: JavaScript/TypeScript
- [ ] **Gerenciamento de configuração**: dotenv, fs (para ler JSON)
- [ ] **Integração com APIs de IA**: 
  - openai (SDK oficial)
  - @anthropic-ai/sdk
  - axios (para APIs genéricas)
- [ ] **Cálculo de tokens**: tiktoken ou gpt-tokenizer
- [ ] **CORS**: cors middleware
- [ ] **Validação**: express-validator ou joi

#### Frontend
- [ ] **Framework**: React.js
- [ ] **Build Tool**: Vite
- [ ] **UI Components**: TailwindCSS + shadcn/ui
- [ ] **Gerenciamento de estado**: Context API ou Zustand
- [ ] **HTTP Client**: axios
- [ ] **Autocompletar**: React-textarea-autocomplete
- [ ] **Ícones**: Lucide React

#### DevOps
- [ ] **Containerização**: Docker + Docker Compose
- [ ] **Variáveis de ambiente**: .env para desenvolvimento

### 1.2 Estrutura de Diretórios
**Duração estimada**: 1 dia

```
genai-eng-prompt/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── optimize.routes.js
│   │   │   ├── suggest.routes.js
│   │   │   └── ads.routes.js
│   │   ├── services/
│   │   │   ├── prompt.service.js
│   │   │   └── ads.service.js
│   │   ├── engines/
│   │   │   ├── base.engine.js
│   │   │   ├── openai.engine.js
│   │   │   ├── anthropic.engine.js
│   │   │   ├── ollama.engine.js
│   │   │   └── index.js
│   │   ├── config/
│   │   │   └── config.loader.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validator.js
│   │   └── utils/
│   │       └── tokenCounter.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PromptEditor.jsx
│   │   │   ├── OptimizedPromptViewer.jsx
│   │   │   ├── AdsBanner.jsx
│   │   │   └── ui/
│   │   ├── services/
│   │   │   └── api.service.js
│   │   ├── hooks/
│   │   │   └── usePromptOptimizer.js
│   │   ├── utils/
│   │   │   └── clipboard.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── config/
│   ├── config.example.json
│   └── ads.example.conf
├── docker-compose.yml
├── .env.example
├── REQUIREMENTS.md
├── PLAN.md
└── README.md
```

---

## Fase 2: Desenvolvimento do Backend

### 2.1 Sistema de Configuração
**Duração estimada**: 2-3 dias

- [ ] Criar módulo de leitura de configuração
- [ ] Implementar prioridade: `.env` > `/etc/rapport/genai-eng-prompt/config.json`
- [ ] Validar configurações obrigatórias
- [ ] Criar arquivo de exemplo `config.example.json`
- [ ] Documentar estrutura de configuração

**Estrutura do config.json**:
```json
{
  "provider": "openai",
  "providers": {
    "openai": {
      "apiKey": "sk-...",
      "engine": "openai",
      "model": "gpt-4",
      "supportsEmbeddings": true
    },
    "anthropic": {
      "apiKey": "sk-ant-...",
      "engine": "anthropic",
      "model": "claude-3-opus-20240229",
      "supportsEmbeddings": false
    },
    "ollama": {
      "url": "http://localhost:11434",
      "engine": "ollama",
      "model": "llama2",
      "supportsEmbeddings": true
    },
    "openrouter": {
      "apiKey": "sk-or-...",
      "engine": "openai",
      "baseURL": "https://openrouter.ai/api/v1",
      "model": "openai/gpt-4",
      "supportsEmbeddings": false
    }
  }
}
```

### 2.2 Abstração de Engines
**Duração estimada**: 3-4 dias

- [ ] Criar classe base `BaseEngine` com interface comum (JavaScript)
- [ ] Implementar `OpenAIEngine` usando SDK oficial
- [ ] Implementar `AnthropicEngine` usando @anthropic-ai/sdk
- [ ] Implementar `OllamaEngine` usando axios
- [ ] Implementar `PerplexityEngine` usando axios
- [ ] Implementar engines para OpenRouter (compatível OpenAI)
- [ ] Implementar engines para OpenWebUI e GenerAtiva
- [ ] Adicionar suporte a embeddings (quando aplicável)
- [ ] Implementar tratamento de erros e retry logic com axios-retry

### 2.3 Serviço de Otimização de Prompts
**Duração estimada**: 3-4 dias

- [ ] Criar serviço de otimização de prompts
- [ ] Implementar prompt system para otimização baseado em melhores práticas
- [ ] Adicionar cálculo de tokens (input e output)
- [ ] Implementar cache de respostas (opcional)
- [ ] Adicionar logging e monitoramento

### 2.4 Serviço de Sugestões em Tempo Real
**Duração estimada**: 2-3 dias

- [ ] Criar endpoint para sugestões de autocompletar
- [ ] Implementar lógica de sugestões contextuais
- [ ] Otimizar para baixa latência
- [ ] Implementar debouncing no backend

### 2.5 API RESTful (Express)
**Duração estimada**: 2-3 dias

- [ ] Configurar Express server com middleware básico
- [ ] Implementar CORS com configuração adequada
- [ ] **POST** `/api/optimize` - Otimizar prompt completo
  - Body: `{ "prompt": "texto do prompt" }`
  - Response: `{ "optimizedPrompt": "...", "tokens": 150 }`
- [ ] **POST** `/api/suggest` - Sugestões em tempo real
  - Body: `{ "text": "texto parcial", "cursorPosition": 10 }`
  - Response: `{ "suggestions": ["...", "..."] }`
- [ ] **GET** `/api/ads` - Obter 3 propagandas aleatórias
  - Response: `[{ "titulo": "...", "link": "...", "imagePath": "..." }]`
- [ ] **GET** `/api/health` - Health check
- [ ] **GET** `/api/providers` - Listar provedores disponíveis
- [ ] Implementar validação de entrada com express-validator
- [ ] Adicionar error handling middleware
- [ ] Adicionar documentação com Swagger/OpenAPI (opcional)

### 2.6 Sistema de Propagandas
**Duração estimada**: 1-2 dias

- [ ] Criar módulo de leitura de `/etc/rapport/genai-eng-prompt/ads.conf`
- [ ] Implementar seleção aleatória de 3 propagandas
- [ ] Validar estrutura do arquivo JSON
- [ ] Criar arquivo de exemplo `ads.example.conf`

---

## Fase 3: Desenvolvimento do Frontend

### 3.1 Estrutura Base e Layout (React + Vite)
**Duração estimada**: 2-3 dias

- [ ] Inicializar projeto React com Vite
- [ ] Configurar TailwindCSS com paleta de cores customizada
  - Fundo principal: Laranja (#FF8C42, #FFA500)
  - Bordas: Marrom claro (#8B4513, #A0522D)
  - Tons de laranja para frames (tom sobre tom)
- [ ] Instalar e configurar shadcn/ui
- [ ] Configurar fontes (Inter, Roboto ou similar)
- [ ] Implementar layout responsivo principal com fundo laranja
- [ ] Criar componente de header com estilo laranja/marrom
- [ ] Criar área de propagandas no rodapé com frame laranja escuro
- [ ] Configurar roteamento (se necessário)

### 3.2 Editor de Prompt (Input)
**Duração estimada**: 3-4 dias

- [ ] Criar componente `PromptEditor`
- [ ] Aplicar estilo visual:
  - Frame com fundo laranja claro
  - Bordas marrom suave
  - Texto branco
  - Placeholder em branco opaco
- [ ] Implementar textarea com autocompletar
- [ ] Integrar sugestões em tempo real da API
- [ ] Adicionar debouncing para chamadas à API
- [ ] Implementar botão "Otimizar Prompt" (laranja escuro, texto branco)
- [ ] Adicionar indicadores de loading
- [ ] Implementar tratamento de erros

### 3.3 Visualizador de Prompt Otimizado (Output)
**Duração estimada**: 2-3 dias

- [ ] Criar componente `OptimizedPromptViewer`
- [ ] Aplicar estilo visual:
  - Frame com fundo laranja médio (tom sobre tom)
  - Bordas marrom suave
  - Texto branco
- [ ] Exibir prompt otimizado com formatação
- [ ] Implementar contador de tokens (texto branco com destaque)
- [ ] Adicionar botão "Copiar" com feedback visual (estilo laranja/marrom)
- [ ] Implementar animações de transição

### 3.4 Sistema de Propagandas
**Duração estimada**: 2 dias

- [ ] Criar componente `AdsBanner`
- [ ] Aplicar estilo visual:
  - Frame com fundo laranja escuro (tom sobre tom)
  - Bordas marrom suave
  - Texto branco para títulos
- [ ] Implementar carregamento de propagandas da API
- [ ] Exibir 3 propagandas aleatórias
- [ ] Adicionar links clicáveis nas imagens
- [ ] Implementar fallback para imagens quebradas
- [ ] Adicionar rotação automática (opcional)

### 3.5 Integração com Backend (Axios)
**Duração estimada**: 2 dias

- [ ] Criar serviço de API client com axios
- [ ] Configurar baseURL e timeout
- [ ] Implementar chamadas para `/api/optimize`
- [ ] Implementar chamadas para `/api/suggest`
- [ ] Implementar chamadas para `/api/ads`
- [ ] Adicionar interceptors para tratamento de erros
- [ ] Implementar retry logic com axios-retry
- [ ] Adicionar loading states

### 3.6 Experiência do Usuário
**Duração estimada**: 2-3 dias

- [ ] Adicionar estados de loading
- [ ] Implementar mensagens de erro amigáveis
- [ ] Adicionar tooltips e ajuda contextual
- [ ] Implementar animações e transições
- [ ] Otimizar performance
- [ ] Testar responsividade em diferentes dispositivos

---

## Fase 4: Integração e Testes

### 4.1 Testes Unitários
**Duração estimada**: 3-4 dias

#### Backend (Jest + Supertest)
- [ ] Configurar Jest para Node.js
- [ ] Testes para sistema de configuração
- [ ] Testes para cada engine de IA (com mocks)
- [ ] Testes para serviço de otimização
- [ ] Testes para endpoints da API com Supertest
- [ ] Testes para sistema de propagandas

#### Frontend (Vitest + React Testing Library)
- [ ] Configurar Vitest
- [ ] Testes para componentes principais
- [ ] Testes para serviços de API (com MSW - Mock Service Worker)
- [ ] Testes para hooks customizados

### 4.2 Testes de Integração
**Duração estimada**: 2-3 dias

- [ ] Testar fluxo completo de otimização
- [ ] Testar sugestões em tempo real
- [ ] Testar com diferentes provedores de IA
- [ ] Testar sistema de propagandas
- [ ] Testar tratamento de erros

### 4.3 Testes End-to-End
**Duração estimada**: 2-3 dias

- [ ] Configurar Playwright ou Cypress
- [ ] Testar jornada completa do usuário
- [ ] Testar em diferentes navegadores
- [ ] Testar responsividade

---

## Fase 5: Documentação e Deploy

### 5.1 Documentação
**Duração estimada**: 2-3 dias

- [ ] Atualizar README.md com instruções de instalação
- [ ] Documentar API (Swagger/OpenAPI)
- [ ] Criar guia de configuração
- [ ] Documentar estrutura de arquivos de configuração
- [ ] Criar guia de contribuição
- [ ] Adicionar exemplos de uso

### 5.2 Containerização
**Duração estimada**: 2 dias

- [ ] Criar Dockerfile para backend (Node.js)
  - Multi-stage build para otimização
  - Usar node:alpine como base
- [ ] Criar Dockerfile para frontend (Nginx)
  - Build da aplicação React
  - Servir com Nginx
- [ ] Configurar docker-compose.yml
  - Serviço backend (porta 3000)
  - Serviço frontend (porta 80)
  - Volumes para configuração
- [ ] Testar build e execução em containers
- [ ] Otimizar tamanho das imagens

### 5.3 Deploy e CI/CD
**Duração estimada**: 2-3 dias

- [ ] Configurar pipeline CI/CD (GitHub Actions, GitLab CI, etc.)
- [ ] Configurar deploy automático
- [ ] Configurar variáveis de ambiente para produção
- [ ] Implementar health checks
- [ ] Configurar logging e monitoramento

### 5.4 Segurança
**Duração estimada**: 2 dias

- [ ] Implementar rate limiting
- [ ] Validar e sanitizar inputs
- [ ] Configurar CORS adequadamente
- [ ] Implementar HTTPS
- [ ] Revisar segurança de API keys
- [ ] Adicionar autenticação (se necessário)

---

## Fase 6: Refinamento e Otimização

### 6.1 Performance
**Duração estimada**: 2-3 dias

- [ ] Otimizar tempo de resposta da API
- [ ] Implementar caching estratégico
- [ ] Otimizar bundle size do frontend
- [ ] Implementar lazy loading
- [ ] Otimizar imagens de propagandas

### 6.2 Melhorias de UX
**Duração estimada**: 2-3 dias

- [ ] Coletar feedback de usuários
- [ ] Implementar melhorias sugeridas
- [ ] Adicionar atalhos de teclado
- [ ] Melhorar acessibilidade (WCAG)
- [ ] Adicionar tema escuro (opcional)

### 6.3 Funcionalidades Adicionais (Opcional)
**Duração estimada**: Variável

- [ ] Histórico de prompts otimizados
- [ ] Exportar prompts em diferentes formatos
- [ ] Comparação lado a lado de prompts
- [ ] Métricas e analytics
- [ ] Sistema de favoritos
- [ ] Compartilhamento de prompts

---

## Cronograma Estimado

| Fase | Duração | Dependências |
|------|---------|--------------|
| **Fase 1**: Planejamento | 2-3 dias | - |
| **Fase 2**: Backend | 13-19 dias | Fase 1 |
| **Fase 3**: Frontend | 13-17 dias | Fase 1, Fase 2 (parcial) |
| **Fase 4**: Testes | 7-10 dias | Fase 2, Fase 3 |
| **Fase 5**: Deploy | 8-10 dias | Fase 4 |
| **Fase 6**: Refinamento | 4-6 dias | Fase 5 |
| **TOTAL** | **47-65 dias** (~2-3 meses) | |

---

## Riscos e Mitigações

### Riscos Técnicos

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Latência alta nas sugestões em tempo real | Alto | Média | Implementar caching, debouncing agressivo, usar modelos mais rápidos |
| Custos elevados de API | Alto | Alta | Implementar rate limiting, caching, monitorar uso |
| Incompatibilidade entre engines | Médio | Média | Abstração robusta, testes extensivos |
| Problemas de CORS | Baixo | Baixa | Configuração adequada desde o início |

### Riscos de Projeto

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Mudanças de requisitos | Médio | Média | Arquitetura flexível, comunicação frequente |
| Atrasos no desenvolvimento | Médio | Média | Buffer de tempo no cronograma |
| Falta de recursos | Alto | Baixa | Priorizar funcionalidades core |

---

## Critérios de Sucesso

- [ ] Sistema otimiza prompts com qualidade superior ao input
- [ ] Sugestões em tempo real funcionam com latência < 500ms
- [ ] Suporte a todos os 7 provedores de IA especificados
- [ ] Interface responsiva e intuitiva
- [ ] Sistema de propagandas funcional
- [ ] Cobertura de testes > 80%
- [ ] Documentação completa
- [ ] Deploy automatizado funcional

---

## Próximos Passos Imediatos

1. ✅ Definir stack tecnológica final
2. ✅ Criar estrutura de diretórios
3. ✅ Configurar repositório Git
4. ✅ Inicializar projeto backend
5. ✅ Inicializar projeto frontend
6. ✅ Criar arquivos de exemplo de configuração
7. ✅ Começar desenvolvimento do sistema de configuração

---

## Notas

- Este plano é flexível e pode ser ajustado conforme necessário
- Priorize funcionalidades core antes de features adicionais
- Mantenha comunicação constante com stakeholders
- Documente decisões técnicas importantes
- Realize code reviews regulares
