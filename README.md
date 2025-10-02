# GenAI Eng Prompt

Uma aplicação web moderna para otimização de prompts utilizando as melhores práticas de engenharia de prompt, com suporte a múltiplos provedores de IA.

![Version](https://img.shields.io/badge/version-0.1.0-orange)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Funcionalidades

- ✨ **Otimização de Prompts**: Melhora prompts seguindo melhores práticas de engenharia
- 💡 **Sugestões em Tempo Real**: Autocomplete inteligente durante a digitação
- 🔌 **Múltiplos Provedores**: Suporte a OpenAI, Anthropic, Ollama, Perplexity, OpenRouter, OpenWebUI e GenerAtiva
- 📊 **Contador de Tokens**: Visualização de tokens de entrada e saída
- 📋 **Copiar para Área de Transferência**: Cópia rápida do prompt otimizado
- 🎨 **Interface Moderna**: Design responsivo com paleta laranja e marrom
- 📢 **Sistema de Propagandas**: Exibição de anúncios configuráveis

## 🏗️ Arquitetura

### Backend (Node.js + Express)
- API RESTful para otimização de prompts
- Abstração de engines de IA com suporte a múltiplos provedores
- Sistema de configuração flexível (JSON + .env)
- Serve frontend buildado em produção

### Frontend (React + Vite)
- Interface responsiva com TailwindCSS
- Componentes reutilizáveis
- Integração com API via Axios
- Build otimizado para produção

## 📋 Pré-requisitos

- Node.js >= 18
- npm ou yarn
- API Key de pelo menos um provedor de IA

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd genai-eng-prompt
```

### 2. Instale as dependências

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas API keys:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
PORT=3010
NODE_ENV=development
PROVIDER=openai

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# Ou use outro provedor...
```

## 🚀 Execução

### Desenvolvimento

#### Backend (porta 3010)
```bash
cd backend
npm run dev
```

#### Frontend (porta 5173)
```bash
cd frontend
npm run dev
```

Acesse: http://localhost:5173

### Produção

#### 1. Build do frontend
```bash
cd frontend
npm run build:prod
```

Isso irá:
- Fazer build do frontend
- Copiar arquivos para `backend/public`

#### 2. Inicie o backend
```bash
cd backend
npm start
```

Acesse: http://localhost:3010

## 🐳 Docker

### Build e execução com Docker Compose

```bash
# Configure o .env na raiz do projeto
cp .env.example .env

# Build e inicie
docker-compose up -d

# Visualize logs
docker-compose logs -f

# Pare os containers
docker-compose down
```

Acesse: http://localhost:3010

## 📁 Estrutura do Projeto

```
genai-eng-prompt/
├── backend/
│   ├── src/
│   │   ├── config/          # Sistema de configuração
│   │   ├── engines/         # Engines de IA (OpenAI, Anthropic, etc.)
│   │   ├── middleware/      # Middlewares Express
│   │   ├── routes/          # Rotas da API
│   │   ├── services/        # Lógica de negócio
│   │   └── utils/           # Utilitários
│   ├── public/              # Frontend buildado (gerado)
│   ├── server.js            # Servidor Express
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # Serviços de API
│   │   ├── hooks/           # React hooks customizados
│   │   ├── utils/           # Utilitários
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docs/                    # 📚 Documentação completa
│   ├── README.md            # Índice da documentação
│   ├── REQUIREMENTS.md      # Especificação de requisitos
│   └── PLAN.md              # Plano de execução
├── config/
│   ├── config.example.json  # Exemplo de configuração
│   └── ads.example.conf     # Exemplo de propagandas
├── docker-compose.yml
├── .env.example
├── CHANGELOG.md
└── README.md
```

## 🔌 Provedores Suportados

| Provedor | Engine | Embeddings | URL Customizável |
|----------|--------|------------|------------------|
| OpenAI | openai | ✅ | ❌ |
| Anthropic | anthropic | ❌ | ❌ |
| Ollama | ollama | ✅ | ✅ |
| Perplexity | perplexity | ❌ | ❌ |
| OpenRouter | openai | ❌ | ✅ |
| OpenWebUI | openai | ✅ | ✅ |
| GenerAtiva | openai | ✅ | ✅ |

## 📡 API Endpoints

### POST /api/optimize
Otimiza um prompt.

**Request:**
```json
{
  "prompt": "seu prompt aqui"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "originalPrompt": "...",
    "optimizedPrompt": "...",
    "tokens": {
      "input": 50,
      "output": 150,
      "total": 200
    },
    "provider": "openai",
    "model": "gpt-4"
  }
}
```

### POST /api/suggest
Gera sugestões em tempo real.

**Request:**
```json
{
  "text": "texto parcial",
  "cursorPosition": 10
}
```

### GET /api/ads
Retorna propagandas aleatórias.

**Query params:**
- `count` (opcional): número de propagandas (padrão: 3)

### GET /api/health
Health check da API.

### GET /api/providers
Lista provedores configurados.

## ⚙️ Configuração

### Arquivo de Configuração (Produção)

Crie `/etc/rapport/genai-eng-prompt/config.json`:

```json
{
  "provider": "openai",
  "providers": {
    "openai": {
      "apiKey": "sk-...",
      "engine": "openai",
      "model": "gpt-4",
      "supportsEmbeddings": true
    }
  }
}
```

### Propagandas

Crie `/etc/rapport/genai-eng-prompt/ads.conf`:

```json
[
  {
    "titulo": "Título da propaganda",
    "link": "https://exemplo.com",
    "imagePath": "https://exemplo.com/imagem.png"
  }
]
```

**Monitoramento Automático**: O serviço monitora automaticamente o arquivo `ads.conf` e recarrega as propagandas sempre que ele for modificado, sem necessidade de reiniciar o servidor.

Para recarregar manualmente via API:
```bash
curl -X POST http://localhost:3010/api/ads/reload
```

## 🎨 Personalização

### Cores (TailwindCSS)

As cores podem ser customizadas em `frontend/tailwind.config.js`:

```js
colors: {
  primary: {
    500: '#FF8C42',  // Laranja principal
    // ...
  },
  brown: {
    400: '#A0522D',  // Marrom para bordas
    // ...
  }
}
```

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 Scripts Disponíveis

### Backend
- `npm start` - Inicia servidor em produção
- `npm run dev` - Inicia servidor em desenvolvimento (nodemon)
- `npm test` - Executa testes

### Frontend
- `npm run dev` - Inicia dev server (Vite)
- `npm run build` - Build para produção
- `npm run build:prod` - Build + copia para backend/public
- `npm run preview` - Preview do build

## 🔒 Segurança

- API keys armazenadas em variáveis de ambiente
- Validação de inputs com express-validator
- CORS configurado
- Rate limiting (recomendado para produção)
- HTTPS em produção (recomendado)

## 📚 Documentação

A documentação completa do projeto está disponível na pasta [`docs/`](./docs/):

- **[Índice da Documentação](./docs/README.md)** - Guia completo da documentação
- **[REQUIREMENTS.md](./docs/REQUIREMENTS.md)** - Especificação de requisitos do sistema
- **[PLAN.md](./docs/PLAN.md)** - Plano de execução e desenvolvimento
- **[EMBEDDINGS.md](./docs/EMBEDDINGS.md)** - Documentação sobre modelos de embeddings
- **[EMBEDDING_CONFIG.md](./docs/EMBEDDING_CONFIG.md)** - Como configurar modelos de embeddings
- **[CHANGELOG.md](./CHANGELOG.md)** - Histórico de mudanças

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

**Documentação**: Toda documentação extra deve ser colocada na pasta `docs/`

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato.

---

**Desenvolvido com ❤️ usando React, Node.js e IA**
