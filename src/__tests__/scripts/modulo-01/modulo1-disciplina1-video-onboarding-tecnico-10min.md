# Módulo 1 — Engenharia de Software e IA Aplicada
# Disciplina 1 — Onboarding Técnico: Setup com Docker, Git e Primeiro Deploy Local
**Duração estimada:** 9–10 min  
**Projeto:** `plantei-api`  
**Arquivos de referência:** `package.json` · `.env.example` · `src/server.js` · `src/config/database.js` · `docker-compose.yml`  
**Objetivo:** Configurar o ambiente completo de desenvolvimento para o `plantei-api` (Node.js 20 LTS, Docker, Git), provisionar o banco de dados PostgreSQL em container, configurar variáveis de ambiente, executar seeds e realizar a primeira requisição na API em até 10 minutos.

---

## 🎬 ABERTURA (0:00 – 1:00)

**[TELA: Professor no VS Code limpo, terminal aberto e slide de boas-vindas ao curso]**

> "Fala devs, sejam muito bem-vindos ao **Módulo 1 de Engenharia de Software e IA Aplicada**!"

> "Em qualquer empresa de ponta, o primeiro grande teste de um desenvolvedor é o seu **Onboarding Técnico**. Em times desorganizados, leva-se até três dias apenas para instalar dependências, configurar banco de dados e conseguir rodar o projeto localmente."

> "Aqui na nossa formação, nós fazemos engenharia de verdade. Nós vamos usar **Docker e automação** para configurar todo o nosso ambiente em menos de 10 minutos."

> "Nesta primeira aula, vamos validar as ferramentas essenciais, clonar o repositório da `plantei-api`, subir um banco PostgreSQL isolado em container, configurar as variáveis de ambiente e rodar nossa aplicação pela primeira vez com dados de teste. Vamos lá!"

---

## 🛠️ PARTE 1 — Ferramental Essencial e Padrões de Git (1:00 – 2:45)

**[TELA: Terminal executando checagem de versões do Node, npm, Docker e Git]**

> "Antes de tocar no código, vamos checar os pré-requisitos essenciais da nossa máquina. O `plantei-api` utiliza ECMAScript Modules nativo (`\"type\": \"module\"`), o que exige o **Node.js versão 20 LTS ou superior**."

> "No seu terminal, execute:"

```bash
node -v    # Deve retornar v20.x ou superior
npm -v     # Gerenciador de pacotes moderno
docker -v  # Docker Engine / Docker Desktop ativo
git --version
```

> "E quanto ao controle de versão, nós adotamos o padrão **Conventional Commits**: commits semânticos que explicam claramente o tipo de alteração:"

```text
feat:     adiciona nova rota ou funcionalidade
fix:      corrige um bug
refactor: melhora a estrutura do código sem alterar comportamento
test:     adiciona ou atualiza testes automatizados
docs:     altera documentação ou comentários
```

> "Isso garante rastreabilidade imediata e permite gerar changelogs automatizados no futuro."

---

## 🐳 PARTE 2 — Provisionando o Banco com Docker (2:45 – 5:00)

**[TELA: Terminal rodando Docker para subir o container PostgreSQL]**

> "Instalar PostgreSQL diretamente no sistema operacional é uma péssima prática: polui o computador, gera conflito de portas e impede que você teste diferentes versões de banco com facilidade."

> "Com o **Docker**, nós subimos uma instância limpa do PostgreSQL 15 em segundos com um único comando:"

```bash
docker run --name plantei-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgrespassword \
  -e POSTGRES_DB=plantei_db \
  -p 5432:5432 \
  -d postgres:15-alpine
```

**[TELA: Executar `docker ps` e ver o container `plantei-postgres` rodando]**

> "Vejam no terminal: executamos `docker ps` e o container já está ativo, escutando na porta 5432 e completamente isolado do restante do seu sistema operacional."

> "Se em algum momento você quiser reiniciar do zero com banco limpo, basta recriar o container sem nenhum impacto na sua máquina host."

---

## ⚙️ PARTE 3 — Clonagem, `.env` e Instalação de Dependências (5:00 – 7:15)

**[TELA: Editor abrindo a pasta do projeto `plantei-api`, duplicando `.env.example` para `.env`]**

> "Com o banco no ar, vamos clonar o repositório e preparar a aplicação:"

```bash
git clone https://github.com/seu-usuario/plantei-api.git
cd plantei-api
npm install
```

> "Agora olhem para a raiz do projeto: nós temos o arquivo `.env.example`. Ele serve como gabarito de todas as configurações necessárias."

> "Vamos duplicar este arquivo e criar o nosso `.env` local:"

```bash
cp .env.example .env
```

**[TELA: Abrir o `.env` e conferir os valores de porta, banco e segredo JWT]**

```env
NODE_ENV=development
PORT=3000

# Conexão com o banco Docker que acabamos de subir
DB_HOST=localhost
DB_PORT=5432
DB_NAME=plantei_db
DB_USER=postgres
DB_PASS=postgrespassword

# Segredo de assinatura dos tokens JWT
JWT_SECRET=super_segredo_dev_plantei_2026
JWT_EXPIRATION=1d
```

> "Reparem na regra de ouro: o arquivo `.env` está explicitamente incluído no `.gitignore`. **Nunca commite o `.env` no Git**!"

---

## 🚀 PARTE 4 — Migrações, Seeds e Primeira Requisição (7:15 – 8:50)

**[TELA: Terminal executando o script de sementes e inicialização do servidor]**

> "Nosso banco de dados acabou de nascer, então ele ainda está sem tabelas. No `plantei-api`, nós temos scripts de inicialização automática no `src/seeders/seed.js` que criam as tabelas e populam perfis, permissões e produtos de exemplo."

> "No terminal, rodamos:"

```bash
npm run seed
```

> "Vejam as mensagens no terminal: as tabelas de Usuários, Perfis, Permissões e Produtos foram sincronizadas com sucesso!"

> "Agora vamos iniciar nosso servidor em modo de desenvolvimento com hot-reload:"

```bash
npm run dev
```

**[TELA: Abrir terminal secundário ou navegador e disparar `curl http://localhost:3000/api/health`]**

> "O servidor responde na porta 3000! Vamos fazer nossa primeira requisição de validação de saúde:"

```bash
curl http://localhost:3000/api/health
```

> "Resposta: `{ status: 'UP', database: 'CONNECTED', uptimeSeconds: 3 }`! Nosso ambiente está 100% operacional, integrado ao banco e pronto para o desenvolvimento."

---

## 🎯 CONCLUSÃO E PRÓXIMOS PASSOS (8:50 – 10:00)

**[TELA: Professor em destaque com resumo dos 4 passos concluídos]**

> "Sensacional! Em menos de 10 minutos, nós completamos o Onboarding Técnico com maestria:"
> - Validamos o Node.js 20 LTS e adotamos boas práticas de Git e Conventional Commits.
> - Subimos o PostgreSQL isolado com Docker.
> - Configuramos variáveis de ambiente com `.env.example`.
> - Executamos as seeds de banco e validamos a API no ar.

> "Agora que nossa infraestrutura local está impecável, podemos focar no que realmente importa: a qualidade do nosso código."

> "Na **Disciplina 2**, vamos revisitar os princípios da Engenharia Limpa: POO, SOLID e Clean Architecture aplicados diretamente na estrutura do `plantei-api`."

> "Parabéns pelo onboarding e te espero na próxima aula!"

---

## 📋 CHECKLIST RÁPIDO DO GRAVADOR

- [ ] **0:00** Abertura destacando a importância de um onboarding rápido e padronizado.
- [ ] **1:00** Validar versões no terminal (`node -v`, `docker -v`, `git --version`) e explicar Conventional Commits.
- [ ] **2:45** Executar `docker run` para o PostgreSQL 15 e confirmar com `docker ps`.
- [ ] **5:00** Mostrar a cópia de `.env.example` para `.env` e explicar por que o `.env` é ignorado no Git.
- [ ] **7:15** Rodar `npm run seed` e `npm run dev`, testando a resposta com `curl /api/health`.
- [ ] **8:50** Concluir e fazer o gancho para a Disciplina 2 (Revisão de Engenharia Limpa e SOLID).

