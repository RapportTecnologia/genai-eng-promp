# Sistema de Monitoramento de Propagandas

## Visão Geral

O serviço de propagandas (`AdsService`) implementa um sistema de monitoramento automático do arquivo `ads.conf`, recarregando as propagandas sempre que o arquivo for modificado, sem necessidade de reiniciar o servidor.

## Como Funciona

### 1. Inicialização

Quando o servidor inicia, o `AdsService`:
1. Carrega as propagandas do arquivo configurado
2. Inicia o monitoramento automático usando `fs.watch()`
3. Exibe mensagem de confirmação no console

```
✓ 5 propagandas carregadas de /etc/rapport/genai-eng-prompt/ads.conf
👁 Monitorando alterações em /etc/rapport/genai-eng-prompt/ads.conf
```

### 2. Detecção de Mudanças

O sistema monitora eventos de modificação no arquivo:
- Detecta quando o arquivo é salvo/modificado
- Aguarda 100ms para garantir que a escrita foi concluída
- Recarrega automaticamente as propagandas
- Exibe mensagem de confirmação

```
📢 Arquivo /etc/rapport/genai-eng-prompt/ads.conf foi modificado. Recarregando propagandas...
✓ 6 propagandas carregadas de /etc/rapport/genai-eng-prompt/ads.conf
✓ Propagandas recarregadas automaticamente
```

### 3. Tratamento de Erros

Se houver erro ao recarregar:
```
✗ Erro ao recarregar propagandas: Unexpected token in JSON at position 45
```

## Configuração

### Variável de Ambiente

O caminho do arquivo pode ser configurado via variável de ambiente:

```bash
export ADS_CONFIG_PATH=/caminho/customizado/ads.conf
```

Padrão: `/etc/rapport/genai-eng-prompt/ads.conf`

### Formato do Arquivo

O arquivo `ads.conf` deve ser um JSON válido:

```json
[
  {
    "titulo": "Título da propaganda",
    "link": "https://exemplo.com",
    "imagePath": "https://exemplo.com/imagem.png"
  }
]
```

#### Validação do Campo `imagePath`

O campo `imagePath` aceita dois formatos:

1. **URL completa** (http:// ou https://):
   ```json
   "imagePath": "https://exemplo.com/imagem.png"
   ```

2. **Caminho de arquivo no servidor** (absoluto ou relativo):
   ```json
   "imagePath": "/var/www/images/banner.png"
   ```
   ou
   ```json
   "imagePath": "public/images/banner.png"
   ```

**Importante**: 
- URLs devem começar com `http://` ou `https://`
- Caminhos de arquivo devem apontar para arquivos existentes no servidor
- Propagandas com `imagePath` inválido serão automaticamente filtradas
- Mensagens de aviso serão exibidas no console para paths inválidos

#### Processamento de Imagens Locais

Quando um `imagePath` é um arquivo local (não é URL):

1. O sistema valida se o arquivo existe no servidor
2. Gera um hash MD5 único para o caminho do arquivo
3. Cria um mapeamento interno: `hash → caminho_do_arquivo`
4. Substitui o `imagePath` por uma URL do servidor: `/api/ads/images/{hash}`
5. O campo original é preservado em `imagePathOriginal`

**Exemplo de transformação**:
```json
// Entrada no ads.conf
{
  "titulo": "Minha Propaganda",
  "link": "https://exemplo.com",
  "imagePath": "/var/www/images/banner.png"
}

// Saída da API
{
  "titulo": "Minha Propaganda",
  "link": "https://exemplo.com",
  "imagePath": "/api/ads/images/5d41402abc4b2a76b9719d911017c592",
  "imagePathOriginal": "/var/www/images/banner.png"
}
```

As imagens locais são servidas através da rota `/api/ads/images/:hash` com:
- Cache de 1 dia (`max-age=86400`)
- Headers apropriados para otimização
- Validação de existência do arquivo

## API Endpoints

### GET /api/ads
Retorna propagandas aleatórias (padrão: 3)

```bash
curl http://localhost:3010/api/ads?count=5
```

### GET /api/ads/all
Retorna todas as propagandas válidas

```bash
curl http://localhost:3010/api/ads/all
```

### GET /api/ads/stats
Retorna estatísticas das propagandas

```bash
curl http://localhost:3010/api/ads/stats
```

Resposta:
```json
{
  "success": true,
  "data": {
    "total": 6,
    "valid": 6,
    "invalid": 0
  }
}
```

### POST /api/ads/reload
Força recarga manual das propagandas

```bash
curl -X POST http://localhost:3010/api/ads/reload
```

### GET /api/ads/images/:hash
Serve imagens locais através do servidor

```bash
curl http://localhost:3010/api/ads/images/5d41402abc4b2a76b9719d911017c592
```

**Características**:
- Retorna o arquivo de imagem diretamente
- Cache de 1 dia para otimização
- Retorna 404 se o hash não for encontrado
- Suporta qualquer formato de imagem (PNG, JPG, WebP, etc.)

## Testando o Monitoramento

### Teste Manual

1. Inicie o servidor:
```bash
cd backend
npm start
```

2. Em outro terminal, edite o arquivo:
```bash
nano /etc/rapport/genai-eng-prompt/ads.conf
```

3. Adicione ou modifique uma propaganda e salve

4. Observe os logs do servidor confirmando o reload automático

### Teste com Script

Execute o script de teste fornecido:

```bash
cd backend
./test-ads-watch.sh
```

O script:
- Cria um arquivo de teste temporário
- Fornece instruções para testar
- Simula modificações no arquivo
- Mostra comandos úteis para verificar

## Desenvolvimento

### Estrutura do Código

```javascript
class AdsService {
  constructor() {
    this.ads = [];
    this.watcher = null;
    this.adsPath = process.env.ADS_CONFIG_PATH || '/etc/rapport/genai-eng-prompt/ads.conf';
    this.loadAds();
    this.startWatching();
  }

  startWatching() {
    this.watcher = fs.watch(this.adsPath, (eventType, filename) => {
      if (eventType === 'change') {
        setTimeout(() => {
          this.loadAds();
        }, 100);
      }
    });
  }

  stopWatching() {
    if (this.watcher) {
      this.watcher.close();
    }
  }
}
```

### Fallback para Desenvolvimento

Se o arquivo configurado não existir, o sistema usa automaticamente:
- `config/ads.example.conf` (arquivo de exemplo)

Isso permite desenvolvimento local sem configurar o arquivo em `/etc/`.

## Boas Práticas

### 1. Validação de JSON

Sempre valide o JSON antes de salvar:
```bash
cat ads.conf | jq .
```

### 2. Backup

Mantenha backup antes de modificar:
```bash
cp /etc/rapport/genai-eng-prompt/ads.conf /etc/rapport/genai-eng-prompt/ads.conf.bak
```

### 3. Permissões

Garanta que o processo Node.js tem permissão de leitura:
```bash
chmod 644 /etc/rapport/genai-eng-prompt/ads.conf
```

### 4. Monitoramento de Logs

Use ferramentas como `tail` para monitorar em tempo real:
```bash
tail -f /var/log/genai-eng-prompt.log
```

## Troubleshooting

### Problema: Monitoramento não inicia

**Causa**: Arquivo não existe no caminho configurado

**Solução**: 
```bash
mkdir -p /etc/rapport/genai-eng-prompt
cp config/ads.example.conf /etc/rapport/genai-eng-prompt/ads.conf
```

### Problema: Mudanças não são detectadas

**Causa**: Alguns editores criam arquivo temporário e renomeiam

**Solução**: Use editores que modificam o arquivo diretamente, ou implemente monitoramento de diretório

### Problema: Erro de JSON inválido

**Causa**: Sintaxe incorreta no arquivo

**Solução**: Valide o JSON:
```bash
cat /etc/rapport/genai-eng-prompt/ads.conf | jq .
```

### Problema: Propaganda não aparece mesmo estando no arquivo

**Causa**: Campo `imagePath` inválido (não é URL nem arquivo existente)

**Sintomas**: 
- Mensagem no console: `Propaganda "Título" possui imagePath inválido: "caminho"`
- Estatísticas mostram propagandas inválidas

**Solução**: 
1. Verifique se é uma URL válida:
   ```bash
   curl -I "https://exemplo.com/imagem.png"
   ```

2. Se for caminho local, verifique se o arquivo existe:
   ```bash
   ls -la /caminho/para/imagem.png
   ```

3. Corrija o `imagePath` no arquivo `ads.conf`

## Limitações

1. **fs.watch()**: Comportamento pode variar entre sistemas operacionais
2. **Delay de 100ms**: Pode não ser suficiente para arquivos muito grandes
3. **Rename operations**: Alguns editores podem não disparar evento 'change'

## Melhorias Futuras

- [ ] Usar `chokidar` para monitoramento mais robusto
- [ ] Implementar debounce configurável
- [ ] Adicionar webhook para notificar mudanças
- [ ] Suportar hot-reload de múltiplos arquivos de configuração
- [ ] Implementar versionamento de configurações
