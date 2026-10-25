# Módulo 1 — Engenharia de Software e IA Aplicada
# Disciplina 2 — Revisão de Engenharia Limpa: POO, SOLID e Clean Architecture no Projeto
**Duração estimada:** 9–10 min  
**Projeto:** `plantei-api`  
**Arquivos de referência:** `src/controllers/produto.controller.js` · `src/services/produto.service.js` · `src/middlewares/error.middleware.js` · `src/utils/hash.js`  
**Objetivo:** Revisitar os princípios de Programação Orientada a Objetos, o acrônimo SOLID e os fundamentos de Clean Architecture aplicando refatorações de código no `plantei-api`, eliminando código duplicado e centralizando o tratamento de erros em até 10 minutos.

---

## 🎬 ABERTURA (0:00 – 1:00)

**[TELA: Editor com comparação visual lado a lado: à esquerda um controller gigante com SQL, validações e try/catch aninhados; à direita código limpo e refatorado]**

> "Fala devs, sejam muito bem-vindos à **Disciplina 2: Revisão de Engenharia Limpa**!"

> "Existe uma frase famosa de Martin Fowler que resume a engenharia de software profissional: *'Qualquer tolo pode escrever código que um computador entenda. Bons programadores escrevem código que humanos podem entender.'*"

> "No início de um projeto, é comum ver controllers com 300 linhas, cheios de regras de negócio misturadas com queries de banco e blocos `try/catch` copiados e colados dez vezes. Isso até funciona no primeiro mês, mas depois se torna impossível de testar, manter ou estender."

> "Nesta aula de 10 minutos, nós vamos revisitar os princípios do SOLID e da Arquitetura Limpa e aplicar na prática no `plantei-api`: vamos desacoplar rotas, isolar regras de negócio e criar um tratamento centralizado e elegante de erros."

---

## 📐 PARTE 1 — Os Princípios SOLID no Backend Moderno (1:00 – 3:30)

**[TELA: Diagrama do acrônimo SOLID com destaque para S e D aplicados a Node.js]**

> "O acrônimo **SOLID**, criado por Robert C. Martin (Uncle Bob), é a bússola de qualquer arquiteto de software. Vamos ver como esses 5 princípios se manifestam na prática no nosso backend:"

```text
┌─────────────────────────────────────────────────────────────┐
│                    OS PRINCÍPIOS SOLID                      │
├────────────────────────┬────────────────────────────────────┤
│ S - Single Resp.       │ Uma classe/função deve ter apenas  │
│     (Responsab. Única) │ um motivo para mudar               │
├────────────────────────┼────────────────────────────────────┤
│ O - Open/Closed        │ Aberto para extensão, fechado para │
│     (Aberto/Fechado)   │ modificação direta                 │
├────────────────────────┼────────────────────────────────────┤
│ L - Liskov Substitut.  │ Subtipos devem ser substituíveis   │
│     (Substituição)     │ por seus tipos base sem quebra     │
├────────────────────────┼────────────────────────────────────┤
│ I - Interface Segregat.│ Clientes não devem depender de     │
│     (Segregação)       │ métodos que não utilizam           │
├────────────────────────┼────────────────────────────────────┤
│ D - Dependency Invers. │ Dependa de abstrações, não de      │
│     (Inversão de Dep.) │ implementações concretas           │
└────────────────────────┴────────────────────────────────────┘
```

> "No `plantei-api`, aplicamos o **Princípio da Responsabilidade Única (SRP)** de forma cirúrgica:"
> - O **Controller** tem uma única responsabilidade: receber a requisição HTTP, extrair os dados e devolver a resposta adequada (`res.status(200).json(...)`). Ele **nunca** executa queries de banco de dados diretamente!
> - O **Service** tem a responsabilidade de executar a regra de negócio: verificar se o produto existe, calcular desconto, validar estoque.

---

## 🧱 PARTE 2 — Clean Architecture e Camadas no `plantei-api` (3:30 – 5:30)

**[TELA: Abrir lado a lado `src/controllers/produto.controller.js` e `src/services/produto.service.js`]**

> "Vejam a diferença prática. Antigamente, muitos desenvolvedores escreviam controllers assim:"

```javascript
// ❌ MÁ PRÁTICA: Controller acoplado com banco e lógica de negócio
export const criarProduto = async (req, res) => {
  try {
    if (!req.body.nome || req.body.preco <= 0) {
      return res.status(400).json({ erro: 'Dados inválidos' });
    }
    const existe = await Produto.findOne({ where: { nome: req.body.nome } });
    if (existe) {
      return res.status(409).json({ erro: 'Produto já existe' });
    }
    const produto = await Produto.create(req.body);
    return res.status(201).json(produto);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro interno' });
  }
};
```

> "Isso é horrível para testar: você não consegue testar a validação sem instanciar objetos falsos de requisição HTTP do Express."

> "Agora olhem a refatoração que adotamos no `plantei-api` seguindo Clean Architecture:"

```javascript
// ✅ BOA PRÁTICA: Controller enxuto que delega para o Service
export const criarProduto = async (req, res, next) => {
  try {
    const novoProduto = await produtoService.criar(req.body);
    return res.status(201).json(novoProduto);
  } catch (error) {
    next(error); // Encaminha para o middleware centralizado de erros!
  }
};
```

> "Toda a inteligência e validação migrou para `src/services/produto.service.js`. O service é uma classe ou módulo puro, que pode ser testado em milissegundos sem qualquer dependência do Express!"

---

## 🛡️ PARTE 3 — Tratamento Centralizado de Erros com Middleware (5:30 – 7:30)

**[TELA: Abrir o arquivo `src/middlewares/error.middleware.js` e demonstrar a captura global]**

> "Reparem naquele `next(error)` que colocamos no controller. Ele aciona o nosso **Error Handling Middleware Centralizado** em `src/middlewares/error.middleware.js`:"

```javascript
// src/middlewares/error.middleware.js
import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';

  // Log estruturado com rastreabilidade
  logger.error({
    message: err.message,
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  return res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
};
```

> "Com esse padrão arquitetural, nós eliminamos mais de 50 blocos `catch` redundantes pela aplicação inteira. E se amanhã precisarmos mudar o formato de retorno de erro da API, alteramos em **um único arquivo**."

---

## ⚡ PARTE 4 — Funções Puras e o Princípio DRY (7:30 – 8:50)

**[TELA: Abrir `src/utils/hash.js` e destacar as funções puras de criptografia]**

> "Outro conceito fundamental da Engenharia Limpa é o **DRY (Don't Repeat Yourself)** e o uso de funções puras sempre que possível."

> "Vejam nosso utilitário `src/utils/hash.js`:"

```javascript
// src/utils/hash.js
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const gerarHash = async (textoPlano) => {
  if (!textoPlano) throw new Error('Texto plano é obrigatório para gerar hash');
  return bcrypt.hash(textoPlano, SALT_ROUNDS);
};

export const compararHash = async (textoPlano, hash) => {
  if (!textoPlano || !hash) return false;
  return bcrypt.compare(textoPlano, hash);
};
```

> "Essas funções são previsíveis: dadas as mesmas entradas, produzem saídas consistentes sem causar efeitos colaterais globais. Isso facilita a leitura, a reutilização em qualquer parte do sistema e a criação de testes unitários."

---

## 🎯 CONCLUSÃO E PRÓXIMOS PASSOS (8:50 – 10:00)

**[TELA: Professor em destaque com resumo dos benefícios de Clean Code]**

> "Vejam a diferença de um projeto construído com princípios de Engenharia Limpa: o `plantei-api` agora possui limites arquiteturais claros, responsabilidades bem definidas e tratamento de erros consistente."

> "Com uma base de código tão bem estruturada, nós temos o terreno perfeito para dar o próximo salto de produtividade."

> "Na **Disciplina 3: IA como Assistente**, vamos aprender como turbinar o nosso dia a dia de desenvolvimento utilizando Inteligência Artificial para refatorar código legado, identificar code smells e realizar code reviews profissionais em segundos."

> "Excelente trabalho e nos vemos na próxima aula!"

---

## 📋 CHECKLIST RÁPIDO DO GRAVADOR

- [ ] **0:00** Abertura citando a frase de Martin Fowler e o problema de código amador.
- [ ] **1:00** Apresentar a tabela com o acrônimo SOLID e focar em SRP e DIP.
- [ ] **3:30** Contrastar o controller poluído vs controller limpo que delega para o Service.
- [ ] **5:30** Demonstrar o `src/middlewares/error.middleware.js` e a eliminação de try/catches duplicados.
- [ ] **7:30** Exibir `src/utils/hash.js` ilustrando funções puras e o princípio DRY.
- [ ] **8:50** Concluir e fazer o gancho direto para a Disciplina 3 (IA como Assistente).

