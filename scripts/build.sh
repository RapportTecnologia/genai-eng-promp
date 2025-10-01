#!/bin/bash

# Script para build de produção

set -e

echo "═══════════════════════════════════════════════════════"
echo "  GenAI Eng Prompt - Build de Produção"
echo "═══════════════════════════════════════════════════════"
echo ""

# Verifica se as dependências estão instaladas
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Dependências do frontend não instaladas!"
    echo "Execute: ./scripts/setup.sh"
    exit 1
fi

echo "🔨 Fazendo build do frontend..."
cd frontend
npm run build
echo "✓ Build concluído"
echo ""

echo "📦 Copiando arquivos para backend/public..."
npm run copy-to-backend
echo "✓ Arquivos copiados"
echo ""

cd ..

echo "═══════════════════════════════════════════════════════"
echo "  ✅ Build concluído com sucesso!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Para iniciar em produção:"
echo "  cd backend && npm start"
echo ""
echo "Acesse: http://localhost:3010"
echo ""
