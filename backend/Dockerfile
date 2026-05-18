FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Instalar ferramentas de build necessárias para compilar módulos nativos
RUN apt-get update && apt-get install -y python3 make g++ --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copiar arquivos de manifesto e instalar dependências de desenvolvimento
COPY package*.json ./
RUN npm install --include=dev --build-from-source

# Copiar o código e construir
COPY . .
RUN npm run build

FROM node:20-bullseye-slim

WORKDIR /app

# Copiar manifestos e dependências de produção compiladas
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Remover dependências de desenvolvimento e iniciar a aplicação
RUN npm prune --production
CMD ["npm", "start"]
