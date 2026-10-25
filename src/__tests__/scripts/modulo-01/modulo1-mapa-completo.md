# Módulo 1 — Engenharia de Software e IA Aplicada
## Mapa Completo das Disciplinas e Vídeos de Gravação

**Carga horária total:** 24h (3 disciplinas de 8h / 2 dias cada)  
**Projeto de Referência:** `plantei-api` (Node.js 20, Express, Sequelize, PostgreSQL, Docker, Git)  
**Formato das gravações:** Vídeos práticos de 9–10 minutos por disciplina (focados em configuração real, princípios fundamentais de engenharia de software e aceleração de desenvolvimento com IA) + Roteiros de apoio.

---

## 🧭 Visão Geral do Módulo 1

O Módulo 1 estabelece as bases técnicas, conceituais e operacionais para toda a jornada de formação. O foco é nivelar o ambiente com Docker e ferramentas modernas, consolidar os princípios de POO, SOLID e Clean Code no código do `plantei-api`, e introduzir a Inteligência Artificial como assistente de engenharia de software de alta produtividade (refatoração, revisão e geração de código).

```
                      ┌──────────────────────────────────────────────┐
                      │ MÓDULO 1: Engenharia de Software & IA Aplic. │
                      └──────────────────────┬───────────────────────┘
                                             │
         ┌───────────────────────────────────┼───────────────────────────────────┐
         ▼                                   ▼                                   ▼
┌──────────────────┐               ┌──────────────────┐                ┌──────────────────┐
│   Disciplina 1   │               │   Disciplina 2   │                │   Disciplina 3   │
│Onboarding Técnico│               │ Engenharia Limpa │                │ IA como          │
│ (Ambiente/Docker)│               │  (POO & SOLID)   │                │ Assistente       │
└────────┬─────────┘               └────────┬─────────┘                └────────┬─────────┘
         │                                  │                                   │
         ▼                                  ▼                                   ▼
• Setup Node 20 & Git              • Princípios SOLID na prática       • Engenharia de Prompts
• Docker para Devs                 • Clean Architecture em Express     • Refatoração guiada por IA
• Configuração .env e DB           • Tratamento Limpo de Erros         • Code Review com IA
• Execução e Seed do plantei-api   • Separation of Concerns (SoC)      • Geração sem Alucinações
```

---

## 📦 Detalhamento das Disciplinas

### 💻 Disciplina 1 — Onboarding Técnico
> **Ementa:** Configuração de ambiente com Docker, ferramentas e práticas modernas de versionamento e colaboração.  
> **Carga:** 8h (2 dias)  
> **Arquivo de Script:** `modulo1-disciplina1-video-onboarding-tecnico-10min.md`  
> **Objetivo do Vídeo:** Configurar do zero a estação de trabalho para o `plantei-api`: validar Node.js 20 LTS, clonar repositório, subir banco de dados PostgreSQL isolado com Docker, rodar migrações/seeds e executar a API com sucesso em até 10 minutos.

| Bloco | Tempo | Foco | Prática no `plantei-api` |
|---|---|---|---|
| Abertura | 0:00 – 1:00 | Boas-vindas e objetivo do Onboarding | O custo de onboarding manual vs setup automatizado |
| Parte 1 | 1:00 – 2:45 | Ferramental Essencial e Versionamento | Node.js 20 LTS, Git, Conventional Commits e boas práticas |
| Parte 2 | 2:45 – 5:15 | Subindo o PostgreSQL via Docker | `docker run` / Docker Compose para banco efêmero e persistente |
| Parte 3 | 5:15 – 7:30 | Configuração do `.env` e Dependências | Clonagem, `npm install`, cópia do `.env.example` e variáveis |
| Parte 4 | 7:30 – 8:50 | Execução, Seed e Primeiro Request | `npm run dev`, população de dados de semente e teste no `/api/health` |
| Conclusão | 8:50 – 10:00 | Checklist do Aluno e Próximos Passos | Ambiente 100% pronto para a Disciplina 2 (Engenharia Limpa) |

---

### 🧼 Disciplina 2 — Revisão de Engenharia Limpa
> **Ementa:** Revisita aos princípios da POO, SOLID, arquitetura limpa e aplicabilidade em projetos reais.  
> **Carga:** 8h (2 dias)  
> **Arquivo de Script:** `modulo1-disciplina2-video-engenharia-limpa-solid-10min.md`  
> **Objetivo do Vídeo:** Revisitar os princípios de Orientação a Objetos, o acrônimo SOLID e Clean Code aplicando refatorações práticas no código do `plantei-api`, eliminando acoplamentos indevidos e isolando regras de negócio em camadas previsíveis.

| Bloco | Tempo | Foco | Prática no `plantei-api` |
|---|---|---|---|
| Abertura | 0:00 – 1:00 | O que é código limpo na vida real | Por que código que "só funciona" vira débito técnico |
| Parte 1 | 1:00 – 3:15 | SOLID no JavaScript Moderno (ESM) | Single Responsibility e Dependency Inversion nos Services |
| Parte 2 | 3:15 – 5:30 | Clean Architecture no Express | Camadas estritas: Controller não faz query de banco |
| Parte 3 | 5:30 – 7:30 | Tratamento Centralizado de Erros | `error.middleware.js`, AppError customizado e eliminação de try/catch duplicados |
| Parte 4 | 7:30 – 8:50 | DRY e Nomenclatura Semântica | Funções pequenas, parâmetros claros e ausência de efeitos colaterais |
| Conclusão | 8:50 – 10:00 | Síntese de Engenharia Limpa | Código legível e testável, pronto para receber IA |

---

### 🤖 Disciplina 3 — IA como Assistente
> **Ementa:** Uso prático da inteligência artificial para refatoração, code review e geração de código.  
> **Carga:** 8h (2 dias)  
> **Arquivo de Script:** `modulo1-disciplina3-video-ia-como-assistente-10min.md`  
> **Objetivo do Vídeo:** Dominar o uso de ferramentas de IA (GitHub Copilot, ChatGPT, Claude, Gemini) como copiloto de desenvolvimento no `plantei-api`: aplicar prompts com contexto arquitetural, refatorar código legado, identificar code smells e realizar code review automatizado com zero alucinações em até 10 minutos.

| Bloco | Tempo | Foco | Prática no `plantei-api` |
|---|---|---|---|
| Abertura | 0:00 – 1:00 | A revolução do desenvolvedor assistido por IA | Da digitação mecânica para a arquitetura com copiloto |
| Parte 1 | 1:00 – 3:00 | Anatomia do Prompt Eficaz (Context + Constraints) | Como evitar alucinações de CommonJS em projetos ESM |
| Parte 2 | 3:00 – 5:15 | Refatoração Inteligente de Código | Refatorar controller poluído com IA extraindo service e DTO |
| Parte 3 | 5:15 – 7:15 | Code Review Automatizado com IA | Prompt para detectar brechas de segurança, falta de validação e code smells |
| Parte 4 | 7:15 – 8:45 | Geração de Código e Boas Práticas | Criação de utilitários e validações mantendo estilo do repositório |
| Conclusão | 8:45 – 10:00 | Conclusão do Módulo 1 | O engenheiro 10x: união de fundamentos sólidos com IA aplicada |

---

## 🗂️ Estrutura de Arquivos do Módulo 1

```
src/
  __tests__/
    scripts/
      modulo-01/
        modulo1-mapa-completo.md                        ← (Este arquivo)
        modulo1-disciplina1-video-onboarding-tecnico-10min.md
        modulo1-disciplina2-video-engenharia-limpa-solid-10min.md
        modulo1-disciplina3-video-ia-como-assistente-10min.md
```

