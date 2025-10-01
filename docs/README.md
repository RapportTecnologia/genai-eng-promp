# Documentação - GenAI Eng Prompt

Bem-vindo à documentação completa do projeto **GenAI Eng Prompt**.

## 📚 Índice de Documentação

### Documentos Principais

- **[REQUIREMENTS.md](./REQUIREMENTS.md)** - Especificação completa de requisitos do sistema
  - Visão geral do projeto
  - Arquitetura (Frontend React + Backend Express)
  - Funcionalidades principais
  - Integrações com provedores de IA
  - Sistema de configuração
  - Requisitos técnicos
  - Design visual (paleta laranja/marrom)

- **[PLAN.md](./PLAN.md)** - Plano de execução detalhado do projeto
  - Fases de desenvolvimento
  - Cronograma estimado
  - Estrutura de diretórios
  - Tarefas e checklists
  - Riscos e mitigações
  - Critérios de sucesso

- **[EMBEDDINGS.md](./EMBEDDINGS.md)** - Configuração de embeddings por provedor
  - Modelos utilizados por cada provedor
  - Implementação e seleção automática
  - Requisitos e casos de uso
  - Comparação de performance

## 🚀 Links Rápidos

### Documentação de Código

- [Backend README](../backend/README.md) - Documentação do backend Node.js + Express
- [Frontend README](../frontend/README.md) - Documentação do frontend React + Vite

### Arquivos de Configuração

- [config.example.json](../config/config.example.json) - Exemplo de configuração do sistema
- [ads.example.conf](../config/ads.example.conf) - Exemplo de configuração de propagandas
- [.env.example](../.env.example) - Exemplo de variáveis de ambiente

### Outros Documentos

- [CHANGELOG.md](../CHANGELOG.md) - Histórico de mudanças do projeto
- [README.md](../README.md) - Documentação principal do projeto

## 🎯 Começando

Se você é novo no projeto, recomendamos ler na seguinte ordem:

1. **README.md** (raiz) - Visão geral e instruções de instalação
2. **REQUIREMENTS.md** - Entender os requisitos e funcionalidades
3. **PLAN.md** - Conhecer o plano de desenvolvimento
4. **Backend README** - Configurar e executar o backend
5. **Frontend README** - Configurar e executar o frontend

## 🏗️ Arquitetura do Projeto

```
GenAI Eng Prompt
├── Backend (Node.js + Express)
│   ├── API RESTful
│   ├── Engines de IA (OpenAI, Anthropic, Ollama, etc.)
│   ├── Serve frontend buildado
│   └── Porta configurável (padrão: 3010)
│
└── Frontend (React + Vite)
    ├── Interface responsiva
    ├── Paleta laranja/marrom
    ├── Editor de prompts
    ├── Visualizador otimizado
    └── Sistema de propagandas
```

## 🎨 Design System

### Paleta de Cores

- **Laranja**: `#FF8C42`, `#FFA500` (fundo principal e frames)
- **Marrom**: `#8B4513`, `#A0522D` (bordas e detalhes)
- **Texto**: Branco (`#FFFFFF`) para contraste

### Componentes

- **Frames**: Tom sobre tom laranja com bordas marrom
- **Botões**: Laranja escuro com texto branco
- **Inputs**: Laranja claro semi-transparente

## 🔧 Tecnologias

### Backend
- Node.js + Express
- OpenAI SDK, Anthropic SDK
- Axios, tiktoken
- express-validator, dotenv

### Frontend
- React 18.3 + Vite 5.3
- TailwindCSS 3.4
- Axios, Lucide React

### DevOps
- Docker + Docker Compose
- Multi-stage builds
- Porta configurável

## 📝 Contribuindo

Para contribuir com a documentação:

1. Mantenha a consistência com o formato existente
2. Atualize o CHANGELOG.md para mudanças significativas
3. Use Markdown para formatação
4. Adicione exemplos quando apropriado
5. Mantenha este índice atualizado

## 📞 Suporte

Para dúvidas ou problemas:

- Consulte a documentação relevante
- Verifique o CHANGELOG.md para mudanças recentes
- Abra uma issue no repositório

---

**Última atualização**: 2025-10-01
**Versão**: 0.1.0
