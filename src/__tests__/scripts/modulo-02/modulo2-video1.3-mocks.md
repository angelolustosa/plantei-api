# Módulo 2 — Qualidade de Software e Testes com IA
# Vídeo 1.3 — Mocks: Testando Sem Banco de Dados
**Duração estimada:** 10 min  
**Projeto:** `plantei-api`  
**Arquivos:** `src/__tests__/unit/auth.service.test.js` · `src/__tests__/unit/auth.middleware.test.js`

---

## 🎬 ABERTURA (0:00 – 0:40)

**[TELA: `src/services/auth.service.js` aberto]**

> "No vídeo anterior a gente testou funções puras — sem dependências externas. Mas a maioria das funções no mundo real depende de algo: banco de dados, APIs, JWT, serviços externos."

> "Se a gente tentar testar o `auth.service.js` direto, ele vai tentar conectar no banco. O teste fica lento, depende de dados reais, e pode falhar por razões que não têm nada a ver com o código que estamos testando."

> "A solução é **mock** — substituir as dependências reais por versões controladas que a gente define no próprio teste."

---

## 🧠 PARTE 1 — O que é um mock e por que usar (0:40 – 2:30)

**[TELA: diagrama mental ou comentário no editor]**

> "Imagine que o `auth.service.js` é uma caixa. Ela tem três dependências externas:"

```
┌─────────────────────────┐
│     auth.service.js     │
│                         │
│  ┌──────────────────┐   │
│  │ Usuario.findOne  │ ──────→ banco de dados (real)
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │  compararHash    │ ──────→ bcrypt (real)
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │    jwt.sign      │ ──────→ jsonwebtoken (real)
│  └──────────────────┘   │
└─────────────────────────┘
```

> "No teste, a gente não quer que essas dependências sejam reais. A gente quer controlar o que elas retornam. Com mock, fica assim:"

```
┌─────────────────────────┐
│     auth.service.js     │
│                         │
│  ┌──────────────────┐   │
│  │ Usuario.findOne  │ ──────→ jest.fn() → retorna o que a gente quiser
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │  compararHash    │ ──────→ jest.fn() → retorna true ou false
│  └──────────────────┘   │
│  ┌──────────────────┐   │
│  │    jwt.sign      │ ──────→ jest.fn() → retorna 'token-de-teste'
│  └──────────────────┘   │
└─────────────────────────┘
```

> "A gente isola completamente o service. O teste só valida a lógica *dele*, não a lógica do banco ou do bcrypt."

---

## 🧪 PARTE 2 — Escrevendo `auth.service.test.js` (2:30 – 7:00)

**[Abrir / criar `src/__tests__/unit/auth.service.test.js`]**

> "Tem uma regra importante com `jest.mock()`: ele precisa aparecer **antes** dos imports que dependem do módulo mockado. O Jest eleva os mocks automaticamente, mas o padrão mais claro é colocar no topo."

```js
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// 1. Declarar os mocks ANTES dos imports dependentes
jest.mock('../../models/index.js', () => ({
  Usuario: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
  Perfil: {},
}));

jest.mock('../../utils/hash.js', () => ({
  gerarHash: jest.fn(),
  compararHash: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token-de-teste-mockado'),
}));

// 2. Importar o que vamos testar (depois dos mocks)
import * as authService from '../../services/auth.service.js';
import { Usuario } from '../../models/index.js';
import { gerarHash, compararHash } from '../../utils/hash.js';
```

> "O `jest.fn()` cria uma função falsa que a gente pode configurar em cada teste. O `() => 'token-de-teste-mockado'` já define o retorno padrão do JWT."

**[Dados reutilizáveis]**

```js
const usuarioMock = {
  id: 1,
  nome: 'Ana Silva',
  email: 'ana@plantei.com',
  senha: '$2b$10$hashfake',
  perfil: { nome: 'Cliente' },
};
```

**[Teste de `registrarUsuario`]**

> "Primeiro: o service nunca pode salvar a senha em texto puro. Isso é uma regra de segurança crítica."

```js
describe('authService.registrarUsuario()', () => {
  beforeEach(() => jest.clearAllMocks()); // limpa os mocks entre cada teste

  it('deve criar usuário com a senha hasheada (nunca texto puro)', async () => {
    const payload = { nome: 'Ana', email: 'ana@plantei.com', senha: 'Senha@123' };
    gerarHash.mockResolvedValue('$2b$10$hashgerado');
    Usuario.create.mockResolvedValue({ id: 1, ...payload, senha: '$2b$10$hashgerado' });

    await authService.registrarUsuario(payload);

    // O service chamou gerarHash com a senha original?
    expect(gerarHash).toHaveBeenCalledWith('Senha@123');

    // O create recebeu o hash, não a senha em texto puro?
    expect(Usuario.create).toHaveBeenCalledWith(
      expect.objectContaining({ senha: '$2b$10$hashgerado' })
    );
  });
});
```

> "O `mockResolvedValue` define o que a função assíncrona vai retornar quando chamada. O `expect.objectContaining` verifica que o objeto tem *pelo menos* aquela propriedade — ignora as demais."

**[Testes de `autenticarUsuario` — os três cenários]**

```js
describe('authService.autenticarUsuario()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deve lançar erro quando o e-mail não existe', async () => {
    Usuario.findOne.mockResolvedValue(null);

    await expect(
      authService.autenticarUsuario({ email: 'x@x.com', senha: '123' })
    ).rejects.toThrow('Usuário ou senha inválidos');
  });

  it('deve lançar erro quando a senha está incorreta', async () => {
    Usuario.findOne.mockResolvedValue(usuarioMock);
    compararHash.mockResolvedValue(false);

    await expect(
      authService.autenticarUsuario({ email: 'ana@plantei.com', senha: 'errada' })
    ).rejects.toThrow('Usuário ou senha inválidos');
  });

  it('deve retornar token e usuário com credenciais corretas', async () => {
    Usuario.findOne.mockResolvedValue(usuarioMock);
    compararHash.mockResolvedValue(true);

    const resultado = await authService.autenticarUsuario({
      email: 'ana@plantei.com',
      senha: 'Senha@123',
    });

    expect(resultado).toHaveProperty('token', 'token-de-teste-mockado');
    expect(resultado).toHaveProperty('usuario', usuarioMock);
  });
});
```

> "Repara um detalhe de segurança aqui: tanto para e-mail inválido quanto para senha errada, a mensagem de erro é **a mesma**. `'Usuário ou senha inválidos'`. Isso é intencional — não queremos dar pistas para quem está tentando invadir."

**[Rodar]**

```bash
npm test auth.service
```

---

## 🔧 PARTE 3 — Testando middleware com stubs de req/res (7:00 – 9:30)

**[Abrir `src/middlewares/auth.middleware.js`]**

> "O middleware tem uma assinatura diferente: `(req, res, next)`. Como testamos isso sem uma requisição real?"

> "A gente cria objetos falsos — stubs — que imitam o `req`, o `res` e o `next`. É um padrão muito usado para testar middlewares Express."

**[Abrir / criar `src/__tests__/unit/auth.middleware.test.js`]**

```js
function criarMocks() {
  const req = { headers: {} };
  const res = {
    status: jest.fn().mockReturnThis(), // .status(401) retorna o próprio res
    json: jest.fn(),                    // para poder encadear .status(401).json(...)
  };
  const next = jest.fn();
  return { req, res, next };
}
```

> "O `.mockReturnThis()` é o que permite escrever `res.status(401).json({...})` — o `status` retorna o próprio objeto `res`, então o encadeamento funciona."

```js
describe('authMiddleware', () => {
  it('deve retornar 401 sem header Authorization', async () => {
    const { req, res, next } = criarMocks();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Token não informado' });
    expect(next).not.toHaveBeenCalled(); // não deve prosseguir
  });

  it('deve chamar next() e popular req.user com token válido', async () => {
    const { req, res, next } = criarMocks();
    req.headers.authorization = 'Bearer token-valido';

    jwt.verify.mockReturnValue({ id: 1, email: 'ana@plantei.com' });
    Usuario.findByPk.mockResolvedValue({ id: 1, nome: 'Ana' });

    await authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });
});
```

**[Rodar todos os unitários]**

```bash
npm test -- --testPathPattern=unit
```

> "Todos os testes unitários passando. Zero conexão com banco em nenhum deles."

---

## 🏁 ENCERRAMENTO (9:30 – 10:00)

> "Aprendemos hoje como isolar dependências externas com `jest.mock()`, usar `mockResolvedValue` para controlar retornos assíncronos, e criar stubs de req/res para testar middlewares."

> "No próximo vídeo a gente fecha o ciclo com **testes de integração** — onde tudo se conecta de verdade: rota, middleware, banco. E no final, o relatório de cobertura."

---

## 📋 Checklist antes de gravar

- [ ] `src/__tests__/unit/` com `hash.test.js` e `produto.model.test.js` já criados (vídeos anteriores)
- [ ] `src/services/auth.service.js` aberto como referência
- [ ] `src/middlewares/auth.middleware.js` aberto como referência
- [ ] Terminal pronto
- [ ] `jest.clearAllMocks()` no `beforeEach` — explicar o motivo ao vivo
