# Módulo 4 — System Design e Arquitetura Escalável com IA
## Mapa Completo das Disciplinas e Vídeos de Gravação

**Carga horária total:** 24h (3 disciplinas de 8h / 2 dias cada)  
**Projeto de Referência:** `plantei-api` (Node.js, Express, Sequelize, PostgreSQL, Redis, Swagger/OpenAPI)  
**Formato das gravações:** Vídeos práticos de 9–10 minutos por disciplina (focados em arquitetura de sistemas, design patterns, documentação viva com IA e otimização de performance em alta escala) + Roteiros de apoio.

---

## 🧭 Visão Geral do Módulo 4

O Módulo 4 eleva a aplicação `plantei-api` do nível de uma API funcional para uma arquitetura enterprise de alta escala e maturidade. O foco é desenhar sistemas resilientes, acelerar a documentação técnica (Swagger/OpenAPI e C4 Model) com IA generativa e dominar técnicas avançadas de otimização de banco, cache e testes de carga.

```
                      ┌──────────────────────────────────────────────┐
                      │    MÓDULO 4: System Design & Alta Escala     │
                      └──────────────────────┬───────────────────────┘
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         ▼                                   ▼                                   ▼
┌──────────────────┐               ┌──────────────────┐                ┌──────────────────┐
│   Disciplina 1   │               │   Disciplina 2   │                │   Disciplina 3   │
│Modelagem/Maturid.│               │ Documentação/IA  │                │ Otimização/Perf. │
│(Richardson/Clean)│               │(Swagger, C4, ADR)│                │ (Cache, N+1, k6) │
└────────┬─────────┘               └────────┬─────────┘                └────────┬─────────┘
         │                                  │                                   │
         ▼                                  ▼                                   ▼
• Richardson Maturity (0 a 3)      • Swagger / OpenAPI 3.0             • Problema N+1 e EXPLAIN
• Camadas & Clean Architecture     • Extração de Schemas com IA        • Cache distribuído (Redis)
• Domain Modeling no plantei-api   • C4 Model com Mermaid              • Paginação eficiente (Cursor)
• Stateless & Escalabilidade       • ADRs (Decisões de Arquitetura)    • Testes de carga com k6
```

---

## 📦 Detalhamento das Disciplinas

### 🏗️ Disciplina 1 — Modelagem e Maturidade do Software
> **Ementa:** Estruturação de sistemas complexos com base em níveis de maturidade e boas práticas de design.  
> **Carga:** 8h (2 dias)  
> **Arquivo de Script:** `modulo4-disciplina1-video-modelagem-maturidade-10min.md`  
> **Objetivo do Vídeo:** Explicar o Modelo de Maturidade de Richardson (Níveis 0 a 3 - HATEOAS), o isolamento de camadas (Controllers, Services, Repositories/Models) e modelar relacionamentos complexos no `plantei-api` (Usuário, Perfil, Permissões, Produto e Pedidos) preparando a arquitetura para escalabilidade horizontal.

| Bloco | Tempo | Foco | Prática no `plantei-api` |
|---|---|---|---|
| Abertura | 0:00 – 1:00 | Complexidade de software sem design | O que difere uma API amadora de uma arquitetura madura |
| Parte 1 | 1:00 – 3:00 | Modelo de Maturidade de Richardson | Do RPC Nível 0 ao HATEOAS Nível 3 com verbos e status codes |
| Parte 2 | 3:00 – 5:30 | Separação Limpa de Camadas | Desacoplamento: Router ➔ Controller ➔ Service ➔ Model/ORM |
| Parte 3 | 5:30 – 7:30 | Modelagem de Domínio Relacional | Relacionamentos N:N (Perfis e Permissões) e integridade referencial |
| Parte 4 | 7:30 – 8:50 | Princípios de Escalabilidade Horizontal | Arquitetura Stateless, JWT desacoplado e 12-Factor App |
| Conclusão | 8:50 – 10:00 | Síntese e transição para Documentação | Como comunicar a arquitetura com clareza para o time |

---

### 📚 Disciplina 2 — Acelerando a Documentação com IA
> **Ementa:** Utilização de IA para geração e manutenção de documentação técnica clara e atualizada com e sem Swagger.  
> **Carga:** 8h (2 dias)  
> **Arquivo de Script:** `modulo4-disciplina2-video-documentacao-ia-swagger-10min.md`  
> **Objetivo do Vídeo:** Implementar documentação interativa Swagger/OpenAPI 3.0 no `plantei-api`, utilizar prompts de IA para extrair schemas dos models e controllers automaticamente, gerar diagramas de arquitetura C4 Model com Mermaid e manter ADRs (Architecture Decision Records) atualizados.

| Bloco | Tempo | Foco | Prática no `plantei-api` |
|---|---|---|---|
| Abertura | 0:00 – 1:00 | O drama da documentação desatualizada | Por que documentação manual morre no primeiro release |
| Parte 1 | 1:00 – 3:00 | OpenAPI 3.0 e Swagger UI no Express | Setup com `swagger-ui-express` e endpoint `/api-docs` |
| Parte 2 | 3:00 – 5:30 | IA Gerando Schemas e JSDoc em Segundos | Prompt especializado para ler controllers e models e gerar YAML/JSDoc |
| Parte 3 | 5:30 – 7:15 | Documentação Arquitetural Viva: C4 Model | Diagramas de Container e Componentes gerados com Mermaid via IA |
| Parte 4 | 7:15 – 8:50 | Architecture Decision Records (ADR) | Formalizando decisões técnicas com templates ágeis assistidos por IA |
| Conclusão | 8:50 – 10:00 | Síntese de Documentação | Como documentação viva economiza meses de onboarding |

---

### ⚡ Disciplina 3 — Otimização e Performance
> **Ementa:** Técnicas e ferramentas para melhorar o desempenho e a eficiência de sistemas em larga escala.  
> **Carga:** 8h (2 dias)  
> **Arquivo de Script:** `modulo4-disciplina3-video-otimizacao-performance-10min.md`  
> **Objetivo do Vídeo:** Diagnosticar e eliminar gargalos de performance no `plantei-api`: resolver o clássico problema N+1 no Sequelize com queries otimizadas, implementar camada de Cache distribuído com Redis, adotar paginação inteligente e executar testes de carga com k6 analisando percentis de latência (p95/p99) assistidos por IA.

| Bloco | Tempo | Foco | Prática no `plantei-api` |
|---|---|---|---|
| Abertura | 0:00 – 1:00 | Quando a aplicação precisa escalar | O impacto da latência na experiência e custo de infraestrutura |
| Parte 1 | 1:00 – 3:00 | Diagnóstico de Banco: O Problema N+1 | Como Sequelize gera queries em cascata e como corrigir com `include`/eager loading |
| Parte 2 | 3:00 – 5:15 | Cache Estratégico com Redis | Padrão Cache-Aside para listagens de produtos (`GET /produtos`) |
| Parte 3 | 5:15 – 7:00 | Paginação Eficiente e Compressão | Offset vs Cursor-based pagination e compressão Gzip |
| Parte 4 | 7:00 – 8:45 | Testes de Carga com k6 & Análise com IA | Script k6 simulando 200 usuários simultâneos e prompt de IA para tuning de p95/p99 |
| Conclusão | 8:45 – 10:00 | Encerramento do Módulo 4 e da Trilha | O desenvolvedor sênior completo: da linha de código à alta escala |

---

## 🗂️ Estrutura de Arquivos do Módulo 4

```
plantei-api/
  docs/
    openapi.json / swagger.js           ← Especificação OpenAPI 3.0
    diagrams/c4-architecture.mmd       ← Diagrama Mermaid C4 Model
    adr/001-adopcao-postgresql-redis.md ← ADR de arquitetura
  src/
    config/
      redis.js                          ← Conexão com Redis para cache
    middlewares/
      cache.middleware.js               ← Interceptor de cache Redis
    controllers/
      produto.controller.js             ← Rota otimizada com eager loading e paginação
    __tests__/
      performance/
        load-test-produtos.js           ← Script de teste de carga com k6
      scripts/
        modulo-04/
          modulo4-mapa-completo.md                        ← (Este arquivo)
          modulo4-disciplina1-video-modelagem-maturidade-10min.md
          modulo4-disciplina2-video-documentacao-ia-swagger-10min.md
          modulo4-disciplina3-video-otimizacao-performance-10min.md
```
