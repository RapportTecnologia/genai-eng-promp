#!/bin/bash

# Script para iniciar ambiente de desenvolvimento

set -e

echo "═══════════════════════════════════════════════════════"
echo "  GenAI Eng Prompt - Modo Desenvolvimento"
echo "═══════════════════════════════════════════════════════"
echo ""

# Verifica se .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "Execute: ./scripts/setup.sh"
    exit 1
fi

# Verifica se as dependências estão instaladas
if [ ! -d "backend/node_modules" ]; then
    echo "❌ Dependências do backend não instaladas!"
    echo "Execute: ./scripts/setup.sh"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Dependências do frontend não instaladas!"
    echo "Execute: ./scripts/setup.sh"
    exit 1
fi

echo "🚀 Iniciando servidores de desenvolvimento..."
echo ""
echo "Backend: http://localhost:3010"
echo "Frontend: http://localhost:5173"
echo ""
echo "Pressione Ctrl+C para parar"
echo ""

# Inicia backend e frontend em paralelo
trap 'kill 0' EXIT

cd backend && npm run dev &
cd frontend && npm run dev &

wait
