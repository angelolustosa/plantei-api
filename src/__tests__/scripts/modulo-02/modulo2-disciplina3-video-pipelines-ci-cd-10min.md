# Módulo 2 — Qualidade de Software e Testes com IA
# Disciplina 3 — Integração e Revisão com Pipelines: Automação e Quality Gates no Projeto
**Duração estimada:** 9–10 min  
**Projeto:** `plantei-api`  
**Arquivos de referência:** `.github/workflows/ci.yml` · `package.json` · `.env.test`  
**Objetivo:** Configurar uma esteira automatizada de CI com GitHub Actions no projeto `plantei-api`, provisionando banco de dados PostgreSQL efêmero e estabelecendo Quality Gates de cobertura mínima em até 10 minutos.

---

## 🎬 ABERTURA (0:00 – 1:00)

**[TELA: Editor com terminal ou aba de Pull Requests do GitHub]**

> "Fala devs, sejam muito bem-vindos à **Disciplina 3: Integração e Revisão com Pipelines**!"

> "Nós já aprendemos a escrever testes robustos na Disciplina 1 e a acelerar a suíte com IA na Disciplina 2. Mas agora me responda com sinceridade: o que garante que outro desenvolvedor do time não vai subir um código que quebre tudo isso?"

> "Confiar apenas que cada um vai lembrar de rodar `npm test` antes de dar push não é engenharia de software — é torcida. A frase *'mas na minha máquina funcionava'* precisa morrer hoje."

> "Nesta aula de 10 minutos, vamos transformar o `plantei-api` em um projeto com ciclo completo de automação: vamos criar uma pipeline de CI com GitHub Actions, subir um PostgreSQL real em container e travar o merge com Quality Gates."

---

## 🌐 PARTE 1 — O Conceito de Integração Contínua e Quality Gates (1:00 – 2:30)

**[TELA: Diagrama esquemático de fluxo de CI]**

> "A **Integração Contínua (CI)** é a prática onde cada alteração enviada ao repositório dispara automaticamente uma esteira de validação em um ambiente limpo e isolado:"

```text
Desenvolvedor faz PUSH / Abre PR
         │
         ▼
[ Runner GitHub Actions (Ubuntu) ]
  ├── 1. Checkout do código
  ├── 2. Instalação de dependências limpas (npm ci)
  ├── 3. Subida de Container de Banco (PostgreSQL)
  ├── 4. Execução dos Testes Automatizados (npm test)
  └── 5. Validação de Quality Gate (Cobertura mínima >= 70%)
         │
   ┌─────┴─────┐
   ▼           ▼
✅ Passou    ❌ Falhou
(Liberado)  (Merge bloqueado!)
```

> "Se um teste quebrar ou a cobertura cair abaixo da meta estipulada, a pipeline fica vermelha e **ninguém consegue mesclar o código na branch principal**. Isso é proteção real de produto."

---

## 🛠️ PARTE 2 — Escrevendo o Workflow `.github/workflows/ci.yml` (2:30 – 5:45)

**[TELA: Criar pasta `.github/workflows` e arquivo `ci.yml` no VS Code]**

> "Vamos criar a estrutura no `plantei-api`. Na raiz do projeto, criamos a pasta `.github/workflows/` e o arquivo `ci.yml`."

> "Vejam como a configuração é limpa e declarativa:"

```yaml
name: CI Plantei API - Quality & Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test-and-verify:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgrespassword
          POSTGRES_DB: plantei_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout do código
        uses: actions/checkout@v4

      - name: Configurar Node.js v20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Instalar dependências
        run: npm ci

      - name: Executar Testes Unitários e Integração com Cobertura
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_PORT: 5432
          DB_USER: postgres
          DB_PASSWORD: postgrespassword
          DB_NAME: plantei_test
          JWT_SECRET: ${{ secrets.JWT_SECRET || 'chave-secreta-ci-temporaria' }}
        run: npm run test:coverage
```

> "Olha que espetacular: o GitHub Actions sobe um container oficial do Postgres usando `services`, espera o banco ficar saudável (`pg_isready`), injeta as variáveis seguras e roda toda a nossa suíte de testes com cobertura."

---

## 🛡️ PARTE 3 — Implementando Quality Gates no `package.json` (5:45 – 7:30)

**[TELA: Abrir o `package.json` na seção `jest`]**

> "Agora vamos configurar o nosso **Quality Gate**. Queremos que o Jest falhe automaticamente com erro se a cobertura de testes cair abaixo de um limite aceitável pelo time."

> "No `package.json`, adicionamos a propriedade `coverageThreshold` na chave `jest`:"

```json
"jest": {
  "testEnvironment": "node",
  "testMatch": [
    "**/__tests__/**/*.test.js"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 70,
      "lines": 70,
      "statements": 70
    }
  }
}
```

> "O que isso significa na prática? Se alguém enviar um novo controller com 200 linhas de código sem testes, o comando `npm run test:coverage` vai acusar erro no terminal e o CI vai quebrar com código de saída 1."

> "Você não precisa mais cobrar cobertura em reunião: a esteira cobra pelo time."

---

## 🔒 PARTE 4 — Boas Práticas: Segredos e Proteção de Branch (7:30 – 8:45)

**[TELA: Navegador mostrando GitHub Repo -> Settings -> Branches / Secrets]**

> "Duas regras inegociáveis para fechar com chave de ouro:
> 1. **Segredos nunca vão para o Git:** Chaves de API, senhas e tokens JWT são configurados em **Settings → Secrets and variables → Actions** e chamados via `${{ secrets.NOME_DO_SEGREDO }}`.
> 2. **Branch Protection Rules:** Ative a opção *Require status checks to pass before merging*. Assim, o GitHub desativa o botão de merge caso o job do CI falhe."

```text
[ Require status checks to pass before merging ]
  ☑ test-and-verify (CI Plantei API)
```

> "Com essa configuração, seu repositório atinge o nível de maturidade das maiores empresas de tecnologia."

---

## 🏁 ENCERRAMENTO E VISÃO COMPLETA (8:45 – 10:00)

**[TELA: Professor ou tela com o ciclo completo de qualidade fechado]**

> "Parabéns! Nós fechamos o ciclo completo do nosso **Módulo 2: Qualidade de Software e Testes com IA**:"

> "1. **Disciplina 1:** Aprendemos os fundamentos da pirâmide, AAA e mocks no `plantei-api`.  
> 2. **Disciplina 2:** Aceleramos a criação de testes e análise de lacunas usando IA.  
> 3. **Disciplina 3:** Automatizamos tudo com GitHub Actions, banco em container e Quality Gates."

> "Agora nosso backend está blindado. Qualquer bug é pego em minutos, antes de sequer sonhar em chegar aos clientes da Plantei."

> "Suba esse workflow para o seu repositório, configure sua branch e celebre cada PR aprovado com a luzinha verde do CI. Nos vemos nos próximos módulos!"

---

## 📋 Check-list de Gravação

- [ ] Arquivo `.github/workflows/ci.yml` pronto no projeto
- [ ] Bloco `coverageThreshold` no `package.json` configurado
- [ ] Tela do GitHub aberta na aba *Actions* para mostrar a execução ao vivo
- [ ] Terminal com execução de `npm run test:coverage` demonstrando a validação das métricas

## 🔑 Conceitos-Chave da Disciplina 3

- **GitHub Actions Service Containers:** Provisionamento automatizado de serviços de banco de dados (ex: PostgreSQL) em memória para a esteira de teste.
- **`npm ci` vs `npm install`:** O `npm ci` instala dependências de forma estrita baseada no `package-lock.json`, garantindo determinismo idêntico entre máquinas.
- **Quality Gates:** Regras automatizadas (como mínimo de cobertura) que impedem a integração de código degradado.
- **Branch Protection:** Regra do repositório que impede merge direto na branch principal sem aprovação dos testes.
