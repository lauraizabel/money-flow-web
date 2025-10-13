# 🐳 Money Flow Web - Docker

Este documento explica como executar o projeto Money Flow Web usando Docker.

## 📋 Pré-requisitos

- Docker (versão 20.10+)
- Docker Compose (versão 2.0+)

## 🚀 Como Executar

### Opção 1: Usando o Script (Recomendado)

```bash
# Tornar o script executável (apenas na primeira vez)
chmod +x docker-scripts.sh

# Desenvolvimento
./docker-scripts.sh dev

# Produção
./docker-scripts.sh prod

# Build apenas
./docker-scripts.sh build

# Parar containers
./docker-scripts.sh stop

# Limpar tudo
./docker-scripts.sh clean

# Ver logs
./docker-scripts.sh logs
```

### Opção 2: Usando Docker Compose Diretamente

```bash
# Desenvolvimento
docker-compose --profile dev up --build

# Produção
docker-compose --profile prod up --build

# Build apenas
docker-compose --profile build up --build

# Parar
docker-compose down
```

### Opção 3: Usando Docker Diretamente

```bash
# Desenvolvimento
docker build --target dev -t money-flow-web:dev .
docker run -p 8080:8080 -v $(pwd):/app -v /app/node_modules money-flow-web:dev

# Produção
docker build --target production -t money-flow-web:prod .
docker run -p 3000:80 money-flow-web:prod
```

## 🌐 Acessos

- **Desenvolvimento**: http://localhost:8080
- **Produção**: http://localhost:3000

## 📁 Estrutura de Arquivos Docker

```
money-flow-web/
├── Dockerfile              # Multi-stage Dockerfile
├── docker-compose.yml      # Configuração do Docker Compose
├── nginx.conf              # Configuração do Nginx
├── .dockerignore           # Arquivos ignorados no build
├── docker-scripts.sh       # Script de conveniência
└── DOCKER.md              # Este arquivo
```

## 🔧 Configurações

### Desenvolvimento
- **Porta**: 8080
- **Hot Reload**: ✅ Ativado
- **Volumes**: Código fonte montado para desenvolvimento
- **Comando**: `npm run dev -- --host 0.0.0.0`

### Produção
- **Porta**: 80 (mapeada para 3000 no host)
- **Servidor**: Nginx
- **Build**: Otimizado para produção
- **Cache**: Configurado para assets estáticos

## 🐛 Troubleshooting

### Problema: Porta já em uso
```bash
# Verificar processos usando a porta
lsof -i :8080
lsof -i :3000

# Parar containers
docker-compose down
```

### Problema: Erro de permissão
```bash
# Dar permissão ao script
chmod +x docker-scripts.sh
```

### Problema: Cache do Docker
```bash
# Limpar cache
docker system prune -a
```

### Problema: Node.js muito antigo
O Dockerfile usa Node.js 18, que é compatível com o projeto. Se houver problemas, verifique se o Docker está atualizado.

## 📊 Comandos Úteis

```bash
# Ver containers rodando
docker ps

# Ver logs de um container específico
docker logs <container_id>

# Entrar no container
docker exec -it <container_id> sh

# Ver imagens
docker images

# Remover tudo
docker system prune -a --volumes
```

## 🔄 Workflow de Desenvolvimento

1. **Iniciar desenvolvimento**:
   ```bash
   ./docker-scripts.sh dev
   ```

2. **Fazer alterações** no código (hot reload ativo)

3. **Testar** em http://localhost:8080

4. **Build para produção**:
   ```bash
   ./docker-scripts.sh build
   ```

5. **Testar produção**:
   ```bash
   ./docker-scripts.sh prod
   ```

6. **Parar quando terminar**:
   ```bash
   ./docker-scripts.sh stop
   ```

## 🎯 Vantagens do Docker

- ✅ **Consistência**: Mesmo ambiente em qualquer máquina
- ✅ **Isolamento**: Não interfere com outras aplicações
- ✅ **Facilidade**: Um comando para executar tudo
- ✅ **Produção**: Build otimizado com Nginx
- ✅ **Desenvolvimento**: Hot reload mantido
- ✅ **Portabilidade**: Funciona em qualquer OS com Docker
