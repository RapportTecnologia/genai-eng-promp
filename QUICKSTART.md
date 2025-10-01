# 🚀 Guia de Início Rápido

Este guia irá ajudá-lo a colocar o GenAI Eng Prompt em funcionamento rapidamente.

## ⚡ Início Rápido (Desenvolvimento)

### 1. Instale as Dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o `.env` e adicione sua API key:

```env
PORT=3010
NODE_ENV=development
PROVIDER=openai

# Adicione sua API key aqui
OPENAI_API_KEY=sk-seu-api-key-aqui
OPENAI_MODEL=gpt-4
```

### 3. Inicie o Backend

```bash
cd backend
npm run dev
```

O backend estará rodando em: http://localhost:3010

### 4. Inicie o Frontend (em outro terminal)

```bash
cd frontend
npm run dev
```

O frontend estará rodando em: http://localhost:5173

### 5. Acesse a Aplicação

Abra seu navegador em: **http://localhost:5173**

## 🐳 Início Rápido (Docker)

### 1. Configure o .env

```bash
cp .env.example .env
# Edite o .env com suas API keys
```

### 2. Build e Execute

```bash
docker-compose up -d
```

### 3. Acesse

Abra: **http://localhost:3010**

## 🔑 Obtendo API Keys

### OpenAI
1. Acesse: https://platform.openai.com/api-keys
2. Crie uma nova API key
3. Adicione ao `.env`: `OPENAI_API_KEY=sk-...`

### Anthropic
1. Acesse: https://console.anthropic.com/
2. Crie uma API key
3. Adicione ao `.env`: `ANTHROPIC_API_KEY=sk-ant-...`

### Ollama (Local - Sem API Key)
1. Instale: https://ollama.ai/
2. Execute: `ollama run llama2`
3. Configure no `.env`:
```env
PROVIDER=ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

## 📝 Testando a API

### Health Check
```bash
curl http://localhost:3010/api/health
```

### Otimizar Prompt
```bash
curl -X POST http://localhost:3010/api/optimize \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Escreva uma história sobre um robô"}'
```

## 🔧 Troubleshooting

### Erro: "Nenhuma configuração válida encontrada"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Certifique-se de que pelo menos um provedor está configurado com API key válida

### Erro: "Erro de conexão"
- Verifique se o backend está rodando na porta 3010
- Verifique se não há firewall bloqueando a porta

### Frontend não carrega
- Certifique-se de que o backend está rodando
- Verifique o console do navegador para erros
- Tente limpar o cache: `Ctrl + Shift + R`

### Ollama não conecta
- Verifique se o Ollama está rodando: `ollama list`
- Teste a conexão: `curl http://localhost:11434/api/tags`

## 📚 Próximos Passos

1. Leia o [README.md](README.md) completo
2. Explore os [REQUIREMENTS.md](REQUIREMENTS.md) para entender as funcionalidades
3. Veja o [PLAN.md](PLAN.md) para o roadmap do projeto
4. Consulte o [CHANGELOG.md](CHANGELOG.md) para ver as atualizações

## 💡 Dicas

- Use `gpt-3.5-turbo` para testes (mais barato)
- Configure rate limiting em produção
- Use HTTPS em produção
- Monitore o uso de tokens para controlar custos

## 🆘 Precisa de Ajuda?

- Abra uma issue no repositório
- Consulte a documentação completa no README.md
- Verifique os logs: `docker-compose logs -f` (Docker) ou console do terminal

---

**Pronto! Agora você pode começar a otimizar seus prompts! ✨**
