# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Corrigido
- **Carregamento de variáveis de ambiente**: Corrigido o caminho do arquivo `.env` para ser carregado corretamente do diretório raiz do projeto
  - Atualizado `backend/server.js` para usar `path.join(__dirname, '../.env')`
  - Atualizado `backend/src/config/config.loader.js` para usar `path.join(__dirname, '../../../.env')`
  - Agora o provedor configurado em `PROVIDER` no `.env` é respeitado corretamente
  - Corrigido problema onde o sistema usava OpenAI mesmo quando `PROVIDER=openrouter` estava configurado

### Adicionado
- **Delegação de embeddings**: Provedores sem suporte nativo a embeddings (Anthropic, Perplexity) podem delegar para outros provedores
  - Configure `embeddingModel` com o nome de outro provedor (ex: "openai", "ollama")
  - Sistema automaticamente cria e usa a engine delegada
  - Logs informativos sobre delegação
- **Configuração de modelos de embeddings**: Agora é possível escolher qual modelo de embeddings usar para cada provedor
- Variáveis de ambiente para modelos de embeddings:
  - `OPENAI_EMBEDDING_MODEL` (padrão: `text-embedding-3-large`)
  - `OPENROUTER_EMBEDDING_MODEL` (padrão: `text-embedding-3-small`)
  - `OLLAMA_EMBEDDING_MODEL` (padrão: `granite-embedding:278m`)
  - `OPENWEBUI_EMBEDDING_MODEL` (padrão: `granite-embedding:278m`)
  - `GENERATIVA_EMBEDDING_MODEL` (padrão: `text-embedding-3-large`)
  - `ANTHROPIC_EMBEDDING_MODEL` (nome do provedor para delegação)
  - `PERPLEXITY_EMBEDDING_MODEL` (nome do provedor para delegação)
- Campo `embeddingModel` no `config.json` para cada provedor
- Propriedade `embeddingModel` na classe `BaseEngine`
- Documentação completa em `docs/EMBEDDING_CONFIG.md`
- Suporte a embeddings no OpenRouter com modelo `text-embedding-3-small`
- Documentação completa de embeddings em `docs/EMBEDDINGS.md`
- Seleção automática de modelos de embeddings por provedor (fallback):
  - OpenAI: `text-embedding-3-large` (melhor qualidade)
  - OpenRouter: `text-embedding-3-small` (balanço custo/performance)
  - Ollama: `granite-embedding:278m` (execução local)
  - OpenWebUI: `granite-embedding:278m` (compatível com Ollama)
  - GenerAtiva: `text-embedding-3-large`

### Modificado
- `BaseEngine.constructor()` agora aceita e armazena `embeddingModel`
- `BaseEngine.getInfo()` retorna informação sobre o modelo de embeddings
- `OpenAIEngine.generateEmbeddings()` usa modelo configurado com fallback inteligente
- `OllamaEngine.generateEmbeddings()` usa modelo configurado com fallback para `granite-embedding:278m`
- `ConfigLoader.loadFromEnv()` carrega variáveis `*_EMBEDDING_MODEL`
- `.env.example` atualizado com exemplos de configuração de embeddings
- `config.example.json` atualizado com campo `embeddingModel`
- `docs/EMBEDDINGS.md` atualizado com instruções de configuração
- README.md atualizado com links para documentação de embeddings

### Em Desenvolvimento
- Testes unitários e de integração
- Sistema de cache para otimização
- Histórico de prompts otimizados
- Métricas e analytics

---

## [0.1.0] - 2025-10-01

- Documentação inicial do projeto
- `REQUIREMENTS.md` - Especificação completa de requisitos
- `PLAN.md` - Plano de execução detalhado
- `CHANGELOG.md` - Histórico de mudanças
- Definição da stack tecnológica:
  - Frontend: React.js + Vite + TailwindCSS + shadcn/ui
  - Backend: Node.js + Express
  - Integrações: OpenAI, Anthropic, Ollama, Perplexity, OpenRouter, OpenWebUI, GenerAtiva
- Estrutura de diretórios planejada
- Especificação de arquivos de configuração:
  - `/etc/rapport/genai-eng-prompt/config.json`
  - `/etc/rapport/genai-eng-prompt/ads.conf`
  - `.env` para desenvolvimento local
- Definição da identidade visual:
  - Paleta de cores: Laranja e marrom
  - Fundo principal laranja (#FF8C42, #FFA500)
  - Bordas marrom claro (#8B4513, #A0522D)
  - Frames em tom sobre tom laranja
  - Texto branco para contraste
  - Especificações de design para componentes
- Arquitetura de deploy:
  - Backend Express serve frontend buildado na raiz
  - Porta configurável via `config.json` ou variável de ambiente `PORT` (padrão: 3010)
  - Frontend buildado com `npm run build` copiado para `backend/public`
  - API acessível em `https://localhost:{PORT}/api/*`
  - Dockerfile multi-stage para build integrado
- Sistema de configuração:
  - Porta do servidor configurável
  - Suporte a variáveis de ambiente (.env)
  - Prioridade: .env > config.json
- Sistema completo de configuração com suporte a .env e config.json
- Abstração de engines de IA com classe base
- Engine OpenAI com suporte a tiktoken para contagem precisa de tokens
- Engine Anthropic Claude
- Engine Ollama (local)
- Engine Perplexity
- Suporte a APIs compatíveis com OpenAI (OpenRouter, OpenWebUI, GenerAtiva)
- Serviço de otimização de prompts com prompt system especializado
- Serviço de sugestões em tempo real
- Serviço de gerenciamento de propagandas
- API RESTful completa com endpoints:
  - POST /api/optimize - Otimização de prompts
  - POST /api/suggest - Sugestões em tempo real
  - GET /api/ads - Propagandas aleatórias
  - GET /api/health - Health check
  - GET /api/providers - Lista de provedores
- Middleware de validação com express-validator
- Middleware de tratamento de erros
- Sistema de retry com axios-retry
- Servidor Express serve frontend buildado em produção
- Porta padrão alterada para 3010
- Aplicação React completa com Vite
- Componente PromptEditor com sugestões em tempo real
- Componente OptimizedPromptViewer com contador de tokens
- Componente AdsBanner com carregamento dinâmico
- Serviço de API com axios e interceptors
- Interface responsiva com TailwindCSS
- Paleta de cores laranja e marrom conforme especificação
- Sistema de cópia para área de transferência
- Estados de loading e tratamento de erros
- Integração completa com backend

#### DevOps
- Dockerfile multi-stage para build otimizado
- docker-compose.yml com configuração completa
- Script de build integrado (build:prod)
- .dockerignore para otimização de build
- .gitignore configurado
- README.md completo com documentação

#### Configuração
- Arquivos de exemplo: config.example.json e ads.example.conf
- .env.example com todas as variáveis de ambiente
- Suporte a configuração via arquivo ou variáveis de ambiente
- Prioridade: .env > config.json

### Modificado
- Porta padrão do servidor alterada de 3000 para 3010
- Backend agora serve frontend buildado na raiz (/)
- API acessível em /api/*
- Documentação reorganizada: REQUIREMENTS.md e PLAN.md movidos para pasta `docs/`

### Organização
- Criada pasta `docs/` para documentação completa
- `docs/README.md` - Índice da documentação
- `docs/REQUIREMENTS.md` - Especificação de requisitos
- `docs/PLAN.md` - Plano de execução
- README.md principal atualizado com referências à documentação


---

## Tipos de Mudanças

- **Adicionado** - para novas funcionalidades
- **Modificado** - para mudanças em funcionalidades existentes
- **Descontinuado** - para funcionalidades que serão removidas
- **Removido** - para funcionalidades removidas
- **Corrigido** - para correção de bugs
- **Segurança** - para vulnerabilidades de segurança

---

## Notas de Versão

### Versionamento Semântico (SemVer)

Dado um número de versão MAJOR.MINOR.PATCH, incremente:

- **MAJOR** (principal): quando fizer mudanças incompatíveis na API
- **MINOR** (secundária): quando adicionar funcionalidades mantendo compatibilidade
- **PATCH** (correção): quando corrigir bugs mantendo compatibilidade

Versões de pré-lançamento podem ser denotadas anexando um hífen e uma série de identificadores separados por ponto (ex: 1.0.0-alpha, 1.0.0-beta.1).

---

## Links

- [Repositório](https://github.com/seu-usuario/genai-eng-prompt)
- [Issues](https://github.com/seu-usuario/genai-eng-prompt/issues)
- [Pull Requests](https://github.com/seu-usuario/genai-eng-prompt/pulls)

---

[Unreleased]: https://github.com/seu-usuario/genai-eng-prompt/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/rapporttecnologia/genai-eng-prompt/releases/tag/v0.1.0
