# Módulo 1 — Engenharia de Software e IA Aplicada
# Disciplina 3 — IA como Assistente: Refatoração, Code Review e Geração de Código sem Alucinações
**Duração estimada:** 9–10 min  
**Projeto:** `plantei-api`  
**Arquivos de referência:** `src/controllers/contato.controller.js` · `src/services/contato.service.js` · `src/utils/ip.js`  
**Objetivo:** Dominar a utilização prática de Inteligência Artificial generativa no ciclo de desenvolvimento do `plantei-api`, formulando prompts com contexto e restrições arquiteturais para realizar refatoração de código, identificação de code smells e code review automatizado com zero alucinações em até 10 minutos.

---

## 🎬 ABERTURA (0:00 – 1:00)

**[TELA: Editor VS Code com interface de chat de IA (Copilot / Claude / ChatGPT) aberta ao lado do código]**

> "Fala devs, sejam muito bem-vindos à **Disciplina 3: IA como Assistente**!"

> "Nós estamos vivendo a maior revolução na história da engenharia de software. Hoje, programadores que sabem usar Inteligência Artificial como assistente produzem com o dobro de velocidade e com muito mais qualidade do que aqueles que apenas digitam código caractere por caractere."

> "Mas atenção: usar IA não significa copiar e colar cegamente qualquer resposta. Se você apenas pedir *'faça uma função que busca contatos'*, a IA pode alucinar métodos obsoletos, usar sintaxe CommonJS com `require` em um projeto ESM nativo, ou introduzir brechas graves de segurança."

> "Nesta aula de 10 minutos, nós vamos aprender como transformar a IA em um verdadeiro engenheiro de software parceiro: vamos dominar a anatomia do prompt profissional, refatorar código legado no `plantei-api` e rodar um code review automatizado de altíssimo nível."

---

## 🧠 PARTE 1 — A Anatomia do Prompt Profissional para Engenharia (1:00 – 3:00)

**[TELA: Editor exibindo o framework de prompt em Markdown]**

> "Para que a Inteligência Artificial gere código impecável e alinhado ao seu repositório, você precisa fornecer **Contexto, Papel e Restrições Arquiteturais**."

> "No `plantei-api`, nós usamos o framework dos 4 pilares:"

```text
┌─────────────────────────────────────────────────────────────┐
│               ANATOMIA DO PROMPT PROFISSIONAL               │
├─────────────┬───────────────────────────────────────────────┤
│ 1. PAPEL    │ "Você é um Engenheiro de Software Sênior      │
│             │ especialista em Node.js e Clean Architecture."│
├─────────────┼───────────────────────────────────────────────┤
│ 2. CONTEXTO │ "Projeto plantei-api: Node.js 20, Express,    │
│             │ Sequelize ORM, PostgreSQL e Jest."            │
├─────────────┼───────────────────────────────────────────────┤
│ 3. RESTRIÇÃO│ "PROIBIDO CommonJS (require). Use ES Modules  │
│             │ nativo (import/export). Respeite SOLID e DRY."│
├─────────────┼───────────────────────────────────────────────┤
│ 4. TAREFA   │ "Refatore a função anexa extraindo a lógica de│
│             │ negócio para um Service desacoplado."         │
└─────────────┴───────────────────────────────────────────────┘
```

> "Com essas 4 diretrizes, você elimina 99% das alucinações mais comuns em projetos modernos de Node.js."

---

## 🛠️ PARTE 2 — Refatorando Código Legado com IA (3:00 – 5:30)

**[TELA: Abrir uma versão antiga ou monolítica de `contato.controller.js` e passar para a IA refatorar]**

> "Vamos ver isso em ação. Imaginem que recebemos este controller com código duplicado e regras de validação misturadas com persistência de dados:"

```javascript
// CÓDIGO BRUTO ANTES DA IA:
export const enviarMensagem = async (req, res) => {
  const { nome, email, mensagem } = req.body;
  if (!nome || !email || !mensagem) {
    return res.status(400).send("Campos obrigatórios faltando");
  }
  if (!email.includes("@")) {
    return res.status(400).send("Email inválido");
  }
  const novo = await Contato.create({ nome, email, mensagem });
  return res.json(novo);
};
```

> "Passamos esse trecho para a IA com nosso prompt contextual pedindo refatoração para Clean Architecture."

**[TELA: Mostrar a resposta gerada pela IA separando Controller, Service e DTO]**

> "Vejam o resultado produzido pela IA em segundos:"
> 1. Ela cria o `contato.service.js` com a regra pura de validação e criação:

```javascript
// src/services/contato.service.js (Gerado com IA)
import { Contato } from '../models/Contato.js';

class ContatoService {
  async criar({ nome, email, mensagem }) {
    if (!nome || !email || !mensagem) {
      const error = new Error('Todos os campos são obrigatórios');
      error.statusCode = 400;
      throw error;
    }
    return Contato.create({ nome, email, mensagem });
  }
}

export default new ContatoService();
```

> 2. E deixa o controller com apenas 4 linhas delegando a execução e tratando erros pelo middleware global. O código ficou limpo, legível e 100% testável!

---

## 🔍 PARTE 3 — Code Review Automatizado com IA (5:30 – 7:30)

**[TELA: Terminal ou editor com um arquivo que possui um bug de concorrência ou brecha de segurança sendo inspecionado pela IA]**

> "Outra aplicação fantástica da IA é atuar como **primeira linha de Code Review**. Antes de solicitar a revisão de um colega do time, passamos o código por um prompt de auditoria de qualidade:"

```markdown
Prompt de Code Review com IA:
"Revise o arquivo src/utils/ip.js e o controller anexo sob as seguintes lentes:
1. SEGURANÇA: Há riscos de Injection, vazamento de headers ou dados sensíveis?
2. RESILIÊNCIA: Existem tratamentos adequados para casos nulos ou indefinidos?
3. PERFORMANCE: Há chamadas assíncronas em loops que deveriam usar Promise.all?
Aponte os pontos críticos encontrados e forneça a correção recomendada."
```

**[TELA: Mostrar o relatório gerado pela IA identificando melhorias reais]**

> "A IA atua como um par de olhos incansável: ela aponta, por exemplo, que se o cabeçalho `x-forwarded-for` vier nulo, uma função de extração de IP poderia lançar uma exceção não tratada."

> "Com esse feedback imediato, corrigimos o problema antes mesmo de subir o código para o repositório compartilhado."

---

## ⚡ PARTE 4 — Geração Rápida de Utilitários e Factories (7:30 – 8:50)

**[TELA: Editor exibindo a criação de geradores de dados ou utilitários auxiliares]**

> "A IA também brilha acelerando a criação de código utilitário repetitivo, como geradores de dados sintéticos para testes e formatadores de datas."

> "Em vez de gastar 20 minutos escrevendo regex e funções utilitárias na mão, você pede à IA com restrições claras, revisa a implementação e roda os testes correspondentes."

> "O segredo do engenheiro de alta performance não é deixar a IA programar sozinha, mas sim ser o **piloto que orienta, valida e garante a conformidade arquitetural**."

---

## 🎯 CONCLUSÃO E ENCERRAMENTO DO MÓDULO 1 (8:50 – 10:00)

**[TELA: Professor em destaque com resumo dos 3 temas do Módulo 1]**

> "Parabéns por concluir o **Módulo 1: Engenharia de Software e IA Aplicada**!"

> "Vejam o salto que demos juntos no `plantei-api`:"
> - Na **Disciplina 1**, montamos um ambiente profissional e reproduzível com Docker, Node 20 e Git.
> - Na **Disciplina 2**, dominamos os fundamentos do SOLID, Clean Architecture e tratamento centralizado de erros.
> - E aqui na **Disciplina 3**, transformamos a Inteligência Artificial em um poderoso copiloto para refatoração e revisão de código.

> "Com essa base sólida construída, você está mais do que preparado para o próximo grande desafio: garantir que esse código nunca quebre."

> "No **Módulo 2: Qualidade de Software e Testes com IA**, nós vamos entrar de cabeça na Pirâmide de Testes, mocks, testes de integração com banco real e automação com GitHub Actions."

> "Te espero lá e bons códigos!"

---

## 📋 CHECKLIST RÁPIDO DO GRAVADOR

- [ ] **0:00** Abertura abordando a revolução da IA e o perigo de alucinações sem contexto.
- [ ] **1:00** Apresentar a anatomia do prompt profissional (Papel, Contexto, Restrição, Tarefa).
- [ ] **3:00** Demonstrar a refatoração do `contato.controller.js` com a IA gerando `contato.service.js`.
- [ ] **5:30** Executar o prompt de Code Review automatizado focado em segurança e resiliência.
- [ ] **7:30** Explicar a geração de utilitários e reforçar o papel do desenvolvedor como piloto.
- [ ] **8:50** Concluir o Módulo 1 com retrospectiva e convite para o Módulo 2 (Qualidade e Testes).

