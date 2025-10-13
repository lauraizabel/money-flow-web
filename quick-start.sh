#!/bin/bash

# Quick Start Script para Money Flow Web
echo "🚀 Money Flow Web - Quick Start"
echo "==============================="

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados!"

# Perguntar qual ambiente executar
echo ""
echo "Escolha o ambiente:"
echo "1) Desenvolvimento (porta 8080)"
echo "2) Produção (porta 3000)"
echo "3) Build apenas"
echo ""
read -p "Digite sua escolha (1-3): " choice

case $choice in
    1)
        echo "🔧 Iniciando ambiente de desenvolvimento..."
        echo "📱 Acesse: http://localhost:8080"
        echo "🛑 Para parar: Ctrl+C"
        echo ""
        docker-compose --profile dev up --build
        ;;
    2)
        echo "🏭 Iniciando ambiente de produção..."
        echo "📱 Acesse: http://localhost:3000"
        echo "🛑 Para parar: Ctrl+C"
        echo ""
        docker-compose --profile prod up --build
        ;;
    3)
        echo "📦 Fazendo build da aplicação..."
        docker-compose --profile build up --build
        echo "✅ Build concluído! Arquivos em ./dist/"
        ;;
    *)
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac
