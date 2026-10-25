# Módulo 3 — DevOps Inteligente e Integração Contínua
# Disciplina 1 — Cultura de DevOps: Da Quebra de Silos à Automação Contínua no Projeto
**Duração estimada:** 9–10 min  
**Projeto:** `plantei-api`  
**Arquivos de referência:** `package.json` · `.github/workflows/ci.yml` · `.husky/pre-commit` (ou scripts npm)  
**Objetivo:** Compreender os princípios, práticas e o mindset colaborativo de DevOps (CALMS, Três Caminhos, métricas DORA) e aplicar na prática automações de garantia de qualidade e padronização no ciclo de vida do `plantei-api`.

---

## 🎬 ABERTURA (0:00 – 1:00)

**[TELA: Editor aberto no projeto `plantei-api`, terminal limpo e apresentação de slide/diagrama com o tradicional "muro da confusão" entre Devs e Ops]**

> "Fala devs, sejam muito bem-vindos ao **Módulo 3: DevOps Inteligente e Integração Contínua**!"

> "Nos módulos anteriores, construímos bases sólidas de código limpo e testes automatizados. Mas imagine o seguinte cenário real de empresa: o desenvolvedor finaliza a feature na sexta-feira às 17h, fala *'no meu computador funciona perfeitamente'*, gera um arquivo ZIP ou passa a tarefa para o time de infraestrutura... e o deploy derruba o sistema durante o fim de semana."

> "De quem é a culpa? Do desenvolvedor que não pensou na operação? Ou do time de operações que não conhece o código? A resposta correta é: **a culpa é da falta de cultura DevOps**."

> "Nesta primeira disciplina, vamos quebrar esse muro. Vamos entender os conceitos de DevOps, o framework CALMS, as métricas DORA e implementar práticas de automação que trazem a operação para o dia a dia do nosso projeto `plantei-api` em menos de 10 minutos."

---

## 🌐 PARTE 1 — O Mindset DevOps: CALMS e os Três Caminhos (1:00 – 2:50)

**[TELA: Diagrama esquemático dos Três Caminhos de Gene Kim e o framework CALMS]**

> "DevOps não é um cargo ou uma ferramenta milagrosa. DevOps é uma **combinação de filosofias culturais, práticas e ferramentas** que aumenta a velocidade de entrega com máxima confiabilidade."

```text
┌─────────────────────────────────────────────────────────────┐
│                   O FRAMEWORK CALMS                         │
├─────────────┬───────────────────────────────────────────────┤
│ C - Culture │ Responsabilidade compartilhada (Dev + Ops)    │
│ A - Automat.│ Automatizar tudo o que for repetitivo e manual│
│ L - Lean    │ Lotes pequenos de código, redução de desperdício│
│ M - Measure │ Métricas reais de sistema e de entrega (DORA) │
│ S - Sharing │ Comunicação aberta, post-mortems sem culpa    │
└─────────────┴───────────────────────────────────────────────┘
```

> "O autor Gene Kim, no *The DevOps Handbook*, sintetiza isso nos **Três Caminhos**:"
> 1. **O Primeiro Caminho (Fluxo / Flow):** Acelerar o fluxo de trabalho da esquerda para a direita — do desenvolvimento até a produção, através de CI/CD e testes rápidos.
> 2. **O Segundo Caminho (Feedback Rápido):** Encurtar os ciclos de retorno. Se um erro acontecer no `plantei-api`, o desenvolvedor precisa saber em segundos, não em semanas através de um chamado de cliente.
> 3. **O Terceiro Caminho (Aprendizado Contínuo):** Criar uma cultura de experimentação, aprendizado com incidentes e segurança psicológica.

> "E como medimos se uma equipe está de fato no caminho certo? Através das métricas **DORA** (DevOps Research and Assessment): frequência de deploy, tempo de entrega de alterações (Lead Time for Changes), tempo médio de recuperação (MTTR) e taxa de falhas em mudanças."

---

## 🛠️ PARTE 2 — Shift-Left na Prática: Automações Pré-Commit (2:50 – 5:15)

**[TELA: Editor aberto no `package.json` do `plantei-api`, configurando scripts de verificação rápida]**

> "Uma das expressões mais fortes de DevOps é o **Shift-Left**: trazer as validações de segurança, estilo e testes para o mais cedo possível no ciclo de desenvolvimento — isto é, para a esquerda da esteira."

> "No `plantei-api`, não queremos esperar a pipeline remota do GitHub falhar para descobrir que alguém esqueceu de rodar o linter ou deixou um teste quebrado. Vamos configurar automações locais eficientes."

> "Vejam os scripts no `package.json`:"

```json
"scripts": {
  "lint": "eslint src/ --ext .js",
  "lint:fix": "eslint src/ --ext .js --fix",
  "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
  "test:quick": "npm test -- --bail --findRelatedTests",
  "check:all": "npm run lint && npm test"
}
```

**[TELA: Terminal executando `npm run check:all` e demonstrando sucesso instantâneo]**

> "Com ferramentas como Husky e lint-staged, nós amarramos esse comando diretamente ao gancho de `pre-commit` do Git. Quando o desenvolvedor roda `git commit`, o código é inspecionado automaticamente em milissegundos antes de ser registrado no histórico."

```text
git commit -m "feat: adiciona rota de pedidos"
       │
       ▼
[ Git Hook: pre-commit ]
  ├── 1. Executa ESLint nos arquivos modificados
  └── 2. Roda os testes unitários afetados
       │
    ✅ Passou ➔ Commit criado com sucesso!
    ❌ Falhou ➔ Commit abortado com mensagem clara da falha.
```

> "Isso é automação a serviço do desenvolvedor: previne retrabalho e garante que apenas código íntegro alcance o repositório central."

---

## 🔄 PARTE 3 — Fluxo de Colaboração e IA como Facilitadora (5:15 – 7:30)

**[TELA: Navegador na interface de Pull Requests do GitHub com o PR real do `plantei-api`]**

![Pull Request Real no plantei-api](../assets/github-actions-pr-view.png)

> "Na cultura DevOps, abandonamos branches longas que duram semanas — conhecidas como o inferno de merge (Merge Hell) — e adotamos o **Trunk-Based Development** ou fluxos de Pull Request curtos e frequentes."

> "Vejam na imagem acima o nosso Pull Request real no `plantei-api`: ele integra a branch `gt_m2_d1` diretamente na `main`. A esteira de CI do GitHub Actions foi acionada para garantir que nenhum código não testado passe adiante."

> "E onde a Inteligência Artificial entra nesse fluxo colaborativo?"
> "Hoje, usamos agentes de IA integrados aos Pull Requests para fazer uma primeira rodada de **Code Review assistido**: ela verifica se há regressões, se padrões de segurança OWASP foram violados e sugere melhorias de clareza antes mesmo de um colega humano revisar."

**[TELA: Exibir prompt ou automação de IA analisando diff do PR]**

> "Veja a instrução que fornecemos para a IA no workflow:"

```markdown
Prompt para IA em Pull Request:
"Analise o git diff do PR em anexo no projeto Node.js plantei-api.
Avalie sob a ótica de DevOps e Confiabilidade:
1. Há variáveis de ambiente hardcoded ou vazamento de credenciais?
2. O código adicionado possui tratamento de erros e logs adequados?
3. Há risco de lentidão ou conexões de banco de dados não liberadas?
Gere um resumo objetivo em formato Markdown para o autor do PR."
```

> "Essa sinergia entre automação, IA e colaboração humana acelera a aprovação do código de dias para poucas horas."

---

## 📈 PARTE 4 — O Ciclo Completo de Feedback Contínuo (7:30 – 8:50)

**[TELA: Diagrama do loop infinito do DevOps (Plan -> Code -> Build -> Test -> Release -> Deploy -> Operate -> Monitor)]**

> "Observem o símbolo clássico do infinito do DevOps:"

```text
       ┌────────── Plan ──────────┐
       │                          │
    Monitor                      Code
       │                          │
    Operate                      Build
       │                          │
       └──── Deploy ──── Release ─┘
```

> "O ciclo não termina quando o código entra em produção (`Deploy`). Ele só fecha quando a aplicação está em operação (`Operate`) e sendo monitorada (`Monitor`), gerando dados para o próximo planejamento (`Plan`)."

> "No `plantei-api`, cada commit que passa pela pipeline de CI está pronto para ser empacotado em um container seguro — e é exatamente essa infraestrutura segura que construiremos na próxima aula."

---

## 🎯 CONCLUSÃO E PRÓXIMOS PASSOS (8:50 – 10:00)

**[TELA: Professor em destaque com resumo em tópicos na tela]**

> "Nesta aula, vimos que DevOps é muito mais que ferramentas: é uma transformação de mindset guiada pelo framework CALMS e pelos Três Caminhos."

> "Aplicamos a filosofia do Shift-Left no `plantei-api` com verificações locais automatizadas e vimos como a colaboração moderna usa Pull Requests curtos e IA para acelerar a revisão."

> "Na **Disciplina 2**, vamos colocar a mão na massa na infraestrutura: criaremos um `Dockerfile` multi-stage altamente otimizado e seguro, configuraremos o `docker-compose` com PostgreSQL e aprenderemos como gerenciar segredos sem expor credenciais em produção."

> "Parabéns por concluir esta aula e nos vemos na Disciplina 2!"

---

## 📋 CHECKLIST RÁPIDO DO GRAVADOR

- [ ] **0:00** Abrir com energia, destacando o problema do "na minha máquina funciona" e a quebra de silos.
- [ ] **1:00** Exibir o diagrama do framework CALMS e citar os Três Caminhos.
- [ ] **2:50** Demonstrar o `package.json` com scripts de lint e teste rápido (`check:all`).
- [ ] **5:15** Mostrar um Pull Request e o conceito de Trunk-Based Development com revisão por IA.
- [ ] **7:30** Apresentar o ciclo infinito do DevOps e as métricas DORA.
- [ ] **8:50** Fazer o gancho direto para a Disciplina 2 (Docker e Ambientes Seguros).
