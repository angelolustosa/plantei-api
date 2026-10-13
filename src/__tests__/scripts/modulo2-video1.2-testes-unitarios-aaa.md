# Módulo 2 — Qualidade de Software e Testes com IA
# Vídeo 1.2 — Testes Unitários: Padrão AAA na Prática
**Duração estimada:** 9–10 min  
**Projeto:** `plantei-api`  
**Arquivos:** `src/__tests__/unit/hash.test.js` · `src/__tests__/unit/produto.model.test.js`

---

## 🎬 ABERTURA (0:00 – 0:30)

**[TELA: estrutura de pastas, pasta `unit/` vazia]**

> "No vídeo anterior a gente configurou o Jest. Agora vem a parte boa: escrever o primeiro teste."

> "A gente vai aprender o padrão **AAA — Arrange, Act, Assert** — que é a base de praticamente todo teste bem escrito. E a gente vai ver por que começar pelo `hash.js` é a escolha certa."

---

## 📖 PARTE 1 — O padrão AAA (0:30 – 2:00)

**[TELA: slide mental / comentário no editor]**

> "Todo teste bem escrito tem três partes claras:"

```
// Arrange — preparar o cenário
const senha = 'minhasenha123';

// Act — executar a ação que queremos testar
const hash = await gerarHash(senha);

// Assert — verificar se o resultado é o esperado
expect(hash).not.toBe(senha);
```

> "**Arrange**: preparar os dados de entrada. **Act**: chamar a função que estamos testando. **Assert**: verificar o resultado."

> "Parece simples, mas quando você separa o código assim, fica muito claro *o que* está sendo testado e *por quê* o teste existe. É muito mais fácil de ler e de dar manutenção."

---

## 🧪 PARTE 2 — Escrevendo `hash.test.js` (2:00 – 6:00)

**[TELA: abrir `src/utils/hash.js` para referência]**

> "Primeiro a gente olha o que vai testar. O `hash.js` exporta duas funções: `gerarHash` e `compararHash`. Sem dependências externas, sem banco, sem nada. Função entra, resultado sai."

**[Abrir / criar `src/__tests__/unit/hash.test.js`]**

> "Agora o arquivo de teste. A convenção é: mesmo nome do arquivo original, com `.test.js` no final."

```js
import { describe, it, expect } from '@jest/globals';
import { gerarHash, compararHash } from '../../utils/hash.js';
```

> "O `describe` agrupa testes relacionados. O `it` descreve um comportamento específico — note que a frase do `it` é uma afirmação: *'deve retornar uma string diferente da senha original'*. Lendo assim, fica claro o que o teste garante."

**[Escrever o primeiro teste ao vivo]**

```js
describe('gerarHash()', () => {
  it('deve retornar uma string diferente da senha original', async () => {
    // Arrange
    const senha = 'minhasenha123';

    // Act
    const hash = await gerarHash(senha);

    // Assert
    expect(hash).not.toBe(senha);
    expect(typeof hash).toBe('string');
  });
});
```

**[Rodar no terminal]**

```bash
npm test hash.test
```

> "Verde! Primeiro teste passando. Mas um teste só não é suficiente. Vamos pensar: *o que mais pode dar errado com o hash?*"

**[Escrever o segundo teste]**

```js
  it('deve gerar hashes diferentes para a mesma senha (salt aleatório)', async () => {
    const hash1 = await gerarHash('mesmasenha');
    const hash2 = await gerarHash('mesmasenha');

    expect(hash1).not.toBe(hash2);
  });
```

> "Isso é importante. O bcrypt usa um **salt aleatório** em cada hash. Então a mesma senha gera hashes diferentes — e é isso que torna o banco seguro mesmo se vazar. Nosso teste verifica esse comportamento."

**[Escrever o teste do formato bcrypt]**

```js
  it('deve gerar um hash com o formato bcrypt ($2b$...)', async () => {
    const hash = await gerarHash('qualquersenha');
    expect(hash).toMatch(/^\$2[ab]\$/);
  });
```

> "Esse é um teste de *contrato*. Todo hash bcrypt começa com `$2b$` ou `$2a$`. Se o formato mudar, a gente quer saber."

**[Completar com `compararHash`]**

```js
describe('compararHash()', () => {
  it('deve retornar true quando a senha corresponde ao hash', async () => {
    const senha = 'senha-correta';
    const hash = await gerarHash(senha);

    const resultado = await compararHash(senha, hash);

    expect(resultado).toBe(true);
  });

  it('deve retornar false quando a senha não corresponde ao hash', async () => {
    const hash = await gerarHash('senha-original');

    const resultado = await compararHash('senha-errada', hash);

    expect(resultado).toBe(false);
  });

  it('deve retornar false para string vazia vs hash válido', async () => {
    const hash = await gerarHash('senha123');
    const resultado = await compararHash('', hash);
    expect(resultado).toBe(false);
  });
});
```

**[Rodar tudo]**

```bash
npm test hash.test
```

> "Seis testes, todos verdes. E repara: a gente não testou *como* o bcrypt funciona internamente — a gente testou o *comportamento* da nossa função. Essa distinção é crucial."

---

## 🏗️ PARTE 3 — Validações do Model sem banco (6:00 – 9:00)

**[Abrir `src/models/Produto.js`]**

> "Agora uma técnica diferente. O model `Produto` tem validações declaradas no Sequelize: nome obrigatório, mínimo 3 caracteres, preço não negativo. Como testar isso sem banco?"

> "O Sequelize tem um método chamado `build()` que cria a instância do model **em memória**, sem salvar no banco. E depois a gente chama `validate()` para checar as regras."

**[Abrir `src/__tests__/unit/produto.model.test.js`]**

```js
import { describe, it, expect } from '@jest/globals';
import { Produto } from '../../models/Produto.js';

const produtoValido = { nome: 'Samambaia', preco: 29.90, estoque: 10 };

describe('Model Produto — Validações', () => {

  it('deve aceitar um produto com dados válidos', async () => {
    const produto = Produto.build(produtoValido);
    await expect(produto.validate()).resolves.not.toThrow();
  });

  it('deve rejeitar nome vazio', async () => {
    const produto = Produto.build({ ...produtoValido, nome: '' });
    await expect(produto.validate()).rejects.toThrow('Nome do produto é obrigatório');
  });

  it('deve rejeitar preço negativo', async () => {
    const produto = Produto.build({ ...produtoValido, preco: -1 });
    await expect(produto.validate()).rejects.toThrow('Preço deve ser maior ou igual a zero');
  });

  it('deve rejeitar estoque negativo', async () => {
    const produto = Produto.build({ ...produtoValido, estoque: -1 });
    await expect(produto.validate()).rejects.toThrow('Estoque não pode ser negativo');
  });
});
```

> "O `...produtoValido` é o spread operator — a gente copia o objeto base e sobrescreve só o campo que quer testar. Evita repetição."

> "O `resolves.not.toThrow()` verifica que a promise não lança erro. O `rejects.toThrow('mensagem')` verifica que a promise é rejeitada com aquela mensagem específica."

**[Rodar]**

```bash
npm test produto.model
```

> "Todos passando. E olha o detalhe: zero conexão com banco. Esses testes rodam em milissegundos."

---

## 🏁 ENCERRAMENTO (9:00 – 9:45)

**[Rodar todos os unitários de uma vez]**

```bash
npm test -- --testPathPattern=unit
```

> "Dez testes, todos verdes, em menos de dois segundos."

> "No próximo vídeo a gente enfrenta o caso mais comum no mundo real: funções que dependem de banco de dados, de JWT, de serviços externos. Vamos aprender **mocks** — como substituir essas dependências por versões controladas durante o teste."

> "Até lá."

---

## 📋 Checklist antes de gravar

- [ ] `src/__tests__/unit/` vazia (vai criar ao vivo)
- [ ] `src/utils/hash.js` aberto como referência lateral
- [ ] `src/models/Produto.js` aberto como referência lateral
- [ ] Terminal pronto para rodar `npm test`
- [ ] Fonte grande o suficiente para o código ser legível na gravação
