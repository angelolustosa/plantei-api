# Módulo 3 — DevOps Inteligente e Integração Contínua
## Mapa Completo das Disciplinas e Vídeos de Gravação

**Carga horária total:** 24h (3 disciplinas de 8h / 2 dias cada)  
**Projeto de Referência:** `plantei-api` (Node.js, Express, Sequelize, PostgreSQL, Docker, Jest)  
**Formato das gravações:** Vídeos dinâmicos de 9–10 minutos por disciplina (focados em demonstração prática, arquitetura e uso aplicado de IA) + Roteiros de apoio.

---

## 🧭 Visão Geral do Módulo 3

O Módulo 3 consolida a transição da qualidade e testes locais (Módulo 2) para a entrega automatizada, ambientes seguros e observabilidade inteligente em produção. Utiliza a API `plantei-api` como laboratório prático para aplicar a cultura DevOps e técnicas modernas de IA generativa no ciclo operacional.

```
                      ┌──────────────────────────────────────────────┐
                      │    MÓDULO 3: DevOps Inteligente & CI/CD      │
                      └──────────────────────┬───────────────────────┘
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         ▼                                   ▼                                   ▼
┌──────────────────┐               ┌──────────────────┐                ┌──────────────────┐
│   Disciplina 1   │               │   Disciplina 2   │                │   Disciplina 3   │
│ Cultura DevOps   │               │Ambientes Seguros │                │Observabilidade/IA│
│ (Mindset & Auto) │               │ (Docker/Secrets) │                │ (Logs, APM, RCA) │
└────────┬─────────┘               └────────┬─────────┘                └────────┬─────────┘
         │                                  │                                   │
         ▼                                  ▼                                   ▼
• Os Três Caminhos                 • Multi-Stage Dockerfile            • Logs estruturados (Winston)
• CALMS Framework                  • Docker Compose dev/prod           • Healthcheck & Probes
• Shift-Left de Segurança          • Gestão de Segredos & .env         • Prometheus / Métricas
• Git Hooks & Automação            • Scan de Vulnerabilidades (Trivy)  • Análise de Incidentes com IA
```

---

## 📦 Detalhamento das Disciplinas

### 🚀 Disciplina 1 — Cultura de DevOps
> **Ementa:** Conceitos, práticas e mindset colaborativo para integração entre desenvolvimento e operações.  
> **Carga:** 8h (2 dias)  
> **Arquivo de Script:** `modulo3-disciplina1-video-cultura-devops-10min.md`  
> **Objetivo do Vídeo:** Explicar a evolução da cultura DevOps, o framework CALMS e os Três Caminhos, aplicando automações locais (Git hooks com Husky/lint-staged, automação de PRs e padronização de commits) no repositório `plantei-api`.

| Bloco | Tempo | Foco | Prática no `plantei-api` |
|---|---|---|---|
| Abertura | 0:00 – 1:00 | Quebra do muro Dev vs Ops | O custo da falta de comunicação e deploys manuais |
| Parte 1 | 1:00 – 2:45 | Fundamentos da Cultura DevOps | CALMS, Três Caminhos e Shift-Left |
| Parte 2 | 2:45 – 5:00 | Automação Local e Prevenção de Erros | Configuração de Git hooks (linting e testes pré-commit) |
| Parte 3 | 5:00 – 7:30 | Fluxo de Trabalho Colaborativo e Trunk-Based | Branching strategies, automação de Pull Requests e IA como revisora |
| Parte 4 | 7:30 – 9:00 | Métricas DORA no ciclo da equipe | Deployment Frequency, Lead Time, MTTR, Change Failure Rate |
| Conclusão | 9:00 – 10:00 | Recap e transição para Ambientes | Checklist do time DevOps |

---

### 🛡️ Disciplina 2 — Gestão de Ambientes Seguros
> **Ementa:** Configuração e manutenção de ambientes com foco em segurança, versionamento e escalabilidade.  
> **Carga:** 8h (2 dias)  
> **Arquivo de Script:** `modulo3-disciplina2-video-ambientes-seguros-10min.md`  
> **Objetivo do Vídeo:** Empacotar o `plantei-api` em container Docker multi-stage seguro (usuário non-root, imagem Alpine mínima), orquestrar banco PostgreSQL via Docker Compose para múltiplos ambientes (dev/prod), blindar credenciais e auditar vulnerabilidades com Trivy/npm audit em até 10 minutos.

| Bloco | Tempo | Foco | Prática no `plantei-api` |
|---|---|---|---|
| Abertura | 0:00 – 1:00 | O risco de ambientes inconsistentes | De "funciona na minha máquina" para paridade Dev/Prod |
| Parte 1 | 1:00 – 3:00 | Dockerfile Multi-Stage Otimizado & Seguro | Build limpo, sem dependências de dev, usuário sem privilégios root |
| Parte 2 | 3:00 – 5:15 | Paridade de Ambientes com Docker Compose | `docker-compose.yml` para desenvolvimento com PostgreSQL persistente |
| Parte 3 | 5:15 – 7:15 | Gestão Segura de Variáveis e Segredos | Segregação `.env.example`, `.env`, GitHub Secrets e boas práticas OWASP |
| Parte 4 | 7:15 – 8:45 | Análise Automatizada de Vulnerabilidades | `npm audit` e varredura de imagem com Trivy / Snyk |
| Conclusão | 8:45 – 10:00 | Recap e preparação para Produção | Próxima etapa: monitorar a aplicação rodando |

---

### 📊 Disciplina 3 — Observabilidade e uso da IA
> **Ementa:** Monitoramento inteligente com logs, métricas e análise de performance assistida por IA.  
> **Carga:** 8h (2 dias)  
> **Arquivo de Script:** `modulo3-disciplina3-video-observabilidade-ia-10min.md`  
> **Objetivo do Vídeo:** Implementar os 3 pilares da observabilidade no `plantei-api` (logs estruturados JSON com Winston, métricas de saúde com `/health` e latência), e demonstrar como usar IA generativa para triagem de logs em tempo real, Root Cause Analysis (RCA) e diagnósticos preditivos de incidentes.

| Bloco | Tempo | Foco | Prática no `plantei-api` |
|---|---|---|---|
| Abertura | 0:00 – 1:00 | De Telemetria Passiva a Observabilidade Proativa | Por que apenas olhar logs em console não resolve falhas críticas |
| Parte 1 | 1:00 – 3:00 | Os Três Pilares: Logs, Métricas e Tracing | Conceituação prática aplicada a microsserviços e APIs Express |
| Parte 2 | 3:00 – 5:15 | Logs Estruturados no `plantei-api` | Winston com formato JSON, rotação e correlation ID |
| Parte 3 | 5:15 – 7:00 | Healthchecks Avançados (Liveness e Readiness) | Endpoint `/health` inspecionando conexão Sequelize e memória |
| Parte 4 | 7:00 – 8:45 | IA para Análise de Incidentes & RCA | Prompt de diagnóstico de stack trace e geração de post-mortem automatizado |
| Conclusão | 8:45 – 10:00 | Fechamento do Módulo 3 | Síntese de DevOps + Observabilidade rumo ao System Design (Módulo 4) |

---

## 🗂️ Estrutura de Arquivos do Módulo 3

```
plantei-api/
  Dockerfile                            ← Multi-stage build seguro
  docker-compose.yml                    ← Orquestração dev/test com PostgreSQL
  .env.example                          ← Dicionário de variáveis documentadas
  src/
    utils/
      logger.js                         ← Winston com logs estruturados
    controllers/
      health.controller.js              ← Healthcheck profundo (DB + Uptime)
    routes/
      health.routes.js                  ← Rota /health exposta
    __tests__/
      scripts/
        modulo-03/
          modulo3-mapa-completo.md                        ← (Este arquivo)
          modulo3-disciplina1-video-cultura-devops-10min.md
          modulo3-disciplina2-video-ambientes-seguros-10min.md
          modulo3-disciplina3-video-observabilidade-ia-10min.md
```
