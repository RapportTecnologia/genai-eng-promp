#!/bin/bash

# Script de setup inicial do projeto GenAI Eng Prompt

set -e

echo "═══════════════════════════════════════════════════════"
echo "  GenAI Eng Prompt - Setup"
echo "═══════════════════════════════════════════════════════"
echo ""

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js >= 18"
    exit 1
fi

echo "✓ Node.js $(node --version) encontrado"
echo ""

# Cria .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "✓ Arquivo .env criado"
    echo ""
    echo "⚠️  IMPORTANTE: Edite o arquivo .env e adicione suas API keys!"
    echo ""
else
    echo "✓ Arquivo .env já existe"
    echo ""
fi

# Instala dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
npm install
cd ..
echo "✓ Backend pronto"
echo ""

# Instala dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
cd ..
echo "✓ Frontend pronto"
echo ""

echo "═══════════════════════════════════════════════════════"
echo "  ✅ Setup concluído com sucesso!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "Próximos passos:"
echo ""
echo "1. Edite o arquivo .env com suas API keys:"
echo "   nano .env"
echo ""
echo "2. Inicie o backend (em um terminal):"
echo "   cd backend && npm run dev"
echo ""
echo "3. Inicie o frontend (em outro terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Acesse: http://localhost:5173"
echo ""
echo "Ou use Docker:"
echo "   docker-compose up -d"
echo ""
