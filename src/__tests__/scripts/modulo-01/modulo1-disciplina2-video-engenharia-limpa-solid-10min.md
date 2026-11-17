# Módulo 1 — Engenharia de Software e IA Aplicada
# Disciplina 2 — Revisão de Engenharia Limpa: POO, SOLID e Clean Architecture no Plantei-API
**Duração estimada:** 9–10 min  
**Projeto:** `plantei-api`  
**Arquivos de referência:** `src/routes/produto.routes.js` · `src/controllers/produto.controller.js` · `src/services/produto.service.js` · `src/middlewares/error.middleware.js` · `src/utils/hash.js`  
**Objetivo:** Revisitar os princípios de Programação Orientada a Objetos, o acrônimo SOLID e os fundamentos de Clean Architecture através do código real do `plantei-api`, demonstrando a separação de responsabilidades entre rotas, controllers, services e middlewares em até 10 minutos.

---

## 🎬 ABERTURA (0:00 – 1:15)

**[TELA: Editor com comparação visual lado a lado: à esquerda um controller amador gigante com SQL, validação manual e try/catch repetidos; à direita o fluxo modular e desacoplado do `plantei-api` com Controller -> Service -> Model]**

> "Fala devs, sejam muito bem-vindos à nossa aula de **Engenharia Limpa, SOLID e Clean Architecture**!"

> "Existe uma frase clássica de Martin Fowler que define a engenharia de software profissional: *'Qualquer tolo pode escrever código que um computador entenda. Bons programadores escrevem código que humanos podem entender.'*"

> "No início de muitos projetos em Node.js, é tentador colocar tudo dentro do controller: receber a requisição, validar campos, abrir conexão com o banco e espalhar blocos `try/catch` copiados e colados. Isso até funciona nas primeiras semanas, mas logo se torna impossível de testar, manter ou escalar."

> "Nesta aula de 10 minutos, nós vamos analisar como o **`plantei-api`** foi desenhado com base no SOLID e na Clean Architecture: vamos ver o papel enxuto dos Controllers, a pureza dos Services e o poder do pipeline de Middlewares."

---

## 📐 PARTE 1 — Os Princípios SOLID no Backend Node.js (1:15 – 3:45)

**[TELA: Diagrama do acrônimo SOLID com foco na aplicação prática no ecossistema Express e JavaScript]**

> "O acrônimo **SOLID**, consolidado por Robert C. Martin (Uncle Bob), é a bússola para mantermos sistemas modulares. No backend moderno com Node.js e Express, esses princípios se traduzem em escolhas arquiteturais muito claras:"

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SOLID NO PLANTEI-API                                  │
├────────────────────────┬────────────────────────────────────────────────────┤
│ S - Single Resp.       │ Controller lida com HTTP; Service com dados/negócio│
│                        │ Error Middleware centraliza o tratamento de erros. │
├────────────────────────┼────────────────────────────────────────────────────┤
│ O - Open/Closed        │ Rotas estendidas por Middlewares (Auth, Cache, RBAC)│
│                        │ sem alterar o código interno do Controller.        │
├────────────────────────┼────────────────────────────────────────────────────┤
│ L - Liskov Substitut.  │ Modelos compartilham o contrato base do Sequelize  │
│                        │ de forma previsível e intercambiável.              │
├────────────────────────┼────────────────────────────────────────────────────┤
│ I - Interface Segregat.│ Services recebem payloads específicos, nunca o     │
│                        │ objeto `req` monolítico do Express.                │
├────────────────────────┼────────────────────────────────────────────────────┤
│ D - Dependency Invers. │ Controllers dependem de camadas de serviço,        │
│                        │ desacoplados de infraestrutura direta de banco.    │
└────────────────────────┴────────────────────────────────────────────────────┘
```

> "Observem o **S (Responsabilidade Única)** e o **I (Segregação de Interfaces)**:
> O nosso controller nunca repassa o objeto `req` inteiro do Express para dentro do Service. Ele extrai apenas o que o Service precisa — seja `req.body` ou `req.params.id`. Dessa forma, o Service fica 100% agnóstico ao protocolo de entrada, podendo ser chamado por uma fila RabbitMQ, um worker em background ou um teste automatizado."

---

## 🧱 PARTE 2 — Clean Architecture: Do Controller ao Service (3:45 – 5:45)

**[TELA: Abrir em split screen `src/controllers/produto.controller.js` e `src/services/produto.service.js`]**

> "Vejam na prática o método de criação em `src/controllers/produto.controller.js`:"

```javascript
// src/controllers/produto.controller.js
async criar(req, res, next) {
  try {
    const novo = await produtoService.criar(req.body);

    log.success(`[Produto] Criado: ${novo.nome}`);

    return res.status(201).json({
      mensagem: 'Produto criado com sucesso!',
      data: novo,
    });
  } catch (err) {
    log.error(err);
    next(err); // Encaminha para o middleware centralizado de erros
  }
}
```

> "Percebam que o controller faz estritamente o trabalho de orquestração HTTP:
> 1. Recebe a requisição e repassa o payload para o service (`produtoService.criar`);
> 2. Registra o log estruturado de sucesso;
> 3. Devolve a resposta padronizada com status HTTP 201."

> "E agora olhem para o `src/services/produto.service.js`:"

```javascript
// src/services/produto.service.js
import { Produto } from '../models/Produto.js';

class ProdutoService {
  listar() {
    return Produto.findAll({});
  }

  criar(payload) {
    return Produto.create(payload);
  }

  buscarPorId(id) {
    return Produto.findByPk(id);
  }
}

export default new ProdutoService();
```

> "Aqui reside o desacoplamento: o `ProdutoService` é uma classe pura. Podemos testar qualquer método dela em milissegundos usando Jest, sem precisar instanciar servidor Express ou simular requisições HTTP!"

---

## ⚡ PARTE 3 — Open/Closed Principle na Prática com Middlewares (5:45 – 7:15)

**[TELA: Abrir `src/routes/produto.routes.js` e destacar o pipeline de middlewares]**

> "Agora vamos ver o **Open/Closed Principle (Aberto para Extensão, Fechado para Modificação)** em ação no Express. Reparem na rota GET de listagem em `src/routes/produto.routes.js`:"

```javascript
// src/routes/produto.routes.js
router.get(
  "/",
  autorizarPermissao('PRODUTO_LISTAR'),
  cacheMiddleware(60), // 👈 Cacheia a vitrine de produtos por 60 segundos
  produtoController.listar
);
```

> "Imaginem o seguinte requisito de negócio: *'A vitrine de produtos está sobrecarregando o banco; precisamos colocar cache Redis de 60 segundos e garantir que apenas perfis autorizados possam consultar.'*"

> "Em um projeto sem Engenharia Limpa, o desenvolvedor abriria o controller, criaria ifs de autenticação e adicionaria lógica de leitura e escrita do Redis misturada com a listagem."

> "No `plantei-api`, o `produtoController.listar` permaneceu **fechado para modificação**. Nós **estendemos** a funcionalidade simplesmente encadeando `autorizarPermissao` e `cacheMiddleware` na pipeline da rota. Isso é OCP aplicado com perfeição!"

---

## 🛡️ PARTE 4 — Tratamento Centralizado de Erros e Funções Utilitárias Puras (7:15 – 8:45)

**[TELA: Abrir `src/middlewares/error.middleware.js` e em seguida `src/utils/hash.js`]**

> "E como lidamos com exceções? Graças ao `next(err)` no controller, centralizamos todo o tratamento em um único ponto:"

```javascript
// src/middlewares/error.middleware.js
export default function errorMiddleware(err, req, res, next) {
  if (err.name === 'SequelizeValidationError') {
    log.warn(err.message, { correlationId: req.correlationId, statusCode: 400 });
    return res.status(400).json({
      erro: err.errors.map(e => e.message),
    });
  }

  log.error(err, { correlationId: req.correlationId, statusCode: 500 });
  return res.status(500).json({
    erro: err.message || 'Erro interno do servidor',
  });
}
```

> "Vejam que se o Sequelize disparar um erro de validação (como campo obrigatório faltando ou tamanho inválido), o middleware intercepta, registra o log com `correlationId` para auditoria e devolve status 400 formatado. Eliminamos dezenas de `catch` repetidos pelo projeto inteiro."

> "E para operações auxiliares, aplicamos o princípio **DRY (Don't Repeat Yourself)** com funções puras e determinísticas em `src/utils/hash.js`:"

```javascript
// src/utils/hash.js
import bcrypt from 'bcrypt';

export const gerarHash = async (senha) => bcrypt.hash(senha, 10);
export const compararHash = async (senha, hash) => bcrypt.compare(senha, hash);
```

---

## 🎯 CONCLUSÃO E PRÓXIMOS PASSOS (8:45 – 10:00)

**[TELA: Professor em destaque com diagrama síntese do fluxo da requisição no Plantei-API]**

> "Vejam como a arquitetura do `plantei-api` se organiza de forma harmoniosa:
> - **Rotas & Middlewares**: Validação de token, controle de acesso e cache Redis (OCP);
> - **Controllers**: Recepção e resposta de protocolo HTTP (SRP);
> - **Services**: Regras de negócio e persistência de dados (DIP e alta testabilidade);
> - **Error Middleware**: Rastreabilidade com correlationId e respostas de erro uniformes."

> "Com essa base sólida e limpa, nosso projeto está pronto para receber testes automatizados e automações inteligentes."

> "Na próxima aula, a **Disciplina 3: IA como Assistente**, vamos aprender a utilizar Inteligência Artificial para refatorar código, identificar code smells e realizar revisões arquiteturais completas em segundos."

> "Obrigado e até a próxima aula!"

---

## 📋 CHECKLIST RÁPIDO DO GRAVADOR

- [ ] **0:00** Abertura citando Martin Fowler e o contraste entre controller inchado vs modular.
- [ ] **1:15** Exibir tabela do SOLID contextualizada para Node.js/Express (ênfase em SRP e ISP).
- [ ] **3:45** Split screen entre `src/controllers/produto.controller.js` e `src/services/produto.service.js`.
- [ ] **5:45** Destacar em `src/routes/produto.routes.js` o OCP via middlewares (`cacheMiddleware` e `autorizarPermissao`).
- [ ] **7:15** Demonstrar captura de erros em `src/middlewares/error.middleware.js` e funções puras em `src/utils/hash.js`.
- [ ] **8:45** Síntese final das 4 camadas e gancho para a Disciplina 3 (IA como Assistente).
