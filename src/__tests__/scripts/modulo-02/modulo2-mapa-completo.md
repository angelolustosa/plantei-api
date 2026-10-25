# Módulo 2 — Qualidade de Software e Testes com IA
## Mapa Completo: Todos os Vídeos

**Carga horária:** 24h (conforme ementa) → ~144 vídeos de 10 min ou estrutura agrupada  
**Estrutura adotada:** 3 temas × ~4 vídeos = **12 vídeos de 8–10 min por módulo**

---

## 📦 Tema 1 — Testes de Software (8h / 2 créditos)

> Fundamentos da pirâmide de qualidade, estratégias de manutenção e confiabilidade no ciclo de desenvolvimento.

| # | Vídeo | Conteúdo | Arquivo de teste | Script |
|---|-------|----------|-----------------|--------|
| 1.1 | Pirâmide + Configuração | Por que testar, pirâmide de qualidade, instalar Jest/Supertest | — | `modulo2-video1.1-piramide-configuracao.md` ✅ |
| 1.2 | Testes Unitários — AAA | `hash.test.js` + `produto.model.test.js` | `unit/hash.test.js` · `unit/produto.model.test.js` | `modulo2-video1.2-testes-unitarios-aaa.md` ✅ |
| 1.3 | Mocks | `auth.service.test.js` + `auth.middleware.test.js` | `unit/auth.service.test.js` · `unit/auth.middleware.test.js` | `modulo2-video1.3-mocks.md` ✅ |
| 1.4 | Integração + Coverage | `auth.routes.test.js` + `produto.routes.test.js` + `coverage` | `integration/auth.routes.test.js` · `integration/produto.routes.test.js` | `modulo2-video1.4-integracao-coverage.md` ✅ |

**Status: ✅ Scripts prontos · ✅ Código implementado**

---

## 🤖 Tema 2 — Testes Automatizados com IA (8h / 2 créditos)

> Aplicação de ferramentas de IA para geração, análise e otimização de testes automatizados.

| # | Vídeo | Conteúdo | Ferramenta/Projeto | Script |
|---|-------|----------|--------------------|--------|
| 2.1 | IA para gerar testes | Usar GitHub Copilot / IA para gerar testes unitários com mocks para `contato.service.js` | Copilot + `plantei-api` | `modulo2-disciplina2-testes-automatizados-ia.md` ✅ |
| 2.2 | Analisando lacunas com IA | Apontar relatório de coverage para IA e gerar testes para branches de `autorizar.middleware.js` | Jest coverage + IA | `modulo2-disciplina2-testes-automatizados-ia.md` ✅ |
| 2.3 | Refatorando testes com IA | Eliminar over-mocking e transformar testes frágeis em testes resilientes focados em contrato | IA + `auth.service.test.js` | `modulo2-disciplina2-testes-automatizados-ia.md` ✅ |
| 2.4 | Geração de dados de teste | Criar fixtures e factories sintéticas para `Usuario`, `Produto`, `Contato` sem colisões | IA + `factories.js` | `modulo2-disciplina2-testes-automatizados-ia.md` ✅ |

**Status: ✅ Roteiro completo de gravação pronto em `modulo2-disciplina2-testes-automatizados-ia.md`**

---

## 🔄 Tema 3 — Integração e Revisão com Pipelines (8h / 2 créditos)

> Construção de pipelines de CI/CD com foco em automação e inspeção de qualidade contínua.

| # | Vídeo | Conteúdo | Ferramenta/Projeto | Script |
|---|-------|----------|--------------------|--------|
| 3.1 | O que é CI/CD | Conceito, ciclo dev → test → gate → merge, feedback loops rápidos | Conceitual + diagrama | `modulo2-disciplina3-integracao-pipelines.md` ✅ |
| 3.2 | GitHub Actions — pipeline com PostgreSQL | Workflow `.github/workflows/ci.yml` com service container PostgreSQL e Jest ESM | `plantei-api` + GitHub Actions | `modulo2-disciplina3-integracao-pipelines.md` ✅ |
| 3.3 | Quality Gates | Bloquear merge com `coverageThreshold` no `package.json` caso cobertura caia | Jest coverage + CI | `modulo2-disciplina3-integracao-pipelines.md` ✅ |
| 3.4 | Revisão contínua e Branch Protection | Bloqueio de merge na branch principal via status checks obrigatórios e boas práticas | GitHub Settings + Pull Requests | `modulo2-disciplina3-integracao-pipelines.md` ✅ |

**Status: ✅ Roteiro completo de gravação pronto em `modulo2-disciplina3-integracao-pipelines.md`**

---

## 🗂️ Visão Geral da Estrutura de Arquivos

```
plantei-api/
  .github/
    workflows/
      ci.yml                          ← Tema 3 (pipeline com Postgres Service)
  src/
    __tests__/
      scripts/
        modulo-02/                    ← Pasta do Módulo 02
          modulo2-mapa-completo.md      ← Este arquivo
        # --- Formato Rápido / Express (≤ 10 min por vídeo) ---
        modulo2-disciplina1-video-testes-software-10min.md  ✅ D1 em 10 min (Pirâmide, AAA, Mocks, Coverage)
        modulo2-disciplina2-video-testes-ia-10min.md        ✅ D2 em 10 min (Prompts, Branches, Fixtures)
        modulo2-disciplina3-video-pipelines-ci-cd-10min.md  ✅ D3 em 10 min (CI/CD, GitHub Actions, Quality Gates)
        modulo2-video-resumo-disciplinas-1-a-3-10min.md     ✅ Visão Integrada D1 a D3 em 10 min
        # --- Formato Fracionado / Completo por Tópico ---
        modulo2-video1.1-*.md         ✅ Disciplina 1 (Tópico 1.1)
        modulo2-video1.2-*.md         ✅ Disciplina 1 (Tópico 1.2)
        modulo2-video1.3-*.md         ✅ Disciplina 1 (Tópico 1.3)
        modulo2-video1.4-*.md         ✅ Disciplina 1 (Tópico 1.4)
        modulo2-disciplina2-*.md      ✅ Disciplina 2 (Tópicos 2.1 a 2.4)
        modulo2-disciplina3-*.md      ✅ Disciplina 3 (Tópicos 3.1 a 3.4)
      unit/
        hash.test.js                  ✅ Vídeo 1.2
        produto.model.test.js         ✅ Vídeo 1.2
        auth.service.test.js          ✅ Vídeo 1.3
        auth.middleware.test.js       ✅ Vídeo 1.3
        contato.service.test.js       ✅ Vídeo 2.1
        autorizar.middleware.test.js  ✅ Vídeo 2.2
      integration/
        auth.routes.test.js           ✅ Vídeo 1.4
        produto.routes.test.js        ✅ Vídeo 1.4
      helpers/
        factories.js                  ✅ Vídeo 2.4
      README.md
```

---

## ⏱️ Cronograma de Gravação Sugerido

| Sessão | Disciplina | Vídeos | Duração de gravação |
|---|---|---|---|
| 1 | Disciplina 1 | 1.1 + 1.2 | ~45 min (com edição) |
| 2 | Disciplina 1 | 1.3 + 1.4 | ~50 min (com edição) |
| 3 | Disciplina 2 | 2.1 + 2.2 | ~45 min (com IA) |
| 4 | Disciplina 2 | 2.3 + 2.4 | ~45 min (com IA) |
| 5 | Disciplina 3 | 3.1 + 3.2 | ~45 min (Pipeline CI) |
| 6 | Disciplina 3 | 3.3 + 3.4 | ~50 min (Quality Gates & PR) |

---

## 💡 Dicas de Produção

- **Fonte no VS Code:** 18–20px para código ser legível em resolução 1080p
- **Terminal:** usar fonte monospace, cor clara no tema escuro (ex: Dracula ou One Dark)
- **Resolução:** gravar em 1920×1080
- **Cada vídeo:** começar com os arquivos no estado do **final do vídeo anterior** (não reescrever do zero ao vivo — exceto quando for o ponto pedagógico do vídeo)
- **Comandos**: rodar `npm test` com `-- --verbose` para mostrar o nome de cada teste passando
