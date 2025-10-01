# Modelos Indicados para GenAI-Eng-Prompt

Este documento lista os modelos de IA recomendados para uso com o sistema GenAI-Eng-Prompt, organizados por provedor e caso de uso. Cada modelo inclui o **nome para uso na API REST**.

---

## 📋 Índice

- [Modelos Premium (Máxima Qualidade)](#modelos-premium-máxima-qualidade)
- [Modelos Custo-Benefício](#modelos-custo-benefício)
- [Modelos Open Source (Auto-hospedados)](#modelos-open-source-auto-hospedados)
- [Configuração por Provedor](#configuração-por-provedor)
- [Recomendações por Caso de Uso](#recomendações-por-caso-de-uso)

---

## Modelos Premium (Máxima Qualidade)

### 🥇 Gemini 1.5 Pro (Google)

**Nome da API**: `gemini-1.5-pro` ou `google/gemini-pro-1.5` (via OpenRouter)

**Pontos Fortes**: 
- Janela de contexto gigantesca (1 milhão de tokens)
- Permite analisar prompts muito longos e fornecer muitos exemplos
- Excelente capacidade de raciocínio e seguir instruções multifacetadas
- Entende contextos complexos sem perder informação

**Ideal para**: 
- Otimizações complexas com análise de documentos extensos
- Exemplos longos ou múltiplos prompts variantes
- Geração baseada em grande conjunto de regras

**Contexto**: 1M tokens | **Custo**: $$$ | **Provedor**: Google AI / OpenRouter

---

### 🥇 GPT-4 Turbo / GPT-4o (OpenAI)

**Nome da API**: `gpt-4-turbo-preview`, `gpt-4o`, `gpt-4`

**Pontos Fortes**: 
- Padrão da indústria com raciocínio lógico extremamente forte
- Excelente em seguir instruções precisas
- Capacidade de "pensar passo a passo" para decompor problemas
- Muito confiável e previsível

**Ideal para**: 
- Maioria dos casos de uso
- Reescrever prompts e adicionar clareza
- Sugerir formatação e incorporar técnicas como Chain of Thought
- Análise e correção de prompts ruins

**Contexto**: 128k tokens (Turbo) | **Custo**: $$$ | **Provedor**: OpenAI

---

### 🥇 Claude 3 Opus (Anthropic)

**Nome da API**: `claude-3-opus-20240229` ou `anthropic/claude-3-opus` (via OpenRouter)

**Pontos Fortes**: 
- Texto mais "natural" e menos robótico
- Excelente em tarefas de escrita criativa
- Captura nuances sutis de tom e estilo
- Forte em contextos que exigem empatia e personalidade

**Ideal para**: 
- Otimizar prompts para escrita criativa e copywriting
- Geração de diálogos e narrativas
- Situações onde o "sentimento" ou "personalidade" é importante
- Refinar tom e estilo específicos

**Contexto**: 200k tokens | **Custo**: $$$ | **Provedor**: Anthropic

---

## Modelos Custo-Benefício

### 🥈 Claude 3 Sonnet (Anthropic)

**Nome da API**: `claude-3-sonnet-20240229` ou `anthropic/claude-3-sonnet` (via OpenRouter)

**Pontos Fortes**: 
- Ótimo equilíbrio entre custo e desempenho
- Significativamente mais barato que o Opus
- Mantém capacidade de raciocínio muito alta
- Superior a muitos outros modelos no mercado

**Ideal para**: 
- Uso geral com orçamento limitado
- Produção em alto volume
- Prototipagem e iteração rápida

**Contexto**: 200k tokens | **Custo**: $$ | **Provedor**: Anthropic

---

### 🥈 GPT-3.5 Turbo (OpenAI)

**Nome da API**: `gpt-3.5-turbo`, `gpt-3.5-turbo-16k`

**Pontos Fortes**: 
- Muito rápido e econômico
- Boa qualidade para tarefas simples
- Amplamente testado e confiável

**Ideal para**: 
- Tarefas simples de otimização
- Prototipagem rápida
- Alto volume com orçamento limitado

**Contexto**: 16k tokens | **Custo**: $ | **Provedor**: OpenAI

---

## Modelos Open Source (Auto-hospedados)

### 🏆 Llama 3.1 70B Instruct (Meta)

**Nome da API**: `llama3.1:70b` (Ollama) ou `meta-llama/llama-3.1-70b-instruct` (OpenRouter)

**Pontos Fortes**: 
- Melhor modelo open source disponível
- Desempenho próximo aos modelos de ponta
- Controle total sobre infraestrutura
- Sem custos de API por uso

**Ideal para**: 
- Ambientes on-premise ou com requisitos de privacidade
- Alto volume sem custos recorrentes
- Customização e fine-tuning

**Contexto**: 128k tokens | **Custo**: Gratuito (requer GPU) | **Provedor**: Meta (via Ollama)

**Requisitos**: GPU com 40GB+ VRAM (ou quantização)

---

### 🏆 Mixtral 8x7B (Mistral AI)

**Nome da API**: `mixtral:8x7b` (Ollama) ou `mistralai/mixtral-8x7b-instruct` (OpenRouter)

**Pontos Fortes**: 
- Arquitetura MoE (Mixture of Experts) eficiente
- Forte desempenho em vários benchmarks
- Menor requisito de hardware que Llama 70B
- Excelente custo-benefício

**Ideal para**: 
- Ambientes com GPU limitada
- Boa qualidade sem alto custo
- Versatilidade em múltiplas tarefas

**Contexto**: 32k tokens | **Custo**: Gratuito (requer GPU) | **Provedor**: Mistral AI (via Ollama)

**Requisitos**: GPU com 24GB+ VRAM

---

### 🏆 Granite 3.3 8B (IBM)

**Nome da API**: `granite3.3:8b` (Ollama)

**Pontos Fortes**: 
- Otimizado para código e desenvolvimento
- Menor requisito de hardware
- Excelente para análise técnica
- Desenvolvido pela IBM

**Ideal para**: 
- Otimização de prompts técnicos
- Análise de código e documentação
- Ambientes com GPU modesta

**Contexto**: 8k tokens | **Custo**: Gratuito (requer GPU) | **Provedor**: IBM (via Ollama)

**Requisitos**: GPU com 8GB+ VRAM

---

## Configuração por Provedor

### OpenAI

```bash
PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_EMBEDDING_MODEL=text-embedding-3-large
```

**Modelos disponíveis**: `gpt-4-turbo-preview`, `gpt-4o`, `gpt-4`, `gpt-3.5-turbo`

---

### Anthropic

```bash
PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-opus-20240229
ANTHROPIC_EMBEDDING_MODEL=openai
```

**Modelos disponíveis**: `claude-3-opus-20240229`, `claude-3-sonnet-20240229`, `claude-3-haiku-20240307`

---

### Ollama (Local)

```bash
PROVIDER=ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=granite3.3:8b
OLLAMA_EMBEDDING_MODEL=granite-embedding:278m
```

**Modelos disponíveis**: `llama3.1:70b`, `mixtral:8x7b`, `granite3.3:8b`, `mistral:7b`, `codellama:13b`

**Instalação**:
```bash
ollama pull llama3.1:70b
ollama pull mixtral:8x7b
ollama pull granite3.3:8b
ollama pull granite-embedding:278m
```

---

### OpenRouter (Acesso Unificado)

```bash
PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=anthropic/claude-3-opus
OPENROUTER_EMBEDDING_MODEL=text-embedding-3-small
```

**Modelos disponíveis**: 
- `openai/gpt-4-turbo`
- `anthropic/claude-3-opus`
- `google/gemini-pro-1.5`
- `meta-llama/llama-3.1-70b-instruct`
- `mistralai/mixtral-8x7b-instruct`

---

### Perplexity (Com Busca Web)

```bash
PROVIDER=perplexity
PERPLEXITY_API_KEY=pplx-...
PERPLEXITY_BASE_URL=https://api.perplexity.ai
PERPLEXITY_MODEL=pplx-70b-online
PERPLEXITY_EMBEDDING_MODEL=ollama
```

**Modelos disponíveis**: `pplx-70b-online`, `pplx-7b-online` (com acesso à internet)

---

### GenerAtiva (Rapport)

```bash
PROVIDER=generativa
GENERATIVA_API_KEY=sk-...
GENERATIVA_BASE_URL=https://generativa.rapport.tec.br/v1
GENERATIVA_MODEL=gpt-4
GENERATIVA_EMBEDDING_MODEL=granite-embedding:278m
```

---

## Recomendações por Caso de Uso

### 🎯 Engenharia de Prompts Complexa
**Recomendado**: Gemini 1.5 Pro ou GPT-4 Turbo
- **API**: `gemini-1.5-pro` ou `gpt-4-turbo-preview`
- **Motivo**: Contexto extenso e raciocínio superior

### ✍️ Escrita Criativa e Copywriting
**Recomendado**: Claude 3 Opus
- **API**: `claude-3-opus-20240229`
- **Motivo**: Texto natural e captura de nuances

### 💻 Desenvolvimento e Código
**Recomendado**: Granite 3.3 8B ou CodeLlama
- **API**: `granite3.3:8b` ou `codellama:13b`
- **Motivo**: Otimizado para análise técnica

### 💰 Melhor Custo-Benefício
**Recomendado**: Claude 3 Sonnet ou GPT-3.5 Turbo
- **API**: `claude-3-sonnet-20240229` ou `gpt-3.5-turbo`
- **Motivo**: Balanço entre qualidade e custo

### 🏠 Auto-hospedado (Privacidade)
**Recomendado**: Llama 3.1 70B ou Mixtral 8x7B
- **API**: `llama3.1:70b` ou `mixtral:8x7b`
- **Motivo**: Controle total e sem custos recorrentes

### 🔍 Pesquisa em Tempo Real
**Recomendado**: Perplexity 70B Online
- **API**: `pplx-70b-online`
- **Motivo**: Acesso à internet integrado

### ⚡ Prototipagem Rápida
**Recomendado**: GPT-3.5 Turbo ou Granite 3.3
- **API**: `gpt-3.5-turbo` ou `granite3.3:8b`
- **Motivo**: Velocidade e baixo custo

---

## 📊 Comparação Rápida

| Modelo | API | Contexto | Custo | Qualidade | Velocidade |
|--------|-----|----------|-------|-----------|------------|
| Gemini 1.5 Pro | `gemini-1.5-pro` | 1M | $$$ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| GPT-4 Turbo | `gpt-4-turbo-preview` | 128k | $$$ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Claude 3 Opus | `claude-3-opus-20240229` | 200k | $$$ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Claude 3 Sonnet | `claude-3-sonnet-20240229` | 200k | $$ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| GPT-3.5 Turbo | `gpt-3.5-turbo` | 16k | $ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Llama 3.1 70B | `llama3.1:70b` | 128k | Grátis* | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Mixtral 8x7B | `mixtral:8x7b` | 32k | Grátis* | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Granite 3.3 8B | `granite3.3:8b` | 8k | Grátis* | ⭐⭐⭐ | ⭐⭐⭐⭐ |

*Grátis = Requer infraestrutura própria (GPU)

---

## 🔗 Links Úteis

- [OpenAI Models](https://platform.openai.com/docs/models)
- [Anthropic Models](https://docs.anthropic.com/claude/docs/models-overview)
- [Ollama Library](https://ollama.ai/library)
- [OpenRouter Models](https://openrouter.ai/models)
- [Google AI Models](https://ai.google.dev/models)
- [Perplexity API](https://docs.perplexity.ai/)

---

**Última atualização**: 2025-10-01