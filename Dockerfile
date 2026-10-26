# Estágio 1: Build & Dependências
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copia manifestos de dependência
COPY package*.json ./

# Instala todas as dependências (inclusive devDependencies para testes se necessário)
RUN npm ci

# Copia código-fonte
COPY . .

# Remove dependências de desenvolvimento para manter apenas o estritamente necessário
RUN npm prune --production

# -------------------------------------------------------------
# Estágio 2: Imagem Final de Execução (Minimal & Hardened)
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Define ambiente de produção
ENV NODE_ENV=production

# Usuário não-root nativo do Alpine (node:node) para evitar escalada de privilégios
USER node

# Copia apenas as dependências de produção e o código da aplicação
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/src ./src
COPY --chown=node:node --from=builder /usr/src/app/package.json ./package.json

EXPOSE 3000

# Execução do servidor
CMD ["node", "src/server.js"]