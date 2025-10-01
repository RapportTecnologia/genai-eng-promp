# Configuração de Modelos de Embeddings

## Visão Geral

Agora você pode escolher qual modelo de embeddings usar para cada provedor de IA. Anteriormente, os modelos estavam hardcoded no código. Com esta atualização, você tem controle total sobre qual modelo usar.

## Como Configurar

### Opção 1: Variáveis de Ambiente (.env)

Adicione as seguintes variáveis ao seu arquivo `.env`:

#### Para provedores COM suporte a embeddings:
```bash
# OpenAI - especifica o modelo de embedding
OPENAI_EMBEDDING_MODEL=text-embedding-3-large

# Ollama - especifica o modelo de embedding
OLLAMA_EMBEDDING_MODEL=granite-embedding:278m

# OpenRouter - especifica o modelo de embedding
OPENROUTER_EMBEDDING_MODEL=text-embedding-3-small

# OpenWebUI - especifica o modelo de embedding
OPENWEBUI_EMBEDDING_MODEL=granite-embedding:278m

# GenerAtiva - especifica o modelo de embedding
GENERATIVA_EMBEDDING_MODEL=text-embedding-3-large
```

#### Para provedores SEM suporte a embeddings (delegação):
```bash
# Anthropic - delega embeddings para outro provedor
ANTHROPIC_EMBEDDING_MODEL=openai  # Nome do provedor

# Perplexity - delega embeddings para outro provedor
PERPLEXITY_EMBEDDING_MODEL=ollama  # Nome do provedor
```

### Opção 2: Arquivo de Configuração JSON

Edite seu `config.json` e adicione o campo `embeddingModel`:

#### Provedores COM suporte a embeddings:
```json
{
  "provider": "openai",
  "providers": {
    "openai": {
      "apiKey": "sk-...",
      "engine": "openai",
      "model": "gpt-4",
      "embeddingModel": "text-embedding-3-large",
      "supportsEmbeddings": true
    },
    "ollama": {
      "url": "http://localhost:11434",
      "engine": "ollama",
      "model": "llama2",
      "embeddingModel": "granite-embedding:278m",
      "supportsEmbeddings": true
    }
  }
}
```

#### Provedores SEM suporte a embeddings (delegação):
```json
{
  "providers": {
    "anthropic": {
      "apiKey": "sk-ant-...",
      "engine": "anthropic",
      "model": "claude-3-opus-20240229",
      "embeddingModel": "openai",
      "supportsEmbeddings": false
    },
    "perplexity": {
      "apiKey": "pplx-...",
      "engine": "perplexity",
      "model": "pplx-70b-online",
      "embeddingModel": "ollama",
      "supportsEmbeddings": false
    }
  }
}
```

**Nota**: Para provedores sem suporte nativo a embeddings, o valor de `embeddingModel` é o **nome de outro provedor** configurado que será usado para gerar embeddings.

## Modelos Disponíveis

### Para OpenAI, OpenRouter e GenerAtiva

| Modelo | Dimensões | Características |
|--------|-----------|-----------------|
| `text-embedding-3-large` | 3072 | Melhor qualidade, mais lento, mais caro |
| `text-embedding-3-small` | 1536 | Balanço entre qualidade e custo |
| `text-embedding-ada-002` | 1536 | Modelo legado (ainda suportado) |

### Para Ollama e OpenWebUI

| Modelo | Parâmetros | Características |
|--------|------------|-----------------|
| `granite-embedding:278m` | 278M | Recomendado (IBM Granite) |
| `nomic-embed-text` | - | Alternativa popular |
| `mxbai-embed-large` | - | Alta performance |

**Nota**: Para Ollama, você precisa fazer o pull do modelo primeiro:
```bash
ollama pull granite-embedding:278m
# ou
ollama pull nomic-embed-text
```

## Comportamento Padrão (Fallback)

Se você **não configurar** um modelo de embeddings, o sistema usa valores padrão inteligentes:

- **OpenAI**: `text-embedding-3-large`
- **OpenRouter**: `text-embedding-3-small`
- **OpenWebUI**: `granite-embedding:278m`
- **Ollama**: `granite-embedding:278m`
- **GenerAtiva**: `text-embedding-3-large`

## Delegação de Embeddings

### O que é?

Provedores como **Anthropic** e **Perplexity** não oferecem suporte nativo a embeddings. Com a delegação, você pode configurar esses provedores para usar **outro provedor** para gerar embeddings.

### Como funciona?

1. Configure o provedor principal (ex: Anthropic para chat)
2. Configure o campo `embeddingModel` com o **nome de outro provedor** (ex: "openai")
3. O sistema automaticamente delega chamadas de `generateEmbeddings()` para o provedor configurado

### Exemplo Prático

```bash
# .env
PROVIDER=anthropic

# Anthropic para chat (não suporta embeddings)
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-opus-20240229
ANTHROPIC_EMBEDDING_MODEL=openai  # Delega para OpenAI

# OpenAI para embeddings
OPENAI_API_KEY=sk-...
OPENAI_EMBEDDING_MODEL=text-embedding-3-large
```

Neste exemplo:
- **Chat**: Usa Claude (Anthropic)
- **Embeddings**: Usa OpenAI automaticamente

### Provedores Recomendados para Delegação

| Provedor Principal | Recomendação para Embeddings | Motivo |
|-------------------|------------------------------|--------|
| Anthropic | `openai` ou `ollama` | Alta qualidade ou gratuito (local) |
| Perplexity | `openai` ou `ollama` | Alta qualidade ou gratuito (local) |

## Exemplo de Uso

### Cenário 1: Usar modelo mais econômico no OpenAI

```bash
# .env
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

### Cenário 2: Usar modelo alternativo no Ollama

```bash
# .env
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

### Cenário 3: Diferentes modelos por provedor

```bash
# .env
OPENAI_EMBEDDING_MODEL=text-embedding-3-large
OPENROUTER_EMBEDDING_MODEL=text-embedding-3-small
OLLAMA_EMBEDDING_MODEL=granite-embedding:278m
```

### Cenário 4: Anthropic com embeddings via OpenAI

```bash
# .env
PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-opus-20240229
ANTHROPIC_EMBEDDING_MODEL=openai

OPENAI_API_KEY=sk-...
OPENAI_EMBEDDING_MODEL=text-embedding-3-large
```

### Cenário 5: Perplexity com embeddings via Ollama (local)

```bash
# .env
PROVIDER=perplexity
PERPLEXITY_API_KEY=pplx-...
PERPLEXITY_MODEL=pplx-70b-online
PERPLEXITY_EMBEDDING_MODEL=ollama

OLLAMA_URL=http://localhost:11434
OLLAMA_EMBEDDING_MODEL=granite-embedding:278m
```

## Verificação

Para verificar qual modelo está sendo usado, você pode:

1. Verificar os logs do servidor ao iniciar
2. Usar o endpoint `/api/provider/info` (se disponível)
3. Verificar a propriedade `embeddingModel` no objeto da engine

## Compatibilidade

Esta funcionalidade é **retrocompatível**:
- Se você não configurar `embeddingModel`, o sistema continua funcionando com os valores padrão
- Não é necessário atualizar configurações existentes
- O fallback automático garante que nada quebre

## Troubleshooting

### Erro: "Modelo de embedding não encontrado"

**Causa**: O modelo configurado não existe ou não está disponível.

**Solução para Ollama**:
```bash
ollama pull nome-do-modelo
```

**Solução para OpenAI/OpenRouter**:
- Verifique se o nome do modelo está correto
- Confirme que sua API key tem acesso ao modelo

### Embeddings não estão funcionando

1. Verifique se `supportsEmbeddings: true` na configuração do provedor
2. Confirme que o modelo de embeddings está disponível
3. Verifique os logs do servidor para mensagens de erro

## Referências

- [Documentação completa de Embeddings](./EMBEDDINGS.md)
- [Modelos OpenAI](https://platform.openai.com/docs/guides/embeddings)
- [Modelos Ollama](https://ollama.ai/library)
