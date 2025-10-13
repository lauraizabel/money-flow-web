#!/bin/bash

# Script para facilitar o uso do Docker com o projeto Money Flow Web

echo "🚀 Money Flow Web - Docker Scripts"
echo "=================================="

case "$1" in
  "dev")
    echo "🔧 Iniciando ambiente de desenvolvimento..."
    docker-compose --profile dev up --build
    ;;
  "prod")
    echo "🏭 Iniciando ambiente de produção..."
    docker-compose --profile prod up --build
    ;;
  "build")
    echo "📦 Fazendo build da aplicação..."
    docker-compose --profile build up --build
    ;;
  "stop")
    echo "🛑 Parando todos os containers..."
    docker-compose down
    ;;
  "clean")
    echo "🧹 Limpando containers e imagens..."
    docker-compose down --rmi all --volumes --remove-orphans
    ;;
  "logs")
    echo "📋 Mostrando logs..."
    docker-compose logs -f
    ;;
  *)
    echo "Uso: $0 {dev|prod|build|stop|clean|logs}"
    echo ""
    echo "Comandos disponíveis:"
    echo "  dev    - Inicia ambiente de desenvolvimento (porta 8080)"
    echo "  prod   - Inicia ambiente de produção (porta 3000)"
    echo "  build  - Faz apenas o build da aplicação"
    echo "  stop   - Para todos os containers"
    echo "  clean  - Remove containers, imagens e volumes"
    echo "  logs   - Mostra logs dos containers"
    echo ""
    echo "Exemplos:"
    echo "  ./docker-scripts.sh dev"
    echo "  ./docker-scripts.sh prod"
    echo "  ./docker-scripts.sh stop"
    ;;
esac
