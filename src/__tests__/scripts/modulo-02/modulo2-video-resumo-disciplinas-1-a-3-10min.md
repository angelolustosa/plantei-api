# Módulo 2 — Qualidade de Software e Testes com IA
# Vídeo Geral — Aplicação Prática Integrada: Disciplinas 1 a 3 no Projeto Plantei API
**Duração estimada:** 9–10 min  
**Projeto:** `plantei-api`  
**Escopo:** Integração das Disciplinas 1 (Testes de Software), 2 (Testes com IA) e 3 (Pipelines & CI/CD) em um único vídeo objetivo de 10 minutos para aplicação direta no projeto.  
**Arquivos de referência:** `src/utils/hash.js` · `src/services/contato.service.js` · `.github/workflows/ci.yml` · `package.json`

---

## 🎬 ABERTURA (0:00 – 1:00)

**[TELA: VS Code aberto com a árvore de diretórios do projeto `plantei-api`]**

> "Fala devs, sejam muito bem-vindos! Neste vídeo nós vamos consolidar e aplicar na prática todo o núcleo do **Módulo 2: Qualidade de Software e Testes com IA** no nosso projeto real `plantei-api`."

> "Em apenas 10 minutos, nós vamos percorrer as três etapas fundamentais da engenharia moderna de qualidade:
> 1. **Disciplina 1:** Escrever testes manuais unitários e de integração confiáveis;
> 2. **Disciplina 2:** Acelerar nossa suíte e cobrir brechas usando Inteligência Artificial;
> 3. **Disciplina 3:** Automatizar a validação com uma esteira de CI/CD no GitHub Actions com Quality Gates."

> "Sem enrolação, direto no terminal e no código. Vamos nessa!"

---

## 🧱 BLOCO 1 (D1) — Estruturando Testes no `plantei-api` (1:00 – 3:30)

**[TELA: Abrir `src/utils/hash.js` e o teste em `src/__tests__/unit/hash.test.js`]**

> "Começamos pela base: para testar sem surpresas, usamos o Jest com ES Modules no `package.json`:"

```bash
npm install --save-dev jest @jest/globals supertest
```

> "Olhe o arquivo `src/utils/hash.js`, que faz o hash e a comparação de senhas dos usuários. Aplicamos o padrão **AAA — Arrange, Act, Assert**:"

```javascript
import { describe, it, expect } from '@jest/globals';
import { gerarHash, compararHash } from '../../utils/hash.js';

describe('Testes Unitários — Utilitário de Hash', () => {
  it('deve gerar hash e validar correspondência de senha', async () => {
    // 1. Arrange: Cenário
    const senha = 'PlanteiSegura@123';

    // 2. Act: Execução
    const hash = await gerarHash(senha);
    const confere = await compararHash(senha, hash);

    // 3. Assert: Validação
    expect(hash).not.toBe(senha);
    expect(confere).toBe(true);
  });
});
```

> "E para regras que dependem do Sequelize (como `auth.service.js`), isolamos o banco com `jest.fn()` para garantir testes que rodam em frações de segundo."

---

## 🤖 BLOCO 2 (D2) — IA como Copiloto de Testes e Cobertura (3:30 – 6:30)

**[TELA: Janela da IA ao lado do editor com `src/services/contato.service.js` e relatório de coverage]**

> "Agora passamos para a **Disciplina 2**: como acelerar a criação de testes sem perder o controle técnico."

> "Para serviços como o `contato.service.js`, nós instruímos a IA com contexto arquitetural estrito:
> - Stack: Node.js com ESM nativo (`import/export`);
> - Framework: Jest com `@jest/globals`;
> - Padrão: AAA e mock dos métodos do Sequelize (`findAll`, `findByPk`, `create`, `update`, `destroy`);
> - Cobertura: caminho feliz e casos de exceção."

**[TELA: Exibir o teste gerado pela IA e rodar o coverage]**

```javascript
it('deve retornar null ao tentar remover um contato inexistente', async () => {
  // Mockamos o findByPk retornando null
  Contato.findByPk.mockResolvedValue(null);

  const resultado = await contatoService.remover(999);

  expect(resultado).toBeNull();
  expect(Contato.findByPk).toHaveBeenCalledWith(999);
});
```

> "Em seguida, rodamos `npm run test:coverage`. Se o relatório HTML acusar alguma condicional ou middleware sem teste (como autorização de perfil), apontamos o trecho vermelho para a IA e ela gera o caso de borda específico em segundos."

---

## 🚀 BLOCO 3 (D3) — Esteira Automatizada com GitHub Actions (6:30 – 9:00)

**[TELA: Abrir `.github/workflows/ci.yml`]**

> "Com os testes prontos e potencializados por IA, chegamos à **Disciplina 3**: automatizar para que nada passe despercebido."

> "Criamos o arquivo `.github/workflows/ci.yml` na raiz do projeto. Ele sobe um container oficial do PostgreSQL e executa a suíte a cada push ou Pull Request:"

```yaml
name: CI Plantei API
on: [push, pull_request]

jobs:
  test:
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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_USER: postgres
          DB_PASSWORD: postgrespassword
          DB_NAME: plantei_test
          JWT_SECRET: ${{ secrets.JWT_SECRET || 'secret-ci' }}
```

> "E para fechar, configuramos o **Quality Gate** no `package.json` com `coverageThreshold`: se a cobertura de linhas ou branches cair abaixo de 70%, o Jest quebra o CI e o GitHub bloqueia o merge na branch `main`."

---

## 🏁 ENCERRAMENTO E CHECKOUT DO MÓDULO (9:00 – 10:00)

**[TELA: Tela com resumo das 3 disciplinas e o terminal verde]**

> "Vejam o ecossistema que construímos para o `plantei-api`:
> - Testes unitários e mocks confiáveis;
> - IA gerando cenários de borda e acelerando a cobertura;
> - Pipeline de CI/CD travando bugs e protegendo a branch principal."

> "Esse é o fluxo profissional que o mercado e as grandes empresas exigem de um engenheiro de software FullCycle."

> "Todos os scripts, códigos e arquivos de configuração estão na pasta `src/__tests__/scripts` do nosso repositório. Pratique no seu ambiente e nos vemos no próximo módulo!"

---

## 📋 Resumo das Fases do Vídeo

| Minuto | Disciplina | Foco Prático |
|---|---|---|
| **0:00 – 1:00** | Abertura | Visão geral da jornada de qualidade |
| **1:00 – 3:30** | Disciplina 1 | Jest, ESM, Padrão AAA e Mocks no Sequelize |
| **3:30 – 6:30** | Disciplina 2 | Prompts contextuais com IA, cobertura de branches e fixtures |
| **6:30 – 9:00** | Disciplina 3 | GitHub Actions com container PostgreSQL e Quality Gates |
| **9:00 – 10:00**| Encerramento | Consolidação do fluxo e práticas de mercado |
