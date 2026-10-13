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

| # | Vídeo | Conteúdo | Ferramenta/Projeto |
|---|-------|----------|--------------------|
| 2.1 | IA para gerar testes | Usar GitHub Copilot / Kiro para gerar testes unitários a partir do código existente | Copilot + `plantei-api` |
| 2.2 | Analisando lacunas com IA | Apontar o relatório de coverage para a IA e pedir sugestões de novos casos de teste | Kiro + relatório coverage |
| 2.3 | Refatorando testes com IA | Testes frágeis vs. testes resilientes — IA ajuda a identificar e melhorar | Copilot + arquivos existentes |
| 2.4 | Geração de dados de teste | Usar IA para gerar fixtures e dados realistas para `Produto`, `Usuario`, `Contato` | Faker.js + IA |

**Status: 🔲 A implementar**

---

## 🔄 Tema 3 — Integração e Revisão com Pipelines (8h / 2 créditos)

> Construção de pipelines de CI/CD com foco em automação e inspeção de qualidade contínua.

| # | Vídeo | Conteúdo | Ferramenta/Projeto |
|---|-------|----------|--------------------|
| 3.1 | O que é CI/CD | Conceito, fluxo dev → test → build → deploy, por que automatizar | Conceitual + diagrama |
| 3.2 | GitHub Actions — primeiro workflow | Criar `.github/workflows/ci.yml` que roda `npm test` em cada push | `plantei-api` + GitHub |
| 3.3 | Quality Gates | Bloquear merge se testes falham ou coverage cai abaixo de um threshold | GitHub Actions + Jest coverage |
| 3.4 | Pipeline do front-end | Configurar CI para o `vida-verde-app`: lint + build + testes | `vida-verde-app` + GitHub Actions |

**Status: 🔲 A implementar**

---

## 🗂️ Visão Geral da Estrutura de Arquivos

```
plantei-api/
  .github/
    workflows/
      ci.yml                          ← Tema 3 (a criar)
  src/
    __tests__/
      scripts/                        ← Scripts dos vídeos
        modulo2-mapa-completo.md      ← Este arquivo
        modulo2-video1.1-*.md         ✅
        modulo2-video1.2-*.md         ✅
        modulo2-video1.3-*.md         ✅
        modulo2-video1.4-*.md         ✅
        modulo2-video2.1-*.md         🔲
        modulo2-video2.2-*.md         🔲
        modulo2-video2.3-*.md         🔲
        modulo2-video2.4-*.md         🔲
        modulo2-video3.1-*.md         🔲
        modulo2-video3.2-*.md         🔲
        modulo2-video3.3-*.md         🔲
        modulo2-video3.4-*.md         🔲
      unit/
        hash.test.js                  ✅ Vídeo 1.2
        produto.model.test.js         ✅ Vídeo 1.2
        auth.service.test.js          ✅ Vídeo 1.3
        auth.middleware.test.js       ✅ Vídeo 1.3
      integration/
        auth.routes.test.js           ✅ Vídeo 1.4
        produto.routes.test.js        ✅ Vídeo 1.4
      README.md

vida-verde-app/
  (testes e CI a adicionar no Tema 2/3)
```

---

## ⏱️ Cronograma de Gravação Sugerido

| Sessão | Vídeos | Duração de gravação |
|--------|--------|---------------------|
| 1 | 1.1 + 1.2 | ~45 min (com edição) |
| 2 | 1.3 + 1.4 | ~50 min (com edição) |
| 3 | 2.1 + 2.2 | ~45 min |
| 4 | 2.3 + 2.4 | ~45 min |
| 5 | 3.1 + 3.2 | ~45 min |
| 6 | 3.3 + 3.4 | ~50 min |

---

## 💡 Dicas de Produção

- **Fonte no VS Code:** 18–20px para código ser legível em resolução 1080p
- **Terminal:** usar fonte monospace, cor clara no tema escuro (ex: Dracula ou One Dark)
- **Resolução:** gravar em 1920×1080
- **Cada vídeo:** começar com os arquivos no estado do **final do vídeo anterior** (não reescrever do zero ao vivo — exceto quando for o ponto pedagógico do vídeo)
- **Comandos**: rodar `npm test` com `-- --verbose` para mostrar o nome de cada teste passando
