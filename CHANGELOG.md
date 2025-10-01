# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Planejado
- Sistema de otimização de prompts com IA
- Sugestões em tempo real durante digitação
- Suporte a múltiplos provedores de IA (OpenAI, Anthropic, Ollama, etc.)
- Sistema de propagandas configurável
- Interface responsiva com React
- API RESTful com Express
- Contador de tokens
- Sistema de cópia para área de transferência
- Containerização com Docker

---

## [0.1.0] - 2025-10-01

### Adicionado
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
[0.1.0]: https://github.com/seu-usuario/genai-eng-prompt/releases/tag/v0.1.0
