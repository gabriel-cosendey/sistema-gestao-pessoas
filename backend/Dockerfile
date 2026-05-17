FROM node:20-bullseye-slim

WORKDIR /app

ENV NODE_ENV=production

# Instalar ferramentas de build necessárias para compilar módulos nativos
RUN apt-get update && apt-get install -y python3 make g++ --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Copiar manifestos e instalar dependências compilando módulos nativos no build
COPY package*.json ./
# Use `npm install` to avoid failing when package-lock.json is out of sync in the build context
RUN npm install --build-from-source

# Copiar o restante do código e construir
COPY . .
RUN npm run build

# Executar a aplicação
CMD ["npm", "start"]
