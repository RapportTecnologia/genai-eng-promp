# Configuração do Google Analytics

## Resumo das Alterações

O Google Analytics foi implementado usando um **plugin Vite customizado** que injeta o script diretamente no HTML durante o build, garantindo que o código esteja presente desde o carregamento inicial da página.

## Arquivos Modificados/Criados

### 1. **Plugin Vite** (`frontend/vite-plugin-gtag.js`)
- Plugin customizado que injeta o script do Google Analytics no `<head>` do HTML
- Lê o `VITE_GTAG_ID` das variáveis de ambiente
- Injeta o código exatamente como recomendado pelo Google

### 2. **Configuração Vite** (`frontend/vite.config.js`)
- Importa e registra o plugin `vitePluginGtag()`

### 3. **HTML Base** (`frontend/index.html`)
- Removido comentário sobre carregamento dinâmico
- O script será injetado automaticamente durante o build

### 4. **Main.jsx** (`frontend/src/main.jsx`)
- Removida inicialização dinâmica do Google Analytics
- Simplificado para apenas renderizar o React

### 5. **Arquivo de Ambiente** (`frontend/.env.example`)
- Documentação da variável `VITE_GTAG_ID`

### 6. **README.md**
- Adicionada seção completa sobre Google Analytics
- Instruções de configuração

## Como Funciona

### Durante o Build

1. O Vite lê a variável `VITE_GTAG_ID` do arquivo `.env`
2. O plugin `vitePluginGtag` injeta o script no HTML:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-S14KGKQY3L"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-S14KGKQY3L');
</script>
```

3. O HTML final já contém o script do Google Analytics

### Vantagens desta Abordagem

✅ **Script presente desde o início**: O Google Analytics é carregado imediatamente, antes do React  
✅ **Validação do Google**: O script está no formato exato recomendado pelo Google  
✅ **Sem dependências extras**: Não precisa de bibliotecas de terceiros  
✅ **Build-time injection**: Mais rápido que injeção dinâmica em runtime  
✅ **SEO-friendly**: Crawlers conseguem ver o script no HTML estático  

## Configuração Passo a Passo

### 1. Configure a Variável de Ambiente

Crie ou edite o arquivo `frontend/.env`:

```bash
cd frontend
echo "VITE_GTAG_ID=G-S14KGKQY3L" > .env
```

### 2. Faça o Build

```bash
npm run build:prod
```

Você verá a mensagem:
```
✓ Google Analytics será injetado: G-S14KGKQY3L
```

### 3. Verifique o HTML Gerado

```bash
cat backend/public/index.html
```

O script do Google Analytics deve estar presente no `<head>`.

### 4. Inicie o Servidor

```bash
cd backend
npm start
```

### 5. Teste no Navegador

1. Abra http://localhost:3010
2. Abra o DevTools (F12)
3. Vá para a aba **Network**
4. Procure por requisições para `googletagmanager.com`
5. Ou use a extensão **Google Analytics Debugger**

## Verificação

### No Código Fonte da Página

Clique com botão direito → "Ver código-fonte" e procure por:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-S14KGKQY3L"></script>
```

### No Console do Navegador

Digite no console:

```javascript
window.gtag
// Deve retornar: ƒ gtag(){dataLayer.push(arguments);}

window.dataLayer
// Deve retornar um array com eventos
```

### No Google Analytics

1. Acesse o Google Analytics
2. Vá para **Tempo Real** → **Visão Geral**
3. Navegue no site
4. Você deve ver as visitas em tempo real

## Troubleshooting

### ⚠️ "GTAG_ID não configurado"

**Problema**: A variável `VITE_GTAG_ID` não está definida.

**Solução**: 
```bash
cd frontend
echo "VITE_GTAG_ID=G-S14KGKQY3L" > .env
npm run build:prod
```

### ⚠️ Script não aparece no HTML

**Problema**: O build foi feito sem a variável configurada.

**Solução**: Configure a variável e refaça o build.

### ⚠️ Google Analytics não valida

**Problema**: O script pode estar sendo bloqueado por adblockers.

**Solução**: 
- Desative adblockers temporariamente
- Teste em modo anônimo
- Verifique se o domínio está correto no Google Analytics

## Arquivos que Podem Ser Removidos (Opcional)

Como não estamos mais usando injeção dinâmica, estes arquivos podem ser removidos:

- `frontend/src/utils/analytics.js` (se não estiver sendo usado para tracking de eventos)
- Rota `/api/config` no backend (se só era usada para passar o gtagId)

**Nota**: Mantenha `analytics.js` se você quiser usar as funções `trackEvent()` e `trackPageView()` para rastreamento customizado.

## Rastreamento de Eventos Customizados (Opcional)

Se quiser rastrear eventos específicos, você pode usar o `window.gtag` diretamente:

```javascript
// Em qualquer componente React
const handleOptimize = () => {
  // Seu código...
  
  // Rastreia evento
  if (window.gtag) {
    window.gtag('event', 'optimize_prompt', {
      event_category: 'engagement',
      event_label: 'prompt_optimization'
    });
  }
};
```

Ou importar as funções do `analytics.js`:

```javascript
import { trackEvent } from './utils/analytics';

trackEvent('optimize_prompt', {
  event_category: 'engagement',
  event_label: 'prompt_optimization'
});
```

## Conclusão

A implementação atual garante que o Google Analytics seja carregado corretamente e validado pelo Google, pois o script está presente no HTML desde o início, exatamente como recomendado pela documentação oficial.
