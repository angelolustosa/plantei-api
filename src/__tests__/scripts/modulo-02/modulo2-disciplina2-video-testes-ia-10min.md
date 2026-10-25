# Módulo 2 — Qualidade de Software e Testes com IA
# Disciplina 2 — Testes Automatizados com IA: Do Prompt ao Código Resiliente no Projeto
**Duração estimada:** 9–10 min  
**Projeto:** `plantei-api`  
**Arquivos de referência:** `src/services/contato.service.js` · `src/middlewares/autorizar.middleware.js` · `src/__tests__/helpers/factories.js`  
**Objetivo:** Aplicar ferramentas de Inteligência Artificial para gerar testes unitários contextualizados, cobrir lacunas apontadas pelo relatório de cobertura e criar dados sintéticos no projeto `plantei-api` em até 10 minutos.

---

## 🎬 ABERTURA (0:00 – 1:00)

**[TELA: Professor no VS Code com chat da IA aberto ao lado do código]**

> "Fala devs! Bem-vindos à **Disciplina 2: Testes Automatizados com IA**."

> "Escrever testes manualmente para dezenas de models, services e middlewares consome muito tempo. É por isso que desenvolvedores de alta performance usam Inteligência Artificial como copiloto."

> "Mas atenção: se você pedir apenas *'Crie testes para este arquivo'*, a IA vai alucinar sintaxe CommonJS em projetos ESM, criar asserções frágeis ou inventar métodos que o Sequelize não tem."

> "Hoje vamos aprender a técnica certa: como fornecer contexto arquitetural, analisar lacunas de cobertura e transformar a IA em uma máquina de gerar testes robustos para o nosso `plantei-api` em menos de 10 minutos."

---

## 🧠 PARTE 1 — A Anatomia do Prompt Contextual para Testes (1:00 – 2:45)

**[TELA: Editor exibindo o arquivo de prompt ou template markdown]**

> "A qualidade do teste gerado pela IA é diretamente proporcional à qualidade do contexto que você entrega. Um prompt profissional precisa de 5 pilares:"

```markdown
1. PAPEL: "Você é um Engenheiro de QA Sênior especialista em Node.js e Jest."
2. STACK & ARQUITETURA: "Projeto com ESM nativo ("type": "module"), imports de '@jest/globals'."
3. ALVO & ESCOPO: "Crie testes unitários para o service anexo, sem tocar no banco de dados real."
4. PADRÃO & MOCKS: "Use o padrão AAA (Arrange, Act, Assert) e mocke os métodos do Sequelize (findAll, findByPk, create, update, destroy)."
5. CENÁRIOS: "Cubra caminho feliz e caminhos de exceção (registro não encontrado, payload inválido)."
```

> "Com essa instrução, a IA não precisa adivinhar seu ambiente: ela gera exatamente o padrão do seu repositório."

---

## ⚡ PARTE 2 — Gerando a Suíte de `contato.service.js` (2:45 – 5:00)

**[TELA: VS Code com `src/services/contato.service.js` aberto e executando a geração]**

> "Vamos abrir o `src/services/contato.service.js`. Ele gerencia os contatos da nossa loja de plantas e precisa de cobertura completa para os métodos `listar`, `buscarPorId`, `criar`, `atualizar` e `remover`."

> "Passamos o arquivo e nosso prompt contextual para a IA. Veja o código de teste unitário que ela produz:"

```javascript
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import contatoService from '../../services/contato.service.js';
import { Contato } from '../../models/Contato.js';

// Mock do model Sequelize
jest.mock('../../models/Contato.js', () => ({
  Contato: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  }
}));

describe('ContatoService (Testes gerados com IA)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar null ao tentar atualizar contato inexistente', async () => {
    // Arrange: simulamos que findByPk não achou o registro
    Contato.findByPk.mockResolvedValue(null);

    // Act
    const resultado = await contatoService.atualizar(999, { nome: 'Novo Nome' });

    // Assert
    expect(resultado).toBeNull();
    expect(Contato.findByPk).toHaveBeenCalledWith(999);
  });
});
```

> "Perceba a precisão: a IA gerou o mock em ESM com `jest.mock`, limpou os mocks no `beforeEach` e cobriu o caso de exceção onde o ID não existe."

---

## 🎯 PARTE 3 — Analisando Lacunas com o Relatório de Cobertura (5:00 – 7:15)

**[TELA: Navegador com `coverage/lcov-report/src/middlewares/autorizar.middleware.js.html`]**

> "Agora vamos usar a IA para o que ela faz de melhor: **encontrar o que esquecemos de testar**."

> "Abrindo o relatório HTML de cobertura do `autorizar.middleware.js`, vemos uma linha vermelha em destaque: o `if (!papeisPermitidos.includes(req.user.papel))` não tem teste para o cenário onde `req.user` é nulo ou indefinido!"

> "Copiamos o trecho e fazemos o prompt reverso para a IA:"

> *"IA, baseado nesta função de middleware e no relatório de cobertura em anexo, identifique as branches não testadas e escreva os testes para os cenários de falha de autorização."*

**[TELA: Adicionando o teste sugerido no arquivo]**

```javascript
it('deve retornar 403 se o papel do usuário não estiver na lista permitida', () => {
  const req = { user: { id: 1, papel: 'CLIENTE' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  const middleware = autorizar(['ADMIN']);
  middleware(req, res, next);

  expect(res.status).toHaveBeenCalledWith(403);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    mensagem: 'Acesso negado: permissão insuficiente'
  }));
  expect(next).not.toHaveBeenCalled();
});
```

> "Em 30 segundos preenchemos uma vulnerabilidade de segurança que passaria batida sem análise de branches."

---

## 🎲 PARTE 4 — Geração de Fixtures e Dados Realistas com IA (7:15 – 8:45)

**[TELA: Abrir `src/__tests__/helpers/factories.js`]**

> "Outro gargalo clássico: testes que quebram porque usam e-mails fixos como `'teste@email.com'` e colidem com constraints `UNIQUE` do banco."

> "Pedimos à IA para estruturar um gerador de fixtures no arquivo `src/__tests__/helpers/factories.js`:"

```javascript
// src/__tests__/helpers/factories.js
export const criarDadosUsuarioSintetico = (overrides = {}) => {
  const timestamp = Date.now();
  return {
    nome: 'Usuário Sintético IA',
    email: `dev_${timestamp}_${Math.floor(Math.random() * 1000)}@plantei.com`,
    senha: 'SenhaForte@2026',
    papel: 'CLIENTE',
    ...overrides,
  };
};
```

> "Agora qualquer teste de integração gera dados válidos, isolados e sem risco de colisão de chave única."

---

## 🏁 ENCERRAMENTO E DIRETRIZES DE OURO (8:45 – 10:00)

**[TELA: Slide de boas práticas com IA no desenvolvimento]**

> "Resumo da nossa aula em 4 diretrizes de ouro:
> 1. **Você é o piloto:** a IA propõe o código, mas a responsabilidade técnica e a validação lógica são suas.
> 2. **Evite testes tautológicos:** desconfie de testes que testam apenas o mock em vez do comportamento do sistema.
> 3. **Use o Coverage como guia:** use a IA para fechar as linhas e branches vermelhas do seu relatório.
> 4. **Padronize:** estabeleça prompts com o padrão da sua equipe."

> "No próximo vídeo — **Disciplina 3: Integração e Revisão com Pipelines** — vamos garantir que nenhum desenvolvedor consiga subir código que quebre esses testes, configurando o GitHub Actions com Quality Gates automáticos."

> "Curtiu? Deixe seu código rodando redondo e nos vemos na esteira de CI/CD!"

---

## 📋 Check-list de Gravação

- [ ] Arquivo `src/services/contato.service.js` aberto para demonstrar
- [ ] Relatório de cobertura HTML gerado em `coverage/lcov-report/`
- [ ] Prompt contextual pré-salvo para copiar e colar rapidamente
- [ ] Terminal com execução de `npm test` confirmando novos testes verdes

## 🔑 Conceitos-Chave da Disciplina 2

- **Context Injection:** Alimentar a LLM com stack exata, ESM e convenções de teste.
- **Detecção de Branches:** Usar IA para cobrir caminhos de erro que desenvolvedores costumam ignorar.
- **Testes Tautológicos vs Resilientes:** Testes devem validar contratos reais de negócio e não apenas espelhar implementações frouxas.
- **Fixtures Sintéticas:** Dados dinâmicos para testes de integração determinísticos.
