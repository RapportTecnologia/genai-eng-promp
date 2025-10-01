# Multi-stage build para otimização

# Stage 1: Build do Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copia package files do frontend
COPY frontend/package*.json ./

# Instala dependências
RUN npm ci --only=production

# Copia código fonte do frontend
COPY frontend/ ./

# Build do frontend
RUN npm run build

# Stage 2: Backend
FROM node:20-alpine

WORKDIR /app

# Instala dependências do sistema (se necessário)
RUN apk add --no-cache tini

# Copia package files do backend
COPY backend/package*.json ./

# Instala dependências do backend
RUN npm ci --only=production

# Copia código fonte do backend
COPY backend/ ./

# Copia frontend buildado do stage anterior
COPY --from=frontend-builder /app/frontend/dist ./public

# Cria diretório para configurações
RUN mkdir -p /etc/rapport/genai-eng-prompt

# Expõe porta (frontend buildado será servido nesta porta)
EXPOSE 3010

# Usa tini para gerenciar processos
ENTRYPOINT ["/sbin/tini", "--"]

# Comando para iniciar o servidor
CMD ["node", "server.js"]
