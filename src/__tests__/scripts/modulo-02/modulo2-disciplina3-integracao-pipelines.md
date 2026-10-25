# Módulo 2 — Qualidade de Software e Testes com IA
# Disciplina 3 — Integração e Revisão com Pipelines: Roteiro Completo de Gravação
> **Construção de pipelines de CI/CD com foco em automação, inspeção de qualidade contínua e Quality Gates no projeto `plantei-api`.**  
> **Carga Horária:** 8 horas (4 blocos de vídeo de ~10 a 12 minutos cada)  
> **Repositório:** `plantei-api` (Branch: `gt_m2_d1`)  
> **Ferramentas:** GitHub Actions, PostgreSQL (Service Container), Jest Coverage Thresholds, Branch Protection Rules.

---

## 🗺️ Visão Geral da Disciplina 3

| Bloco | Título do Vídeo | Foco Prático no `plantei-api` | Arquivos Envolvidos |
|---|---|---|---|
| **3.1** | **Fundamentos de CI/CD e a Cultura de Feedback Contínuo** | Compreender o ciclo dev → push → pipeline → feedback e por que testes em máquina local não bastam | Conceitual + Diagrama de Pipeline |
| **3.2** | **Criando a Pipeline GitHub Actions com PostgreSQL em Container** | Criação do arquivo de workflow executando testes unitários e de integração com banco real | `.github/workflows/ci.yml` · `src/app.js` |
| **3.3** | **Quality Gates na Prática: Bloqueando Deploys por Cobertura Mínima** | Configuração do `coverageThreshold` no Jest para falhar a pipeline se a cobertura cair | `package.json` · `.github/workflows/ci.yml` |
| **3.4** | **Revisão Contínua, Pull Requests e Proteção de Branch** | Configurar Branch Protection Rules no GitHub, revisão assistida e boas práticas de segurança | GitHub Settings · Pull Request Demo |

---

# 🎬 VÍDEO 3.1 — Fundamentos de CI/CD e a Cultura de Feedback Contínuo
**Duração estimada:** 10–12 min  
**Objetivo:** Introduzir o conceito de Integração Contínua (CI) e Entrega Contínua (CD), mostrando por que "na minha máquina funciona" é o sintoma mais perigoso da engenharia de software e como automatizar a validação a cada commit.

---

### 0:00 – 1:30 | Abertura: O Fim do "Na Minha Máquina Funciona"
**[TELA: Professor na webcam ou tela com slide conceitual]**

> "Fala devs! Sejam muito bem-vindos à Disciplina 3 do nosso Módulo de Qualidade de Software! Nas aulas anteriores, nós construímos uma suíte de testes unitários e de integração de altíssimo nível, e aprendemos a acelerar tudo isso com IA."
>
> "Mas agora imagine o seguinte cenário: você terminou sua tarefa, rodou os testes no seu notebook e tudo passou. Você abre o Pull Request e a aplicação vai para homologação. Lá no servidor, a aplicação quebra! Por quê? Faltava uma variável de ambiente, o Node era de outra versão, ou o banco de dados tinha um comportamento ligeiramente diferente."
>
> "É exatamente para resolver isso que existe o **CI/CD** — Continuous Integration e Continuous Delivery."

---

### 1:30 – 5:00 | O Ciclo da Integração Contínua
**[TELA: Exibir diagrama de fluxo de CI/CD no editor ou slide]**

```text
 ┌──────────────┐     git push      ┌───────────────────────────────────────────────┐
 │ Desenvolvedor│ ────────────────> │              GITHUB ACTIONS                   │
 └──────────────┘                   │                                               │
                                    │  1. Checkout do Código (git fetch)            │
                                    │  2. Setup do Node.js (v20) + Cache npm        │
                                    │  3. Subir Banco de Dados (PostgreSQL Service) │
                                    │  4. Executar Migrations / Seeders             │
                                    │  5. Executar npm test                         │
                                    │  6. Validar Quality Gates (Coverage >= 70%)   │
                                    └───────────────────────┬───────────────────────┘
                                                            │
                                         ┌──────────────────┴──────────────────┐
                                         ▼                                     ▼
                                  ✅ Pipeline SUCESSO                  ❌ Pipeline FALHOU
                               (Pull Request Liberado)               (Merge Bloqueado!)
```

> "Continuous Integration não é uma ferramenta. É uma prática cultural:
> 1. Desenvolvedores integram seu código várias vezes ao dia na branch principal.
> 2. Cada alteração dispara uma esteira de automação (runner limpo e isolado).
> 3. O runner baixa as dependências, roda os testes e analisa o código.
> 4. Se qualquer teste falhar, o time recebe feedback em menos de 3 minutos!"

---

### 5:00 – 8:30 | Os Componentes de uma Pipeline no GitHub Actions
**[TELA: Navegar na interface do GitHub -> aba "Actions"]**

> "No ecossistema moderno, a ferramenta mais adotada e integrada é o **GitHub Actions**. Vamos entender a hierarquia:"
>
> - **Workflow:** O fluxo completo definido em arquivo `.yml` dentro de `.github/workflows/`.
> - **Event (Triggers):** O gatilho que dispara a execução (ex: `push` em branches específicas ou criação de `pull_request`).
> - **Job:** Um conjunto de passos que roda em uma máquina virtual dedicada (ex: `ubuntu-latest`).
> - **Steps:** As instruções executadas em ordem cronológica (scripts bash ou ações da comunidade chamadas de `actions`).
> - **Services:** Contêineres Docker acoplados ao job — como um banco PostgreSQL ou Redis que sobe em segundo plano para apoiar os testes de integração.

---

### 8:30 – 11:30 | Estratégia de CI para o `plantei-api`
**[TELA: Abrir a raiz do projeto `plantei-api` no VS Code]**

> "Nosso projeto tem particularidades muito importantes que a pipeline precisa atender:
> 1. Usamos Node.js com ES Modules (`"type": "module"`).
> 2. Temos testes unitários (rápidos e sem banco).
> 3. Temos testes de integração com Supertest que fazem `INSERT`, `SELECT` e `UPDATE` reais no PostgreSQL!
>
> Portanto, nossa pipeline não pode rodar apenas `npm test` no seco; ela precisa provisionar um PostgreSQL em contêiner com as credenciais certas e passar a `DATABASE_URL` para o Jest."

---

### 11:30 – 12:00 | Encerramento do Bloco
> "Essa é a base conceitual. No Vídeo 3.2, vamos abrir o VS Code, criar o diretório `.github/workflows/` e escrever nossa primeira pipeline de verdade do zero!"

---

# 🎬 VÍDEO 3.2 — Criando a Pipeline GitHub Actions com PostgreSQL em Container
**Duração estimada:** 10–12 min  
**Objetivo:** Codificar o workflow `.github/workflows/ci.yml` para a `plantei-api`, configurando um Service Container do PostgreSQL, injeção de variáveis de ambiente e execução automatizada da suíte de testes.

---

### 0:00 – 1:30 | Abertura: Do Editor para a Nuvem
**[TELA: Professor no VS Code criando a pasta `.github/workflows`]**

> "Fala pessoal, bem-vindos ao Vídeo 3.2. Chegou a hora de transformar código em automação. Vamos criar o arquivo `.github/workflows/ci.yml` na raiz da nossa `plantei-api`."
>
> "Ao final deste vídeo, cada `git push` que dermos vai acionar automaticamente os servidores do GitHub para rodar nossos testes unitários e de integração!"

---

### 1:30 – 4:30 | Criando a Estrutura do Workflow
**[TELA: Criar e editar `.github/workflows/ci.yml`]**

```yaml
name: CI Plantei API

on:
  push:
    branches: [ main, gt_m2_d1, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    name: Executar Testes & Qualidade
    runs-on: ubuntu-latest
```

> "Explicando o cabeçalho:
> - `name`: Nome legível que aparece nos badges e na aba Actions.
> - `on`: Define que a pipeline roda em qualquer push para `main` ou nossa branch atual, além de disparar em Pull Requests direcionados a elas.
> - `runs-on: ubuntu-latest`: Uma máquina virtual Linux limpa, fornecida pela infraestrutura do GitHub."

---

### 4:30 – 7:30 | Configurando o PostgreSQL Service Container
**[TELA: Adicionar o bloco de `services` no YAML]**

> "Aqui está o grande segredo para testes de integração profissionais: usar um **Service Container** do Docker diretamente no job!"

```yaml
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgrespassword
          POSTGRES_DB: plantei_test
        ports:
          - 5432:5432
        # Opções de checagem para garantir que o banco está pronto antes dos testes
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
```

> "Perceba a diretiva `options: --health-cmd pg_isready`. Isso garante que o runner do GitHub Actions só avance para os testes depois que o PostgreSQL estiver 100% pronto para aceitar conexões TCP. Sem isso, a pipeline sofre com erros intermitentes de conexão recusada."

---

### 7:30 – 10:00 | Definindo os Steps: Checkout, Node.js e Execução dos Testes
**[TELA: Completar os `steps` do arquivo `ci.yml`]**

```yaml
    steps:
      - name: 📥 Clonar repositório (Checkout)
        uses: actions/checkout@v4

      - name: 🟢 Configurar Node.js (v20)
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: 📦 Instalar dependências
        run: npm ci

      - name: 🧪 Executar testes com relatório de cobertura
        env:
          NODE_ENV: test
          DATABASE_URL: postgres://postgres:postgrespassword@localhost:5432/plantei_test
          JWT_SECRET: super_secret_jwt_key_para_testes_automatizados_ci
        run: npm run test:coverage
```

> "Vejam três detalhes essenciais:
> 1. `npm ci` em vez de `npm install`: O `npm ci` é feito especificamente para pipelines; ele respeita estritamente o `package-lock.json`, garantindo builds 100% determinísticos.
> 2. `cache: 'npm'`: O GitHub salva em cache os pacotes já baixados. A segunda execução da pipeline roda em metade do tempo!
> 3. As variáveis de ambiente do banco apontam para `localhost:5432` com o banco `plantei_test` criado pelo contêiner."

---

### 10:00 – 12:00 | Commit, Push e Primeira Execução
**[TELA: Executar no terminal do VS Code e alternar para o navegador]**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: adiciona pipeline github actions com postgres service"
git push origin gt_m2_d1
```

**[TELA: Navegador mostrando a bolinha amarela virando o 'check' verde ✅ no GitHub Actions]**

> "Vejam que emocionante: a máquina virtual subiu, subiu o PostgreSQL, clonou o repositório, rodou nossos testes e gerou o relatório de cobertura. Tudo verde! Agora nenhum código entra sem passar pela esteira!"

---

# 🎬 VÍDEO 3.3 — Quality Gates na Prática: Bloqueando Deploys por Cobertura Mínima
**Duração estimada:** 10–12 min  
**Objetivo:** Configurar **Quality Gates** através do Jest Coverage Thresholds no `package.json`, forçando a quebra da pipeline caso a cobertura de código caia abaixo dos limites aceitáveis do projeto.

---

### 0:00 – 2:00 | O que é um Quality Gate e Por que Usá-lo?
**[TELA: Professor na webcam / editor aberto]**

> "Fala galera, bem-vindos ao Vídeo 3.3! Ter uma pipeline rodando testes é incrível. Mas o que impede um desenvolvedor apressado de criar uma nova rota, um novo controller com 300 linhas de código, e não escrever nenhum teste?"
>
> "A pipeline rodaria os testes antigos, todos passariam com sucesso, e o código sem testes iria para a branch principal. A cobertura de testes do projeto cairia silenciosamente."
>
> "Para impedir isso, usamos **Quality Gates** (Portões de Qualidade). Se a cobertura global ou por arquivo cair abaixo de uma meta pré-estabelecida (ex: 70%), a pipeline **falha com erro**, bloqueando o merge!"

---

### 2:00 – 5:00 | Configurando `coverageThreshold` no `package.json`
**[TELA: Abrir o `package.json` do `plantei-api`]**

> "O Jest tem suporte nativo a Quality Gates através da chave `coverageThreshold`. Vamos configurá-la agora:"

```json
  "jest": {
    "testEnvironment": "node",
    "testMatch": [
      "**/__tests__/**/*.test.js"
    ],
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/seeders/**",
      "!src/server.js"
    ],
    "coverageReporters": [
      "text",
      "lcov",
      "html"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 65,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
```

> "Vejam o que estamos dizendo ao Jest:
> Se o projeto como um todo tiver menos de:
> - 65% de ramos (branches) cobertos;
> - 70% de funções;
> - 70% de linhas executadas;
> O comando do Jest retornará um **exit code 1**, quebrando o processo Node!"

---

### 5:00 – 8:30 | Simulando uma Violação de Qualidade (A Pipeline Quebrando)
**[TELA: Criar um arquivo fictício sem testes ou reduzir temporariamente os testes]**

> "Vamos ver o Quality Gate em ação. Imagine que alguém criou um arquivo `src/utils/calculadoraDesconto.js` com várias regras de negócio, mas não escreveu o teste correspondente."
>
> "Vamos rodar o coverage localmente no terminal:"

```bash
npm run test:coverage
```

**[TELA: Terminal exibindo o erro em vermelho com exit code 1]**

```text
Jest: "global" coverage threshold for lines (70%) not met: 63.84%
Jest: "global" coverage threshold for branches (65%) not met: 58.12%

npm error Lifecycle script `test:coverage` failed with error:
npm error code 1
```

> "Olha que sensacional! O Jest identificou que as metas de 70% e 65% não foram atingidas e falhou a execução. No GitHub Actions, isso significa que a pipeline fica **vermelha** instantaneamente!"

---

### 8:30 – 11:30 | Ajustando Metas Gradualmente e Boas Práticas
**[TELA: Mostrar tabela de metas no `src/__tests__/README.md`]**

> "Uma dica de ouro de liderança técnica:
> Não coloque thresholds irrealistas de 100% logo no primeiro dia em projetos legados. Se seu projeto tem 40% de cobertura hoje, coloque o threshold em 40%. A regra é o **Princípio do Escoteiro**: deixe a área mais limpa do que quando você a encontrou."
>
> "Conforme a equipe escreve novos testes, suba o threshold para 50%, depois 60%, depois 70%. O importante é que a cobertura **nunca regrida**."

---

### 11:30 – 12:00 | Encerramento do Bloco
> "Agora que nosso portão de qualidade está configurado, no próximo e último vídeo vamos aprender como travar a branch `main` no GitHub para impedir qualquer merge que não tenha o selo de aprovação da nossa pipeline!"

---

# 🎬 VÍDEO 3.4 — Revisão Contínua, Pull Requests e Proteção de Branch
**Duração estimada:** 10–12 min  
**Objetivo:** Configurar regras de proteção de branch (Branch Protection Rules) no GitHub, integrar os relatórios de status checks em Pull Requests e consolidar a esteira de revisão contínua.

---

### 0:00 – 2:00 | Abertura: A Engenharia Social da Qualidade
**[TELA: Professor no navegador / repositório no GitHub]**

> "Fala devs! Chegamos ao vídeo de encerramento do nosso Módulo 2. Nós já temos testes unitários, testes com banco, testes acelerados por IA e uma pipeline com Quality Gates que roda no GitHub Actions."
>
> "Porém, se qualquer desenvolvedor puder fazer um `git push origin main` direto do terminal, ignorando o Pull Request, todo o nosso esforço de qualidade pode ser burlado em segundos."
>
> "Nesta aula, vamos fechar o cadeado: configurar **Branch Protection Rules** e conectar a esteira de revisão contínua ao ciclo de vida dos Pull Requests."

---

### 2:00 – 5:30 | Configurando Branch Protection Rules no GitHub
**[TELA: Acessar GitHub -> Settings -> Branches -> Add branch ruleset / protection rule]**

> "Vamos até as configurações do nosso repositório no GitHub:
> 1. Em **Branch name pattern**, digitamos `main`.
> 2. Marcamos **Require a pull request before merging** (ninguém faz push direto na main).
> 3. Marcamos **Require status checks to pass before merging** (exige aprovação da pipeline).
> 4. Na barra de busca de checks, selecionamos o job da nossa pipeline: `Executar Testes & Qualidade`."

```text
Configurações Essenciais:
[x] Require a pull request before merging
    [x] Require approvals (mínimo de 1 code review)
[x] Require status checks to pass before merging
    [x] Require branches to be up to date before merging
    -> Status Check selecionado: "Executar Testes & Qualidade"
[x] Do not allow bypassing the above settings (Aplica a administradores também!)
```

> "A partir desse momento, o botão verde de **Merge Pull Request** fica fisicamente desabilitado até que a pipeline do GitHub Actions complete todos os testes com sucesso!"

---

### 5:30 – 8:30 | O Fluxo de Trabalho Real: Criando um Pull Request
**[TELA: Criar uma branch de feature no terminal, fazer push e abrir o PR]**

```bash
git checkout -b feature/novo-teste-produto
# Fazendo um commit de melhoria
git commit -am "test: adiciona cobertura completa para rotas de produto"
git push origin feature/novo-teste-produto
```

**[TELA: Tela do Pull Request no GitHub]**

> "Vejam o Pull Request aberto. Embaixo, aparece a seção de checks:"
>
> - `Executar Testes & Qualidade — In progress...` (rodando em background)
> - Se os testes passarem: `All checks have passed` (Botão de Merge habilitado).
> - Se houver falha de cobertura ou erro de teste: `Checks failed` (Botão de Merge bloqueado com alerta vermelho).

---

### 8:30 – 11:00 | Boas Práticas de Segurança em Pipelines CI/CD
**[TELA: Slide ou checklist de segurança]**

> "Antes de concluirmos, guardem estas 4 regras de ouro de segurança em pipelines:
> 1. **Nunca versione credenciais:** Nunca comite senhas ou chaves de API no arquivo YAML. Use sempre **GitHub Actions Secrets** (`${{ secrets.DATABASE_PASSWORD }}`).
> 2. **Imutabilidade de versões:** Use versões pinadas nas actions oficiais (ex: `actions/checkout@v4` em vez de `@master`).
> 3. **Timeout nos Jobs:** Defina sempre `timeout-minutes: 10` para evitar que um teste travado em loop gaste todos os seus minutos do plano do GitHub Actions.
> 4. **Isolamento de Ambientes:** O banco de dados de teste roda isolado e é destruído assim que o job termina. Zero risco de afetar dados de produção."

---

### 11:00 – 12:00 | Conclusão do Módulo 2
**[TELA: Professor na webcam com o mapa mental completo do Módulo 2]**

> "Parabéns a todos que chegaram até aqui! Nós percorremos uma jornada completa:
> - Na **Disciplina 1**, aprendemos a base da pirâmide: unitários, mocks com `@jest/globals`, integração com Supertest e Jest ESM.
> - Na **Disciplina 2**, dominamos o uso da Inteligência Artificial como parceira: gerando testes contextuais, descobrindo lacunas de cobertura e criando dados sintéticos resilientes.
> - E agora, na **Disciplina 3**, colocamos tudo isso em uma esteira de automação industrial com GitHub Actions e Quality Gates rígidos."
>
> "O projeto `plantei-api` agora possui um ecossistema de qualidade profissional. Nos vemos no Módulo 3, onde vamos mergulhar em DevOps Inteligente e Gestão de Ambientes Seguros! Até lá!"

