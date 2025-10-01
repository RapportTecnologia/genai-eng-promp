# 🔧 Troubleshooting

Guia de solução de problemas comuns do GenAI Eng Prompt.

## Problemas com Variáveis de Ambiente

### Problema: Sistema não carrega variáveis do arquivo `.env`

**Sintomas:**
- O provedor configurado em `PROVIDER` não é respeitado
- Sistema usa provedor diferente do configurado
- Erro "API Key inválida" mesmo com chave correta
- Variáveis de ambiente aparecem como `undefined`

**Causa:**
O arquivo `.env` não está sendo carregado corretamente pelo `dotenv`.

**Solução:**
1. Certifique-se de que o arquivo `.env` existe na raiz do projeto (não apenas `.env.example`):
   ```bash
   ls -la .env
   ```

2. Se não existir, copie do exemplo:
   ```bash
   cp .env.example .env
   ```

3. Edite o `.env` com suas configurações reais:
   ```bash
   nano .env  # ou use seu editor preferido
   ```

4. Verifique se as variáveis estão corretas:
   ```bash
   grep "^PROVIDER=" .env
   grep "^OPENROUTER_API_KEY=" .env
   ```

### Problema: Provedor configurado como `openrouter` mas usa OpenAI

**Sintomas:**
- `.env` tem `PROVIDER=openrouter`
- Logs mostram "Provedor: openai"
- Usa modelo OpenAI em vez do OpenRouter

**Causa:**
Sistema está carregando configuração do arquivo `config.example.json` em vez do `.env`.

**Solução:**
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Reinicie o servidor backend completamente
3. Verifique os logs de inicialização:
   - Deve mostrar: `✓ Configuração carregada de variáveis de ambiente`
   - NÃO deve mostrar: `Usando configuração de exemplo (desenvolvimento)`

## Problemas com API Keys

### Problema: "API Key inválida ou não autorizada"

**Sintomas:**
- Erro 401 ao testar conexão
- Mensagem: "API Key inválida ou não autorizada"

**Soluções:**

1. **Verifique se a API Key está correta:**
   ```bash
   # Para OpenRouter
   grep "^OPENROUTER_API_KEY=" .env
   
   # Para OpenAI
   grep "^OPENAI_API_KEY=" .env
   ```

2. **Teste a API Key manualmente:**
   ```bash
   # OpenRouter
   curl https://openrouter.ai/api/v1/models \
     -H "Authorization: Bearer $OPENROUTER_API_KEY"
   
   # OpenAI
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```

3. **Verifique se há espaços ou quebras de linha na API Key:**
   - A API Key deve estar em uma única linha
   - Não deve ter espaços antes ou depois
   - Não deve ter aspas

4. **Regenere a API Key:**
   - OpenRouter: https://openrouter.ai/keys
   - OpenAI: https://platform.openai.com/api-keys

### Problema: API Key do OpenRouter não funciona

**Sintomas:**
- API Key começa com `sk-or-v1-`
- Erro 401 ou 403

**Soluções:**

1. **Verifique o saldo da conta:**
   - Acesse: https://openrouter.ai/credits
   - OpenRouter requer créditos pré-pagos

2. **Verifique as permissões da chave:**
   - Acesse: https://openrouter.ai/keys
   - Certifique-se de que a chave tem permissões de leitura/escrita

3. **Teste com modelo gratuito:**
   ```env
   OPENROUTER_MODEL=google/gemma-7b-it:free
   ```

## Problemas de Conexão

### Problema: "Não foi possível conectar ao servidor"

**Sintomas:**
- Erro ECONNREFUSED
- Erro ENOTFOUND
- Timeout de conexão

**Soluções:**

1. **Verifique a conexão com a internet:**
   ```bash
   ping -c 3 google.com
   ```

2. **Verifique se a URL está correta:**
   ```bash
   # OpenRouter
   grep "^OPENROUTER_BASE_URL=" .env
   # Deve ser: https://openrouter.ai/api/v1
   ```

3. **Teste a conexão diretamente:**
   ```bash
   curl -I https://openrouter.ai/api/v1/models
   ```

4. **Verifique firewall/proxy:**
   - Certifique-se de que não há bloqueio de saída na porta 443
   - Configure proxy se necessário

### Problema: Ollama não conecta

**Sintomas:**
- Erro ao conectar com `http://localhost:11434`
- Modelo não encontrado

**Soluções:**

1. **Verifique se o Ollama está rodando:**
   ```bash
   ollama list
   ```

2. **Inicie o Ollama:**
   ```bash
   ollama serve
   ```

3. **Baixe o modelo:**
   ```bash
   ollama pull granite3.3:8b
   ```

4. **Teste a conexão:**
   ```bash
   curl http://localhost:11434/api/tags
   ```

## Problemas de Configuração

### Problema: "Provedor não configurado"

**Sintomas:**
- Erro: `Provedor 'xxx' não configurado`
- Sistema não encontra o provedor

**Soluções:**

1. **Verifique se as variáveis do provedor estão definidas:**
   ```bash
   # Para OpenRouter
   grep "^OPENROUTER" .env
   
   # Deve ter pelo menos:
   # OPENROUTER_API_KEY=...
   # OPENROUTER_BASE_URL=...
   # OPENROUTER_MODEL=...
   ```

2. **Verifique se o nome do provedor está correto:**
   ```env
   # Nomes válidos:
   PROVIDER=openai
   PROVIDER=anthropic
   PROVIDER=ollama
   PROVIDER=openrouter
   PROVIDER=perplexity
   PROVIDER=openwebui
   PROVIDER=generativa
   ```

3. **Liste os provedores disponíveis:**
   ```bash
   curl http://localhost:3011/api/providers
   ```

### Problema: Modelo não encontrado (404)

**Sintomas:**
- Erro 404: "Modelo não encontrado"
- Mensagem: `O modelo "xxx" não está disponível`

**Soluções:**

1. **Verifique se o modelo está disponível no provedor:**
   - OpenRouter: https://openrouter.ai/models
   - OpenAI: https://platform.openai.com/docs/models

2. **Use um modelo válido:**
   ```env
   # OpenRouter - modelos populares
   OPENROUTER_MODEL=mistralai/mistral-7b-instruct
   OPENROUTER_MODEL=google/gemma-7b-it:free
   OPENROUTER_MODEL=meta-llama/llama-3-8b-instruct
   
   # OpenAI
   OPENAI_MODEL=gpt-4
   OPENAI_MODEL=gpt-3.5-turbo
   ```

## Problemas de Performance

### Problema: Respostas muito lentas

**Soluções:**

1. **Use modelo mais rápido:**
   ```env
   # Em vez de gpt-4
   OPENAI_MODEL=gpt-3.5-turbo
   
   # OpenRouter - modelos rápidos
   OPENROUTER_MODEL=mistralai/mistral-7b-instruct
   ```

2. **Reduza max_tokens:**
   - Edite as configurações no código se necessário

3. **Use Ollama local:**
   ```env
   PROVIDER=ollama
   OLLAMA_MODEL=granite3.3:8b
   ```

### Problema: Limite de requisições excedido (429)

**Sintomas:**
- Erro 429: "Too Many Requests"
- Mensagem: "Limite de requisições excedido"

**Soluções:**

1. **Aguarde alguns minutos antes de tentar novamente**

2. **Verifique os limites da sua conta:**
   - OpenAI: https://platform.openai.com/account/limits
   - OpenRouter: https://openrouter.ai/credits

3. **Implemente rate limiting no código**

4. **Considere upgrade do plano**

## Logs e Debug

### Como ver logs detalhados

1. **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Verificar variáveis de ambiente carregadas:**
   - Procure por: `✓ Configuração carregada de variáveis de ambiente`
   - Procure por: `🤖 Provedor: xxx`

3. **Testar conexão:**
   ```bash
   curl http://localhost:3011/api/health
   ```

### Logs importantes

- `✓ Configuração carregada de variáveis de ambiente` - Bom! Usando `.env`
- `Usando configuração de exemplo (desenvolvimento)` - Ruim! Não encontrou `.env`
- `✓ Engine xxx inicializada` - Engine criada com sucesso
- `✓ Conexão com xxx estabelecida com sucesso` - Conexão OK

## Checklist de Diagnóstico

Quando tiver problemas, verifique nesta ordem:

- [ ] Arquivo `.env` existe na raiz do projeto
- [ ] Variável `PROVIDER` está definida corretamente
- [ ] API Key do provedor está definida e válida
- [ ] Base URL está correta (se aplicável)
- [ ] Modelo existe e está disponível no provedor
- [ ] Há conexão com a internet
- [ ] Servidor backend está rodando
- [ ] Logs mostram "Configuração carregada de variáveis de ambiente"
- [ ] Logs mostram o provedor correto sendo usado
- [ ] Teste de conexão passa com sucesso

## Precisa de Mais Ajuda?

1. **Verifique os logs completos** do backend
2. **Teste a API manualmente** com curl
3. **Consulte a documentação** do provedor específico
4. **Abra uma issue** no repositório com:
   - Logs completos (sem expor API keys!)
   - Configuração usada (sem API keys!)
   - Passos para reproduzir o problema
