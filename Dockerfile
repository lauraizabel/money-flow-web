# Multi-stage build para otimizar o tamanho da imagem
FROM node:18-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Stage de desenvolvimento
FROM node:18-alpine AS dev
WORKDIR /app

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo dev)
RUN npm ci

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 8080

# Comando para desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Stage de build
FROM node:18-alpine AS builder
WORKDIR /app

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage de produção
FROM nginx:alpine AS production

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando para produção
CMD ["nginx", "-g", "daemon off;"]
