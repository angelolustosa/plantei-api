# Módulo 3 — DevOps Inteligente e Integração Contínua
# Disciplina 2 — Gestão de Ambientes Seguros: Containers Otimizados, Paridade e Gestão de Segredos
**Duração estimada:** 9–10 min  
**Projeto:** `plantei-api`  
**Arquivos de referência:** `Dockerfile` · `docker-compose.yml` · `.env.example` · `.dockerignore`  
**Objetivo:** Construir um ambiente de desenvolvimento e produção padronizado, seguro e reproduzível para o `plantei-api` usando Docker multi-stage (usuário non-root), Docker Compose com PostgreSQL persistente, isolamento de segredos e escaneamento de vulnerabilidades em até 10 minutos.

---

## 🎬 ABERTURA (0:00 – 1:00)

**[TELA: Editor VS Code exibindo o terminal com o comando `docker ps` e a árvore de diretórios do `plantei-api`]**

> "Fala devs, sejam muito bem-vindos à **Disciplina 2: Gestão de Ambientes Seguros**!"

> "Quantas vezes você já viu um sistema funcionar perfeitamente na máquina de desenvolvimento e quebrar de forma misteriosa em homologação ou produção? Versões diferentes de Node, bibliotecas do sistema operacional ausentes, ou variáveis de ambiente configuradas na mão são os maiores causadores de incidentes na indústria."

> "Para resolver isso de forma definitiva, nós precisamos de duas coisas: **paridade de ambientes** e **segurança em camadas**."

> "Nesta aula de 10 minutos, nós vamos empacotar o `plantei-api` em um container Docker profissional com multi-stage build, criar um usuário sem privilégios de root, orquestrar nossa infraestrutura com Docker Compose e aprender como blindar credenciais e auditar vulnerabilidades."

---

## 🐳 PARTE 1 — O Dockerfile Multi-Stage e Seguro (1:00 – 3:30)

**[TELA: Abrir o arquivo `Dockerfile` na raiz do projeto com destaque de sintaxe]**

> "Criar um Dockerfile apenas com `FROM node:latest` e `COPY . .` é um risco gravíssimo de segurança e gera imagens gigantescas de mais de 1 GB. Uma imagem de produção profissional precisa ser **enxuta** e **não-root**."

> "Vejam a arquitetura do nosso `Dockerfile` multi-stage:"

```dockerfile
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
```

> "Percebam três detalhes cruciais de segurança aqui:"
> 1. Usamos **Alpine Linux**, reduzindo a superfície de ataque e o tamanho final da imagem para menos de 150 MB.
> 2. O comando `USER node` garante que, caso o container sofra alguma vulnerabilidade de injeção remota, o invasor **não terá privilégios de superusuário (root)** no host.
> 3. No `.dockerignore`, nós bloqueamos `.env`, `node_modules`, `coverage` e `.git`, impedindo que arquivos sensíveis ou lixo entrem na imagem.

---

## ⚙️ PARTE 2 — Orquestrando com Docker Compose e Paridade Dev/Prod (3:30 – 5:45)

**[TELA: Abrir o arquivo `docker-compose.yml` e destacar os serviços `api` e `db`]**

> "Agora que nossa imagem está pronta, como garantimos que qualquer desenvolvedor suba a API com o banco de dados PostgreSQL com um único comando?"

> "Através do **Docker Compose**. Ele define nossa stack completa de forma declarativa:"

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      target: runner
    container_name: plantei-api-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
      - DB_HOST=postgres-db
      - DB_PORT=5432
      - DB_NAME=plantei_db
      - DB_USER=postgres
      - DB_PASS=postgres_secret_123
      - JWT_SECRET=chave_dev_temporaria_super_segura
    depends_on:
      postgres-db:
        condition: service_healthy

  postgres-db:
    image: postgres:15-alpine
    container_name: plantei-postgres
    restart: always
    environment:
      POSTGRES_DB: plantei_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres_secret_123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d plantei_db"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**[TELA: Terminal executando `docker-compose up -d` e vendo os containers subirem saudáveis]**

> "Com o `healthcheck` no banco e `condition: service_healthy`, a API só tenta conectar no PostgreSQL depois que o banco está 100% pronto para aceitar conexões. Acabaram os erros de timeout na inicialização!"

---

## 🔐 PARTE 3 — Gestão Segura de Variáveis e Segredos (5:45 – 7:30)

**[TELA: Abrir lado a lado `.env.example` e slide explicativo de boas práticas de Secrets]**

> "Um dos maiores erros em projetos de software é commitar arquivos `.env` com senhas reais no Git. Uma credencial commitada publicamente é capturada por bots em menos de 2 minutos."

> "Qual é a regra mandatória no `plantei-api`?"
> 1. O arquivo `.env` **nunca** é versionado — ele fica registrado no `.gitignore`.
> 2. Mantemos um arquivo `.env.example` versionado com todas as chaves documentadas, mas com valores fictícios de exemplo:

```bash
# .env.example - Configurações do Ambiente
NODE_ENV=development
PORT=3000

# Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=plantei_db
DB_USER=seu_usuario
DB_PASS=sua_senha_secreta

# Segurança e Autenticação
JWT_SECRET=defina_uma_chave_aleatoria_com_mais_de_32_caracteres
JWT_EXPIRATION=1d
```

> "E em produção? Em produção ou nas pipelines de CI/CD, os segredos são injetados diretamente através de **GitHub Secrets**, AWS Secrets Manager ou HashiCorp Vault. A aplicação lê transparentemente via `process.env`, sem nenhum segredo gravado em disco."

---

## 🛡️ PARTE 4 — Varredura Automatizada de Vulnerabilidades (7:30 – 8:50)

**[TELA: Terminal executando `npm audit` e demonstrando um scan de imagem Docker com Trivy]**

> "Gerenciar ambientes seguros também significa garantir que nenhuma dependência com brecha de segurança conhecida entre no pacote final."

> "No terminal, rodamos regularmente:"

```bash
npm audit --production
```

> "E na pipeline de CI ou localmente, inspecionamos a própria imagem Docker com o scanner de vulnerabilidades **Trivy**:"

```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image plantei-api:latest
```

> "O Trivy vasculha tanto os pacotes do sistema operacional Alpine quanto as bibliotecas do Node.js, emitindo um relatório claro de vulnerabilidades CVE (Common Vulnerabilities and Exposures)."

> "Se surgir uma vulnerabilidade crítica, a esteira falha imediatamente, impedindo que uma imagem comprometida chegue a qualquer ambiente."

---

## 🎯 CONCLUSÃO E PRÓXIMOS PASSOS (8:50 – 10:00)

**[TELA: Professor em destaque com resumo dos 4 pilares de ambientes seguros]**

> "Vejam o salto de maturidade do `plantei-api`: agora nossa aplicação roda em containers imutáveis com multi-stage build, utiliza usuário não-root, sobe com paridade total via Docker Compose e tem uma política rígida de segredos e varredura de vulnerabilidades."

> "Nossa aplicação está segura e pronta para rodar. Mas quando ela estiver no ar recebendo milhares de requisições de clientes, como saberemos se ela está com alta latência, esgotando memória ou falhando em silêncio?"

> "É exatamente isso que responderemos na **Disciplina 3: Observabilidade e uso da IA**, onde implementaremos logs estruturados, healthchecks profundos e análise preditiva de incidentes com Inteligência Artificial."

> "Muito obrigado e até a próxima aula!"

---

## 📋 CHECKLIST RÁPIDO DO GRAVADOR

- [ ] **0:00** Introdução com o problema de divergência entre ambientes dev/prod.
- [ ] **1:00** Apresentar o `Dockerfile` multi-stage: explicar builder vs runner, Alpine e `USER node`.
- [ ] **3:30** Demonstrar o `docker-compose.yml`, healthchecks do Postgres e subir com `docker-compose up -d`.
- [ ] **5:45** Mostrar a segregação entre `.env` (ignorado) e `.env.example` (versionado).
- [ ] **7:30** Executar `npm audit` e explicar a checagem de vulnerabilidades com Trivy no pipeline.
- [ ] **8:50** Conclusão e gancho direto para a Disciplina 3 (Observabilidade e IA).
