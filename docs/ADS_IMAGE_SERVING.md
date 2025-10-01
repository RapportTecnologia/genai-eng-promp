# Sistema de Servir Imagens para Propagandas

## Visão Geral

O sistema de propagandas suporta dois tipos de imagens:
1. **URLs externas**: Imagens hospedadas em outros servidores
2. **Arquivos locais**: Imagens armazenadas no servidor da aplicação

## Como Funciona

### URLs Externas

URLs externas são usadas diretamente sem processamento:

```json
{
  "titulo": "Minha Propaganda",
  "link": "https://exemplo.com",
  "imagePath": "https://exemplo.com/imagem.png"
}
```

**Vantagens**:
- Sem processamento adicional
- Não consome recursos do servidor
- Fácil de usar CDNs

**Desvantagens**:
- Dependência de servidores externos
- Possível lentidão se o servidor externo for lento
- Sem controle sobre disponibilidade

### Arquivos Locais

Arquivos locais são processados e servidos através do servidor Express:

```json
{
  "titulo": "Minha Propaganda",
  "link": "https://exemplo.com",
  "imagePath": "/var/www/images/banner.png"
}
```

**Processamento**:

1. **Validação**: Sistema verifica se o arquivo existe
2. **Hash**: Gera hash MD5 do caminho completo
3. **Mapeamento**: Cria entrada no mapa interno `hash → caminho`
4. **Transformação**: Substitui o path por URL do servidor

**Resultado na API**:
```json
{
  "titulo": "Minha Propaganda",
  "link": "https://exemplo.com",
  "imagePath": "/api/ads/images/5d41402abc4b2a76b9719d911017c592",
  "imagePathOriginal": "/var/www/images/banner.png"
}
```

**Vantagens**:
- Controle total sobre as imagens
- Cache otimizado (1 dia)
- Sem dependência externa
- Segurança (paths não expostos)

**Desvantagens**:
- Consome recursos do servidor
- Requer armazenamento local

## Segurança

### Proteção de Paths

Os caminhos reais dos arquivos **nunca são expostos** na API. O sistema usa hashes MD5 para:
- Ocultar a estrutura de diretórios
- Prevenir acesso direto a arquivos
- Dificultar enumeração de arquivos

### Validação

Apenas arquivos explicitamente configurados em `ads.conf` podem ser acessados:
- Não é possível acessar arquivos arbitrários
- Tentativas de path traversal são bloqueadas
- Apenas hashes válidos retornam arquivos

## Performance

### Cache

Imagens locais são servidas com headers de cache:

```http
Cache-Control: public, max-age=86400
```

Isso significa:
- **1 dia de cache** no navegador
- Redução de requisições ao servidor
- Melhor experiência do usuário

### Otimização

Para melhor performance:

1. **Use formatos modernos**: WebP, AVIF quando possível
2. **Comprima as imagens**: Reduza o tamanho sem perder qualidade
3. **Dimensione corretamente**: Não use imagens maiores que o necessário
4. **Use CDN para URLs externas**: Quando possível

## Exemplos de Uso

### Exemplo 1: Mix de URLs e Arquivos Locais

```json
[
  {
    "titulo": "Produto Externo",
    "link": "https://exemplo.com/produto",
    "imagePath": "https://cdn.exemplo.com/produto.jpg"
  },
  {
    "titulo": "Produto Interno",
    "link": "https://exemplo.com/interno",
    "imagePath": "/var/www/images/interno.png"
  }
]
```

### Exemplo 2: Caminhos Relativos

```json
{
  "titulo": "Logo da Empresa",
  "link": "https://exemplo.com",
  "imagePath": "public/images/logo.png"
}
```

O caminho relativo será resolvido a partir do diretório de trabalho do processo Node.js.

### Exemplo 3: Estrutura Organizada

```
/var/www/ads-images/
├── banners/
│   ├── produto-a.png
│   ├── produto-b.png
│   └── promocao.jpg
└── logos/
    ├── parceiro-1.png
    └── parceiro-2.png
```

```json
[
  {
    "titulo": "Produto A",
    "link": "https://exemplo.com/a",
    "imagePath": "/var/www/ads-images/banners/produto-a.png"
  },
  {
    "titulo": "Parceiro 1",
    "link": "https://parceiro1.com",
    "imagePath": "/var/www/ads-images/logos/parceiro-1.png"
  }
]
```

## Troubleshooting

### Imagem não aparece

**Problema**: A propaganda não é exibida ou retorna 404

**Verificações**:

1. Confirme que o arquivo existe:
   ```bash
   ls -la /caminho/para/imagem.png
   ```

2. Verifique permissões de leitura:
   ```bash
   chmod 644 /caminho/para/imagem.png
   ```

3. Verifique se o processo Node.js tem acesso:
   ```bash
   sudo -u node-user cat /caminho/para/imagem.png
   ```

4. Consulte os logs do servidor:
   ```bash
   tail -f /var/log/genai-eng-prompt.log
   ```

### Hash não encontrado

**Problema**: Erro 404 ao acessar `/api/ads/images/:hash`

**Causas possíveis**:
- Arquivo foi movido ou deletado após o carregamento
- Servidor foi reiniciado e o hash mudou
- Path estava incorreto no `ads.conf`

**Solução**:
```bash
# Recarregue as propagandas
curl -X POST http://localhost:3010/api/ads/reload

# Verifique as estatísticas
curl http://localhost:3010/api/ads/stats
```

### Performance lenta

**Problema**: Imagens demoram para carregar

**Soluções**:

1. **Comprima as imagens**:
   ```bash
   # Para PNG
   optipng -o7 imagem.png
   
   # Para JPG
   jpegoptim --max=85 imagem.jpg
   
   # Converter para WebP
   cwebp -q 80 imagem.png -o imagem.webp
   ```

2. **Verifique o tamanho**:
   ```bash
   du -h /var/www/ads-images/*
   ```

3. **Use CDN**: Considere mover para um CDN se houver muitas requisições

## Boas Práticas

### 1. Organização de Arquivos

```
/var/www/ads-images/
├── 2025/
│   ├── 01/
│   └── 02/
└── permanent/
    └── logos/
```

### 2. Nomenclatura

Use nomes descritivos:
- ✅ `produto-xyz-banner-300x150.png`
- ❌ `img1.png`

### 3. Versionamento

Inclua versão no nome para forçar atualização de cache:
```json
{
  "imagePath": "/var/www/images/banner-v2.png"
}
```

### 4. Backup

Mantenha backup das imagens:
```bash
rsync -av /var/www/ads-images/ /backup/ads-images/
```

### 5. Monitoramento

Monitore o uso de disco:
```bash
df -h /var/www/ads-images
```

## Migração

### De URLs para Arquivos Locais

1. Baixe as imagens:
   ```bash
   wget -P /var/www/ads-images/ https://exemplo.com/imagem.png
   ```

2. Atualize o `ads.conf`:
   ```json
   {
     "imagePath": "/var/www/ads-images/imagem.png"
   }
   ```

3. Recarregue:
   ```bash
   curl -X POST http://localhost:3010/api/ads/reload
   ```

### De Arquivos Locais para CDN

1. Faça upload para o CDN
2. Atualize o `ads.conf` com as URLs do CDN
3. Recarregue as propagandas
4. Após confirmar funcionamento, remova os arquivos locais

## Referências

- [Express sendFile](https://expressjs.com/en/api.html#res.sendFile)
- [HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Image Optimization](https://web.dev/fast/#optimize-your-images)
