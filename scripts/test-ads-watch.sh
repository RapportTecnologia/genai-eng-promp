#!/bin/bash

# Script de teste para verificar o monitoramento automático de ads.conf
# Este script cria um arquivo de teste e simula modificações

echo "==================================="
echo "Teste de Monitoramento de ads.conf"
echo "==================================="
echo ""

# Define o caminho do arquivo
ADS_PATH="${ADS_CONFIG_PATH:-/etc/rapport/genai-eng-prompt/ads.conf}"
TEST_DIR="/tmp/genai-eng-prompt-test"
TEST_ADS="$TEST_DIR/ads.conf"

echo "1. Criando diretório de teste: $TEST_DIR"
mkdir -p "$TEST_DIR"

echo "2. Criando arquivo ads.conf de teste: $TEST_ADS"
cat > "$TEST_ADS" << 'EOF'
[
  {
    "titulo": "Propaganda Teste 1",
    "link": "https://exemplo.com/1",
    "imagePath": "https://via.placeholder.com/300x150/FF8C42/FFFFFF?text=Teste+1"
  },
  {
    "titulo": "Propaganda Teste 2",
    "link": "https://exemplo.com/2",
    "imagePath": "https://via.placeholder.com/300x150/FFA500/FFFFFF?text=Teste+2"
  }
]
EOF

echo "3. Iniciando servidor com ADS_CONFIG_PATH=$TEST_ADS"
echo ""
echo "   Execute em outro terminal:"
echo "   export ADS_CONFIG_PATH=$TEST_ADS"
echo "   cd backend && npm start"
echo ""
echo "4. Para testar o monitoramento, modifique o arquivo:"
echo "   nano $TEST_ADS"
echo ""
echo "5. Ou adicione uma nova propaganda automaticamente:"
read -p "   Pressione ENTER para adicionar uma nova propaganda ao arquivo..."

# Adiciona uma nova propaganda
cat > "$TEST_ADS" << 'EOF'
[
  {
    "titulo": "Propaganda Teste 1",
    "link": "https://exemplo.com/1",
    "imagePath": "https://via.placeholder.com/300x150/FF8C42/FFFFFF?text=Teste+1"
  },
  {
    "titulo": "Propaganda Teste 2",
    "link": "https://exemplo.com/2",
    "imagePath": "https://via.placeholder.com/300x150/FFA500/FFFFFF?text=Teste+2"
  },
  {
    "titulo": "Propaganda NOVA - Adicionada Automaticamente",
    "link": "https://exemplo.com/nova",
    "imagePath": "https://via.placeholder.com/300x150/00FF00/FFFFFF?text=NOVA"
  }
]
EOF

echo ""
echo "✓ Arquivo atualizado! Verifique os logs do servidor."
echo ""
echo "6. Para testar via API:"
echo "   curl http://localhost:3010/api/ads"
echo "   curl http://localhost:3010/api/ads/stats"
echo ""
echo "7. Para limpar o teste:"
echo "   rm -rf $TEST_DIR"
