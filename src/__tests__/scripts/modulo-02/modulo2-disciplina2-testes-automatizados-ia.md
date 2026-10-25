# Módulo 2 — Qualidade de Software e Testes com IA
# Disciplina 2 — Testes Automatizados com IA: Roteiro Completo de Gravação
> **Aplicação de ferramentas de IA para geração, análise e otimização de testes automatizados no projeto `plantei-api`.**  
> **Carga Horária:** 8 horas (4 blocos de vídeo de ~10 a 12 minutos cada)  
> **Repositório:** `plantei-api` (Branch: `gt_m2_d1`)  
> **Stack:** Node.js (ESM), Express, Sequelize (PostgreSQL), Jest (`@jest/globals`), Supertest, GitHub Copilot / LLM de assistência.

---

## 🗺️ Visão Geral da Disciplina 2

| Bloco | Título do Vídeo | Foco Prático no `plantei-api` | Arquivos Envolvidos |
|---|---|---|---|
| **2.1** | **IA Generativa na Prática: Criação de Testes Unitários e Mocking** | Geração guiada por prompt de testes para services sem cobertura | `src/services/contato.service.js` · `src/__tests__/unit/contato.service.test.js` |
| **2.2** | **Análise de Lacunas de Cobertura e Casos de Borda com IA** | Interpretação de relatório Jest de cobertura e geração de testes para falhas e branches | `src/middlewares/autorizar.middleware.js` · `src/__tests__/unit/autorizar.middleware.test.js` |
| **2.3** | **Refatorando e Endurecendo Testes com IA: Do Frágil ao Resiliente** | Eliminação de over-mocking, refatoração de asserções fracas e prevenção de testes flaky | `src/__tests__/unit/auth.service.test.js` |
| **2.4** | **Geração Inteligente de Dados Sintéticos e Fixtures com IA** | Criação de fábricas inteligentes com Faker/IA para evitar colisões de dados UNIQUE | `src/__tests__/helpers/factories.js` · `src/__tests__/integration/contato.routes.test.js` |

---

# 🎬 VÍDEO 2.1 — IA Generativa na Prática: Criação de Testes Unitários e Mocking Inteligente
**Duração estimada:** 10–12 min  
**Objetivo:** Ensinar como usar ferramentas de IA (GitHub Copilot, ChatGPT/Claude) com **Prompt Engineering contextual** para gerar suítes de testes unitários em Node.js com ES Modules, isolando o Sequelize com mocks precisos.

---

### 0:00 – 1:00 | Abertura e Alinhamento
**[TELA: Professor na webcam ou tela dividida com o VS Code aberto no `plantei-api`]**

> "Fala devs, sejam muito bem-vindos à Disciplina 2 do nosso Módulo de Qualidade de Software! Na disciplina anterior, a gente entendeu os fundamentos da pirâmide de testes e construiu nossos primeiros testes na mão, linha por linha."
>
> "Agora, vamos dar um salto de produtividade: como usar Inteligência Artificial para gerar testes automatizados de verdade — não códigos genéricos que quebram na primeira execução, mas testes limpos, no padrão AAA, respeitando a arquitetura do nosso projeto `plantei-api`."
>
> "Hoje vamos olhar para um service real do nosso sistema que ainda não tem cobertura: o `contato.service.js`. Vamos construir os prompts certos, analisar o código que a IA gera e aprender a identificar alucinações de mocks."

---

### 1:00 – 3:30 | O Desafio do Contexto: Por que a IA erra testes sem orientação?
**[TELA: Abrir o arquivo `src/services/contato.service.js` no VS Code]**

> "Dá uma olhada no `src/services/contato.service.js`. Ele é um CRUD com 5 métodos: `listar`, `buscarPorId`, `criar`, `atualizar` e `remover`. Todos interagem com o model `Contato` do Sequelize."

```javascript
// src/services/contato.service.js
import { Contato } from '../models/Contato.js';

class ContatoService {
  listar() {
    return Contato.findAll();
  }

  buscarPorId(id) {
    return Contato.findByPk(id);
  }

  criar(payload) {
    return Contato.create(payload);
  }

  async atualizar(id, payload) {
    const contato = await Contato.findByPk(id);
    if (!contato) return null;

    await contato.update(payload);
    return contato;
  }

  async remover(id) {
    const contato = await Contato.findByPk(id);
    if (!contato) return null;

    await contato.destroy();
    return true;
  }
}

export default new ContatoService();
```

> "Se você simplesmente abrir o Copilot Chat e digitar 'Crie testes para esse arquivo', você vai receber um código com três problemas graves:
> 1. Ele vai tentar usar sintaxe CommonJS (`require`), enquanto nosso projeto usa `"type": "module"` (ESM).
> 2. Ele vai importar `jest` globalmente sem `@jest/globals`.
> 3. Ele não vai saber como mockar métodos encadeados do Sequelize, como o `contato.update()` e `contato.destroy()`."
>
> "Para a IA trabalhar a nosso favor, nós precisamos fornecer **Regras de Contexto** (System Prompt / Context Injection)."

---

### 3:30 – 6:30 | Estruturando o Prompt Perfeito de Testes
**[TELA: Abrir janela de chat da IA ou arquivo de rascunho com o Prompt]**

> "Vejam a anatomia do nosso prompt profissional. Ele define:
> - **Papel:** Engenheiro de QA Sênior em Node.js.
> - **Stack:** Jest com `@jest/globals` e ES Modules (`import/export`).
> - **Padrão:** AAA (Arrange, Act, Assert).
> - **Instrução de Mocking:** Mockar o model `Contato` sem conectar ao banco real.
> - **Casos a Cobrir:** Caminhos felizes e caminhos de exceção (ex: registro não encontrado)."

```markdown
### 📝 PROMPT UTILIZADO:
Você é um Engenheiro de Software Sênior especialista em testes automatizados no Node.js.
Gere uma suíte completa de testes unitários para o service abaixo, seguindo rigorosamente estas diretrizes:

1. Stack & Padrões:
   - Use ES Modules: `import { describe, it, expect, jest, beforeEach } from '@jest/globals'`.
   - Utilize o padrão AAA (Arrange, Act, Assert) com comentários explicativos.
   - Isole completamente o banco de dados. Faça mock do model `Contato` importado de `../models/Contato.js`.

2. Casos de Teste Obrigatórios:
   - `listar()`: deve chamar `Contato.findAll()` e retornar a lista de contatos.
   - `buscarPorId()`: deve chamar `Contato.findByPk(id)` e retornar o registro ou null se não existir.
   - `criar(payload)`: deve chamar `Contato.create(payload)` com os dados fornecidos.
   - `atualizar(id, payload)`: deve retornar null quando o contato não existir; deve chamar `contato.update(payload)` e retornar o contato atualizado quando existir.
   - `remover(id)`: deve retornar null se não existir; deve chamar `contato.destroy()` e retornar true quando excluído com sucesso.

Código do service:
[Colar o conteúdo de src/services/contato.service.js]
```

---

### 6:30 – 9:30 | Analisando e Implementando o Código Gerado
**[TELA: Criar `src/__tests__/unit/contato.service.test.js` e colar o código revisado]**

> "Vamos ver o código gerado pela IA. Reparem na elegância do mock com `jest.unstable_mockModule` ou mocks dinâmicos para ESM:"

```javascript
// src/__tests__/unit/contato.service.test.js
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// 1. Mock do model Contato antes da importação do service
const mockContatoModel = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

jest.unstable_mockModule('../../models/Contato.js', () => ({
  Contato: mockContatoModel,
}));

// Importação dinâmica para aplicar o mock de módulo ESM
const { default: contatoService } = await import('../../services/contato.service.js');

describe('ContatoService (Testes Unitários gerados com IA)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listar()', () => {
    it('deve retornar a lista de contatos chamando Contato.findAll', async () => {
      // Arrange
      const listaFicticia = [
        { id: 1, nome: 'Maria Clara', email: 'maria@plantei.com', mensagem: 'Dúvida sobre mudas' },
      ];
      mockContatoModel.findAll.mockResolvedValue(listaFicticia);

      // Act
      const resultado = await contatoService.listar();

      // Assert
      expect(mockContatoModel.findAll).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(listaFicticia);
    });
  });

  describe('atualizar()', () => {
    it('deve retornar null se o contato não for encontrado', async () => {
      // Arrange
      mockContatoModel.findByPk.mockResolvedValue(null);

      // Act
      const resultado = await contatoService.atualizar(999, { nome: 'Novo Nome' });

      // Assert
      expect(mockContatoModel.findByPk).toHaveBeenCalledWith(999);
      expect(resultado).toBeNull();
    });

    it('deve atualizar o contato e retornar a instância atualizada', async () => {
      // Arrange
      const mockInstancia = {
        id: 1,
        nome: 'Nome Antigo',
        update: jest.fn().mockResolvedValue(true),
      };
      mockContatoModel.findByPk.mockResolvedValue(mockInstancia);

      // Act
      const resultado = await contatoService.atualizar(1, { nome: 'Nome Novo' });

      // Assert
      expect(mockContatoModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockInstancia.update).toHaveBeenCalledWith({ nome: 'Nome Novo' });
      expect(resultado).toBe(mockInstancia);
    });
  });

  describe('remover()', () => {
    it('deve retornar null se o contato a ser removido não existir', async () => {
      mockContatoModel.findByPk.mockResolvedValue(null);
      const resultado = await contatoService.remover(404);
      expect(resultado).toBeNull();
    });

    it('deve chamar destroy() e retornar true quando o contato for removido', async () => {
      const mockInstancia = {
        id: 10,
        destroy: jest.fn().mockResolvedValue(true),
      };
      mockContatoModel.findByPk.mockResolvedValue(mockInstancia);

      const resultado = await contatoService.remover(10);

      expect(mockInstancia.destroy).toHaveBeenCalledTimes(1);
      expect(resultado).toBe(true);
    });
  });
});
```

---

### 9:30 – 11:30 | Execução no Terminal e Validação
**[TELA: Abrir o terminal integrado do VS Code]**

> "Agora é hora da verdade: vamos rodar o teste gerado no terminal."

```bash
npm test contato.service.test.js
```

**[TELA: Terminal exibindo todos os testes passando em verde]**

```text
 PASS  src/__tests__/unit/contato.service.test.js
  ContatoService (Testes Unitários gerados com IA)
    listar()
      ✓ deve retornar a lista de contatos chamando Contato.findAll (4 ms)
    atualizar()
      ✓ deve retornar null se o contato não for encontrado (2 ms)
      ✓ deve atualizar o contato e retornar a instância atualizada (2 ms)
    remover()
      ✓ deve retornar null se o contato a ser removido não existir (1 ms)
      ✓ deve chamar destroy() e retornar true quando o contato for removido (2 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

> "Perfeito! Em menos de 5 minutos, saímos de zero testes no `contato.service.js` para uma suíte 100% isolada, rápida e confiável. O papel da IA foi acelerar o boilerplate mecânico, enquanto o nosso papel foi guiar a arquitetura e auditar o código."

---

# 🎬 VÍDEO 2.2 — Analisando Lacunas de Cobertura e Casos de Borda com IA
**Duração estimada:** 10–12 min  
**Objetivo:** Utilizar o relatório de cobertura do Jest (`--coverage`) como entrada para a IA identificar linhas órfãs, branches não exercitadas e criar casos de borda (edge cases) para middlewares de segurança.

---

### 0:00 – 1:30 | Abertura: Cobertura Alta nem sempre é Cobertura Boa
**[TELA: Professor no editor mostrando o comando de cobertura]**

> "Bem-vindos ao Vídeo 2.2. Ter 100% de cobertura de linhas significa que seu sistema está livre de bugs? Não! Se você não testa os caminhos alternativos e as condições de erro, basta um payload inesperado para a aplicação quebrar em produção."
>
> "Nesta aula, vamos rodar o relatório de cobertura do Jest no `plantei-api`, identificar exatamente quais arquivos e bifurcações condicionais estão descobertos, e usar a IA para criar os testes dos caminhos de falha."

---

### 1:30 – 4:00 | Gerando e Inspecionando o Relatório de Cobertura
**[TELA: Executar no terminal do VS Code]**

```bash
npm run test:coverage
```

**[TELA: Mostrar a tabela de cobertura gerada pelo Jest no terminal]**

> "Reparem na tabela. O `autorizar.middleware.js` está com 0% de cobertura de linhas e branches:"

```text
-----------------------------|---------|----------|---------|---------|-------------------
File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------------|---------|----------|---------|---------|-------------------
 middlewares/                 |         |          |         |         |                   
  auth.middleware.js         |   85.71 |       75 |     100 |   85.71 | 18-20             
  autorizar.middleware.js    |       0 |        0 |       0 |       0 | 1-20              
  error.middleware.js        |       0 |        0 |       0 |       0 | 1-12              
-----------------------------|---------|----------|---------|---------|-------------------
```

> "Vamos abrir o `src/middlewares/autorizar.middleware.js` para entender a regra de negócio:"

```javascript
// src/middlewares/autorizar.middleware.js
export function autorizarPermissao(codigoPermissao) {
  return async (req, res, next) => {
    const usuario = req.user;

    const perfil = await usuario.getPerfil({
      include: {
        association: 'permissoes',
      },
    });

    const permissoes = perfil.permissoes.map(p => p.codigo);

    if (!permissoes.includes(codigoPermissao)) {
      return res.status(403).json({
        erro: 'Você não tem permissão para essa ação',
      });
    }

    next();
  };
}
```

> "Temos duas branches críticas aqui:
> 1. O usuário **tem** a permissão necessária -> chama `next()`.
> 2. O usuário **não tem** a permissão necessária -> retorna `403 Forbidden`.
> E temos edge cases: e se o usuário não tiver permissões carregadas? E se o `getPerfil` falhar?"

---

### 4:00 – 7:30 | Fornecendo o Relatório de Lacunas para a IA
**[TELA: Janela do assistente de IA com prompt de análise de cobertura]**

> "Ao invés de pedir apenas 'faça testes', nós alimentamos a IA com a **análise de lacunas**:"

```markdown
### 📝 PROMPT DE LACUNAS DE COBERTURA:
Atue como especialista em QA e Segurança de APIs Node.js.
O arquivo `src/middlewares/autorizar.middleware.js` está com 0% de cobertura no relatório do Jest.

Regra do middleware:
- Recebe `codigoPermissao` (ex: 'PRODUTO_CRIAR').
- Obtém `req.user`, chama `usuario.getPerfil({ include: { association: 'permissoes' } })`.
- Mapeia as permissões. Se incluir o código, chama `next()`. Se não, devolve status 403 com JSON `{ erro: 'Você não tem permissão para essa ação' }`.

Crie os testes unitários em `src/__tests__/unit/autorizar.middleware.test.js` cobrindo:
1. Caminho Feliz: Usuário possui a permissão requerida -> deve chamar `next()`.
2. Caminho de Bloqueio: Usuário possui outras permissões, mas NÃO a exigida -> status 403.
3. Edge Case: Perfil do usuário não possui nenhuma permissão cadastrada (array vazio) -> status 403.
4. Use objetos falsos para `req`, `res` e `next` (usando `jest.fn()`).
```

---

### 7:30 – 10:30 | Escrevendo `autorizar.middleware.test.js`
**[TELA: Criar e exibir `src/__tests__/unit/autorizar.middleware.test.js`]**

```javascript
// src/__tests__/unit/autorizar.middleware.test.js
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { autorizarPermissao } from '../../middlewares/autorizar.middleware.js';

describe('autorizar.middleware (Cobertura de Branches com IA)', () => {
  let req, res, next;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('deve chamar next() quando o usuário tiver a permissão solicitada', async () => {
    // Arrange
    req = {
      user: {
        getPerfil: jest.fn().mockResolvedValue({
          permissoes: [{ codigo: 'PRODUTO_CRIAR' }, { codigo: 'PRODUTO_LISTAR' }],
        }),
      },
    };

    const middleware = autorizarPermissao('PRODUTO_CRIAR');

    // Act
    await middleware(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('deve retornar status 403 se o usuário NÃO tiver a permissão exigida', async () => {
    // Arrange
    req = {
      user: {
        getPerfil: jest.fn().mockResolvedValue({
          permissoes: [{ codigo: 'PRODUTO_LISTAR' }], // Não tem PRODUTO_EXCLUIR
        }),
      },
    };

    const middleware = autorizarPermissao('PRODUTO_EXCLUIR');

    // Act
    await middleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      erro: 'Você não tem permissão para essa ação',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar status 403 quando o perfil não possuir nenhuma permissão (array vazio)', async () => {
    // Arrange
    req = {
      user: {
        getPerfil: jest.fn().mockResolvedValue({
          permissoes: [],
        }),
      },
    };

    const middleware = autorizarPermissao('QUALQUER_PERMISSAO');

    // Act
    await middleware(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
```

---

### 10:30 – 12:00 | Validando o Salto de Cobertura
**[TELA: Rodar `npm run test:coverage` no terminal]**

```text
 PASS  src/__tests__/unit/autorizar.middleware.test.js
-----------------------------|---------|----------|---------|---------|-------------------
File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------------|---------|----------|---------|---------|-------------------
 middlewares/                 |         |          |         |         |                   
  autorizar.middleware.js    |     100 |      100 |     100 |     100 |                   
-----------------------------|---------|----------|---------|---------|-------------------
```

> "Saímos de 0% para 100% de Statements, Branches, Functions e Lines! A IA não apenas escreveu código; ela nos ajudou a fechar todas as portas de segurança do middleware."

---

# 🎬 VÍDEO 2.3 — Refatorando e Endurecendo Testes com IA: Do Frágil ao Resiliente
**Duração estimada:** 10–12 min  
**Objetivo:** Ensinar a diagnosticar e refatorar "testes frágeis" (flaky tests) e testes com acoplamento excessivo (over-mocking), transformando-os em testes de comportamento duradouros com auxílio de IA.

---

### 0:00 – 2:00 | O que é um Teste Frágil (Anti-padrões Comuns)
**[TELA: Slide ou código comparativo no VS Code]**

> "Fala devs! Chegamos ao Vídeo 2.3. Um dos maiores pesadelos em equipes de desenvolvimento são os testes que quebram sem motivo aparente quando você muda uma linha de código que não altera o comportamento do sistema."
>
> "Isso acontece por dois grandes motivos:
> 1. **Over-mocking:** Você mockou até os métodos internos privados da classe, e o teste valida 'como foi implementado' em vez de 'o resultado que entrega'.
> 2. **Asserções vagas ou instáveis:** Validar strings soltas, datas exatas do relógio do sistema ou depender da ordem não determinística de listas."

---

### 2:00 – 5:00 | Identificando um Teste Acoplado
**[TELA: Exibir um teste frágil de exemplo antes da refatoração]**

```javascript
// ❌ EXEMPLO DE TESTE FRÁGIL:
it('deve autenticar usuario', async () => {
  // Teste que verifica detalhes internos irrelevantes
  const res = await authService.login('teste@plantei.com', '123456');
  
  // Asserção frágil: se mudar a estrutura do token ou mensagem, tudo quebra
  expect(Usuario.findOne).toHaveBeenCalledWith({ where: { email: 'teste@plantei.com' } });
  expect(res.token.length).toBe(156); // ❌ Se o payload mudar 1 caractere, o tamanho muda!
});
```

> "Reparem nesse teste: verificar se o token tem 156 caracteres é uma bomba-relógio. Se adicionarmos o ID do perfil no JWT, o tamanho muda e o teste quebra. O teste deve validar o **contrato**: o token foi gerado? Tem o formato JWT esperado? A função rejeita senhas inválidas?"

---

### 5:00 – 8:00 | Prompt de Refatoração e Resiliência
**[TELA: Submeter o teste antigo para a IA no editor]**

```markdown
### 📝 PROMPT DE REFATORAÇÃO DE TESTES:
Você é um arquiteto de software focado em qualidade de código.
Analise a suíte de testes unitários do `auth.service.test.js`.
Identifique:
1. Asserções frágeis acopladas a detalhes de implementação voláteis.
2. Riscos de falso positivo ou falso negativo.
3. Sugira uma versão refatorada que teste o COMPORTAMENTO e o CONTRATO, tornando o teste resiliente a refatorações internas de código.
```

---

### 8:00 – 11:00 | O Teste Refatorado e Resiliente
**[TELA: Mostrar a versão endurecida no editor]**

```javascript
// ✅ VERSÃO RESILIENTE:
describe('authService.login() - Versão Resiliente', () => {
  it('deve retornar o token JWT e dados essenciais do usuário para credenciais válidas', async () => {
    // Arrange
    const usuarioBanco = {
      id: 1,
      nome: 'Angelo',
      email: 'angelo@plantei.com',
      senha: '$2b$10$hashSimuladoBcrypt...',
      id_perfil: 1,
    };
    mockUsuarioModel.findOne.mockResolvedValue(usuarioBanco);
    mockBcryptCompare.mockResolvedValue(true);
    mockJwtSign.mockReturnValue('token-jwt-simulado-valido');

    // Act
    const resposta = await authService.login('angelo@plantei.com', 'Senha@123');

    // Assert: Valida contrato e propriedades vitais, não o tamanho exato
    expect(resposta).toHaveProperty('token');
    expect(resposta).toHaveProperty('usuario');
    expect(resposta.usuario).toEqual(
      expect.objectContaining({
        id: 1,
        email: 'angelo@plantei.com',
      })
    );
    // Garante que a senha criptografada NUNCA vaze na resposta
    expect(resposta.usuario).not.toHaveProperty('senha');
  });
});
```

> "Vejam a diferença: usamos `expect.objectContaining` e checamos que a senha nunca seja devolvida. Isso é um teste que protege regras de negócio e segurança, e não quebra atoa se alguém formatar o código."

---

### 11:00 – 12:00 | Encerramento do Bloco
> "A IA é excelente para gerar código rápido, mas a sua sensibilidade para pedir 'refatore focando em resiliência e contrato' é o que diferencia um desenvolvedor júnior de um sênior. No próximo vídeo, vamos resolver outro grande vilão dos testes: colisões de dados no banco com fixtures inteligentes!"

---

# 🎬 VÍDEO 2.4 — Geração Inteligente de Dados Sintéticos e Fixtures com IA
**Duração estimada:** 10–12 min  
**Objetivo:** Criar e evoluir uma fábrica de dados de teste (`factories.js`) com auxílio de IA para gerar dados válidos, únicos e realistas (CPF, email, CNPJ, payloads complexos) evitando violações de constraints nos testes de integração.

---

### 0:00 – 2:00 | O Problema da Colisão de Dados Únicos
**[TELA: Mostrar o terminal com um erro clássico do PostgreSQL]**

```text
SequelizeUniqueConstraintError: Validation error: email must be unique
SequelizeValidationError: CPF deve conter 11 caracteres
```

> "Fala galera! No Vídeo 2.4, vamos resolver um problema clássico dos testes de integração. Quando rodamos testes com banco de dados real, se dois testes tentarem cadastrar `teste@plantei.com` ou o mesmo CPF, o banco rejeita com `SequelizeUniqueConstraintError`."
>
> "E pior: se você rodar seus testes em paralelo, a colisão fica imprevisível. A solução profissional é usar o padrão **Object Mother / Test Data Factory** auxiliado por IA para gerar dados sintéticos dinâmicos e semanticamente válidos."

---

### 2:00 – 5:00 | Estruturando a Factory com IA no `factories.js`
**[TELA: Abrir o arquivo `src/__tests__/helpers/factories.js`]**

> "Vejam como instruímos a IA para enriquecer nossa fábrica de dados existente:"

```markdown
### 📝 PROMPT PARA GERAÇÃO DE FACTORIES:
No projeto `plantei-api`, temos constraints estritas no PostgreSQL:
- Usuario: `email` é UNIQUE; `cpf` é UNIQUE e deve ter exatamente 11 dígitos numéricos (`len: [11, 11]`).
- Produto: `nome` entre 3 e 150 caracteres, `preco` >= 0, `estoque` >= 0.
- Contato: `email` válido, `mensagem` max 500 caracteres.

Escreva funções no `src/__tests__/helpers/factories.js` que:
1. Gerem valores 100% únicos por milissegundo + sufixo randômico.
2. Permitam sobrescrever qualquer campo via parâmetro `overrides = {}`.
3. Adicione fábrica para `criarProdutoTeste` e `criarContatoTeste`.
```

---

### 5:00 – 8:30 | O Código da Factory Expandida
**[TELA: Inspecionar `src/__tests__/helpers/factories.js`]**

```javascript
// src/__tests__/helpers/factories.js
export const gerarCpf = () => {
  const base = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return base.slice(-11).padStart(11, '0');
};

export const gerarEmail = (prefixo = 'teste', dominio = 'plantei.com') => {
  const sufixo = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  return `${prefixo}_${sufixo}@${dominio}`;
};

export const criarUsuarioTeste = (overrides = {}) => ({
  nome: 'Usuário de Teste Automatizado',
  email: gerarEmail('user'),
  senha: 'Senha@Forte123',
  cpf: gerarCpf(),
  id_perfil: 1,
  ...overrides,
});

export const criarProdutoTeste = (overrides = {}) => ({
  nome: `Muda de Samambaia ${Math.floor(Math.random() * 1000)}`,
  descricao: 'Planta ornamental cultivada com adubo orgânico',
  preco: 45.9,
  estoque: 15,
  image_url: 'https://plantei.com/imagens/samambaia.jpg',
  ...overrides,
});

export const criarContatoTeste = (overrides = {}) => ({
  nome: 'Cliente Interessado',
  email: gerarEmail('contato'),
  mensagem: 'Gostaria de saber o prazo de entrega para mudas em lote.',
  ...overrides,
});
```

---

### 8:30 – 11:00 | Usando a Factory nos Testes de Integração
**[TELA: Abrir um teste de integração consumindo a Factory]**

```javascript
import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';
import { criarProdutoTeste, criarUsuarioTeste } from '../helpers/factories.js';

describe('POST /api/produtos (Com Factories Inteligentes)', () => {
  it('deve criar um produto com dados únicos sem colisão', async () => {
    // Arrange: dados gerados dinamicamente
    const payload = criarProdutoTeste({ preco: 89.90 });

    // Act
    const res = await request(app)
      .post('/api/produtos')
      .send(payload);

    // Assert
    expect(res.status).toBe(201);
    expect(res.body.nome).toBe(payload.nome);
    expect(Number(res.body.preco)).toBe(89.90);
  });
});
```

---

### 11:00 – 12:00 | Conclusão da Disciplina 2
> "Sensacional! Com isso fechamos a Disciplina 2. Aprendemos a:
> 1. Gerar testes unitários com prompts contextuais para ESM e Sequelize.
> 2. Ler relatórios de cobertura para caçar branches e edge cases.
> 3. Refatorar testes frágeis em testes resilientes focados em comportamento.
> 4. Construir geradores de dados que blindam nossos testes contra colisões de banco."
>
> "Na Disciplina 3, vamos conectar tudo isso em uma esteira de automação contínua: CI/CD com GitHub Actions e Quality Gates automáticos!"

