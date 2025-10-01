# Configuração de Embeddings

Este documento descreve os modelos de embeddings utilizados por cada provedor de IA no sistema.

## Modelos por Provedor

### OpenAI
- **Modelo**: `text-embedding-3-large`
- **Descrição**: Modelo mais avançado da OpenAI para geração de embeddings
- **Dimensões**: 3072
- **Uso**: Melhor qualidade para buscas semânticas e análise de similaridade

### OpenRouter
- **Modelo**: `text-embedding-3-small`
- **Descrição**: Versão compacta do modelo de embeddings da OpenAI
- **Dimensões**: 1536
- **Uso**: Balanço entre performance e custo

### Ollama
- **Modelo**: `granite-embedding:278m`
- **Descrição**: Modelo IBM Granite otimizado para embeddings locais
- **Parâmetros**: 278 milhões
- **Uso**: Execução local sem necessidade de API externa

### OpenWebUI
- **Modelo**: `granite-embedding:278m`
- **Descrição**: Mesmo modelo usado pelo Ollama
- **Uso**: Compatível com infraestrutura local do OpenWebUI

## Implementação

Os modelos podem ser configurados de duas formas:

### 1. Configuração via variáveis de ambiente (.env)
```bash
OPENAI_EMBEDDING_MODEL=text-embedding-3-large
OPENROUTER_EMBEDDING_MODEL=text-embedding-3-small
OLLAMA_EMBEDDING_MODEL=granite-embedding:278m
OPENWEBUI_EMBEDDING_MODEL=granite-embedding:278m
GENERATIVA_EMBEDDING_MODEL=text-embedding-3-large
```

### 2. Configuração via arquivo JSON (config.json)
```json
{
  "providers": {
    "openai": {
      "embeddingModel": "text-embedding-3-large"
    },
    "openrouter": {
      "embeddingModel": "text-embedding-3-small"
    }
  }
}
```

### Fallback Automático
Se nenhum modelo for configurado, o sistema usa valores padrão baseado no provedor:

```javascript
// OpenAIEngine
if (!embeddingModel) {
  if (baseURL.includes('openrouter')) {
    embeddingModel = 'text-embedding-3-small';
  } else if (baseURL.includes('openwebui')) {
    embeddingModel = 'granite-embedding:278m';
  } else {
    embeddingModel = 'text-embedding-3-large'; // OpenAI padrão
  }
}

// OllamaEngine
const embeddingModel = this.embeddingModel || 'granite-embedding:278m';
```

## Requisitos

### Para usar Granite Embeddings no Ollama:
```bash
ollama pull granite-embedding:278m
```

### Para usar embeddings no OpenRouter:
- Certifique-se de que sua API key tem acesso ao modelo `text-embedding-3-small`
- O modelo é compatível com a API OpenAI

## Casos de Uso

### Busca Semântica
Embeddings permitem encontrar prompts similares baseado no significado, não apenas em palavras-chave.

### Análise de Similaridade
Compare prompts para identificar duplicatas ou variações de um mesmo conceito.

### Recomendações
Sugira prompts relacionados baseado no contexto atual do usuário.

## Performance

| Modelo | Dimensões | Velocidade | Custo | Qualidade |
|--------|-----------|------------|-------|-----------|
| text-embedding-3-large | 3072 | Média | Alto | Excelente |
| text-embedding-3-small | 1536 | Rápida | Médio | Boa |
| granite-embedding:278m | 1024 | Rápida | Grátis | Boa |

## Notas

- Todos os provedores com suporte a embeddings têm `supportsEmbeddings: true` na configuração
- O modelo pode ser configurado manualmente via `.env` ou `config.json`
- Se não configurado, o sistema usa valores padrão inteligentes baseado no provedor
- Para provedores sem suporte a embeddings (Anthropic, Perplexity), a funcionalidade não estará disponível

## Modelos Alternativos

Você pode usar outros modelos de embeddings compatíveis:

### OpenAI / OpenRouter / GenerAtiva
- `text-embedding-3-large` (3072 dimensões) - Melhor qualidade
- `text-embedding-3-small` (1536 dimensões) - Mais rápido e econômico
- `text-embedding-ada-002` (1536 dimensões) - Modelo legado

### Ollama / OpenWebUI
- `granite-embedding:278m` - Recomendado (IBM Granite)
- `nomic-embed-text` - Alternativa popular
- `mxbai-embed-large` - Alta performance
- Qualquer modelo de embedding disponível no Ollama
