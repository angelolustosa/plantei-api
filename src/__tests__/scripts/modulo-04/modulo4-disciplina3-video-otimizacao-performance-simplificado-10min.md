# Módulo 4 — System Design e Arquitetura Escalável com IA
# Disciplina 3 — Otimização e Performance: Caçando Gargalos, Cache com Redis e Testes de Carga com k6 (Versão Didática Simplificada)
**Duração estimada:** 9–10 min  
**Projeto:** `plantei-api`  
**Arquivos de referência:** `src/controllers/produto.controller.js` · `docker-compose.yml` · `src/config/redis.js` · `src/middlewares/cache.middleware.js` · `src/routes/produto.routes.js` · `src/app.js` · `load-test.js`  
**Objetivo:** Ensinar de forma simples, prática e sem atrito os 4 pilares da ementa oficial: eliminar o clássico problema N+1 no Sequelize, implementar a estratégia Cache-Aside com Redis, aplicar paginação e compressão de resposta, e validar o ganho de velocidade com testes de carga k6 e análise assistida por IA.

---

## 🎬 ABERTURA & CONTEXTO (0:00 – 1:00)

**[TELA: Professor no terminal do VS Code, mostrando o Swagger UI ou Postman respondendo a rota de produtos em 250ms, e em seguida mostrando a mesma rota respondendo em 3ms com cache]**

> "Fala devs! Sejam muito bem-vindos à nossa **Disciplina 3: Otimização e Performance**!"

> "Um sistema bem desenhado e documentado precisa cumprir uma promessa essencial ao usuário: **velocidade**. No mundo real, um atraso de apenas 1 segundo no carregamento de uma página pode derrubar as vendas em mais de 20% e multiplicar a conta de servidores na nuvem."

> "E aqui vai uma regra de ouro: **subir o tamanho da máquina (CPU e RAM) não resolve código ineficiente**. Se a sua aplicação faz 50 consultas ao banco a cada clique, você só vai gastar mais dinheiro para continuar entregando um sistema lento."

> "Nesta aula de 10 minutos, nós vamos aprender a caçar gargalos de forma descomplicada:
> 1. Resolver o famoso **problema N+1** no Sequelize;
> 2. Implementar **cache em memória com Redis** para a vitrine de produtos responder em 3ms;
> 3. Aplicar **paginação e compressão** de payload;
> 4. E validar todo o ganho de velocidade com um **teste de carga automatizado no k6**!"

---

## 🔍 PARTE 1 — Diagnóstico de Banco: O Problema N+1 (1:00 – 3:00)

**[TELA: Editor comparando o código ingênuo que dispara 51 queries com a solução de Eager Loading]**

> "O erro de performance mais comum em aplicações que usam ORMs (como Sequelize, TypeORM ou Prisma) é o **Problema das N+1 Consultas**."

> "Imagine que você quer listar 50 produtos da Plantei e exibir o nome da categoria de cada um. Se você fizer isso de forma ingênua:"

```javascript
// ❌ CÓDIGO INEFICIENTE (Gera 1 + 50 = 51 queries no banco!)
const produtos = await Produto.findAll(); // 1 query inicial
for (const p of produtos) {
  const categoria = await p.getCategoria(); // +50 queries separadas no banco!
}
```

> "Em vez de 1 consulta rápida, você abre 51 idas e vindas de rede. O banco de dados fica sobrecarregado e a resposta demora centenas de milissegundos."

```mermaid
sequenceDiagram
    autonumber
    actor API as Backend Express
    participant DB as PostgreSQL
    Note over API,DB: Problema N+1: 51 idas e voltas na rede!
    API->>DB: 1. SELECT * FROM produtos LIMIT 50;
    loop Para cada produto (50 vezes)
        API->>DB: SELECT * FROM categorias WHERE id = ?;
    end
    Note over API,DB: Solução com Eager Loading: 1 única ida e volta!
    API->>DB: SELECT p.*, c.nome FROM produtos p LEFT JOIN categorias c ON ...;
```

> "A solução correta é o **Eager Loading** (carregamento adiantado com `JOIN`):"

```javascript
// ✅ CÓDIGO OTIMIZADO (1 única query com JOIN):
const produtos = await Produto.findAll({
  attributes: ['id', 'nome', 'preco', 'estoque'], // Pega só o necessário
  include: [{
    model: Categoria,
    as: 'categoria',
    attributes: ['id', 'nome']
  }],
  limit: 20
});
```

> "Pronto! O banco resolve tudo internamente em **uma única consulta**, devolvendo os produtos e suas categorias de uma só vez."

---

## ⚡ PARTE 2 — Cache Estratégico com Redis (3:00 – 5:15)

**[TELA: Terminal subindo o container do Redis em 1 comando e código do middleware de cache]**

> "Mesmo com queries otimizadas, bater no disco do banco de dados para buscar produtos que mudam raramente é um desperdício. Para rotas de leitura intensa (`GET /api/produtos`), aplicamos o padrão **Cache-Aside com Redis**."

> "Pense no **Redis** como a gaveta da sua mesa: pegar algo na gaveta (RAM) leva 2 milissegundos. Ir buscar no galpão de estoque (PostgreSQL no disco) leva 200 milissegundos!"

```mermaid
flowchart TD
    Req["Requisição GET /api/produtos"] --> Check{"O dado está na Gaveta (Redis)?"}
    Check -- "SIM (Cache HIT)" --> Hit["Devolve direto da Memória RAM (3ms)! ⚡<br/>Header: X-Cache: HIT"]
    Check -- "NÃO (Cache MISS)" --> Miss["Busca no PostgreSQL (Disco) ➔ Salva no Redis (60s) ➔ Devolve<br/>Header: X-Cache: MISS"]
```

### 2.1 Subindo o Redis com 1 Comando (Docker)
> "No terminal do projeto, basta rodar:"

```bash
docker compose up -d redis
```

> "Testamos com o comando `ping`:"
```bash
docker exec plantei-redis redis-cli ping
# Resposta: PONG!
```

---

### 2.2 Configurações no Arquivo `.env`
> "No arquivo `.env` da aplicação, declaramos as variáveis de conexão com o Redis seguindo as boas práticas do 12-Factor App:"

```env
# Cache Distribuído com Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379
```

---

### 2.3 Criando a Conexão com o Redis (`src/config/redis.js`)
> "Para a nossa API conversar com o container do Redis, criamos o arquivo de conexão `src/config/redis.js` usando o client oficial do Node.js (`npm install redis`):"

```javascript
// src/config/redis.js
import { createClient } from 'redis';
import { log } from '../utils/logger.js';

// 1. Lê a URL do .env ou usa o padrão localhost:6379 como fallback
const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

// 2. Cria o cliente com estratégia de reconexão automática inteligente
const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        log.error('[Redis] Limite de tentativas de reconexão excedido.');
        return new Error('Redis connection failed');
      }
      return Math.min(retries * 100, 3000); // Backoff exponencial: tenta a cada 100ms, 200ms... até o máximo de 3s
    }
  }
});

// 3. Ouvintes de eventos para monitorar a saúde da conexão
redisClient.on('error', (err) => log.error(`[Redis Error] ${err.message}`));
redisClient.on('connect', () => log.info('🔌 [Redis] Conectando ao servidor...'));
redisClient.on('ready', () => log.info('⚡ [Redis] Conectado e pronto para acelerar a API!'));

// 4. Conecta automaticamente na inicialização da aplicação
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    log.error(`[Redis] Falha inicial ao conectar no Redis: ${err.message}`);
  }
})();

export default redisClient;
```

---

### 2.4 O Que Significa Cada Bloco do `redis.js`? (Explicando para os Alunos)
> "Vamos entender por que esse arquivo foi construído assim:"
> 1. **`createClient({ url })`**: Cria a ponte TCP entre o Node.js e a porta 6379 do Redis.
> 2. **`reconnectStrategy (Backoff Exponencial)`**: Se o container do Redis for reiniciado, o Node.js não entra em pânico nem derruba a API. Ele tenta reconectar de forma suave (100ms, 200ms... até 3 segundos) até o Redis voltar.
> 3. **`redisClient.on('error' / 'ready')`**: São eventos assíncronos. Eles garantem que você veja mensagens claras no terminal (`[Redis Error]` ou `⚡ Conectado e pronto`) em vez de travamentos silenciosos.
> 4. **`await redisClient.connect()`**: A versão moderna (v4+) do Redis no Node.js é 100% baseada em Promises e async/await, garantindo que o client só comece a operar quando o canal de comunicação estiver de fato aberto.

---

### 2.5 Criando o Middleware de Cache (`src/middlewares/cache.middleware.js`)
> "Criamos uma função que intercepta a requisição. Se a resposta já estiver no Redis, ela entrega direto da memória sem chamar o banco de dados:"

```javascript
// src/middlewares/cache.middleware.js
import redisClient from '../config/redis.js';

export const cacheMiddleware = (tempoSegundos = 60) => async (req, res, next) => {
  // 1. Cria uma chave única baseada na URL chamada (ex: 'cache:/api/produtos')
  const chave = `cache:${req.originalUrl}`;

  try {
    // 2. Procura se esse resultado já está gravado na memória RAM do Redis
    const dadoEmCache = await redisClient.get(chave);

    if (dadoEmCache) {
      // 🎯 Cache HIT: Achou no Redis! Responde imediatamente em ~3ms
      res.setHeader('X-Cache', 'HIT');
      return res.json(JSON.parse(dadoEmCache));
    }

    // 3. Cache MISS: Se não achou, interceptamos o res.json para gravar no Redis quando o banco responder
    const jsonOriginal = res.json.bind(res);
    res.json = (corpo) => {
      res.setHeader('X-Cache', 'MISS');
      // Salva no Redis com tempo de expiração (TTL) de 60 segundos
      redisClient.setEx(chave, tempoSegundos, JSON.stringify(corpo));
      return jsonOriginal(corpo);
    };

    next(); // Passa a vez para o controller buscar no PostgreSQL
  } catch (err) {
    next(); // Fallback de segurança: se o Redis falhar, segue para o banco sem travar a API
  }
};
```

---

### 2.6 O Que Significa Cada Linha Desse Middleware? (Explicando para o Aluno)
> "Vamos entender a mágica que está acontecendo aqui linha por linha:
> 1. **`const chave = 'cache:' + req.originalUrl`**: O cache precisa de um identificador único. Usar a URL garante que `/api/produtos` tenha um cache e `/api/produtos?limite=5` tenha outro cache separado.
> 2. **`await redisClient.get(chave)`**: Consulta a memória RAM do Redis. Se o dado existir, a resposta é entregue em 3 milissegundos e a requisição termina ali mesmo — o PostgreSQL nem fica sabendo!
> 3. **`res.setHeader('X-Cache', 'HIT' ou 'MISS')`**: É uma etiqueta nos cabeçalhos HTTP. Ela serve para você, o frontend ou ferramentas de monitoramento saberem na hora se a resposta veio rápida da memória (`HIT`) ou demorada do banco (`MISS`).
> 4. **`res.json = (corpo) => { redisClient.setEx(...) }`**: Esta é a sacada do padrão Cache-Aside! Como o controller ainda vai buscar no banco, nós interceptamos o momento em que ele envia o JSON para guardar uma cópia no Redis com prazo de validade (`setEx` com TTL de 60 segundos).
> 5. **`catch (err) { next(); }`**: Regra de resiliência corporativa. Se o container do Redis cair ou reiniciar, a API não quebra; ela simplesmente ignora o cache e busca direto do PostgreSQL."

---

### 2.7 Como Aplicar na Rota (`src/routes/produto.routes.js`)
**[TELA: Editor abrindo `src/routes/produto.routes.js`, importando o middleware e inserindo na rota GET]**

> "Agora veja como é simples plugar o cache. Abrimos o arquivo de rotas `src/routes/produto.routes.js`:"

```javascript
// src/routes/produto.routes.js
import { Router } from "express";
import { produtoController } from '../controllers/index.js';
import authMiddleware from "../middlewares/auth.middleware.js";
import { autorizarPermissao } from "../middlewares/autorizar.middleware.js";

// 1. IMPORTAMOS O MIDDLEWARE DE CACHE:
import { cacheMiddleware } from "../middlewares/cache.middleware.js";

const router = Router();

router.use(authMiddleware);

// 2. INSERIMOS O cacheMiddleware(60) ANTES DO CONTROLLER:
router.get(
  "/",
  autorizarPermissao('PRODUTO_LISTAR'),
  cacheMiddleware(60), // 👈 Cacheia a vitrine de produtos por 60 segundos
  produtoController.listar
);

router.get("/:id", cacheMiddleware(30), produtoController.buscarPorId);

export default router;
```

---

### 2.8 Como Testar e Comprovar a Velocidade no Swagger UI (Passo a Passo)
**[TELA: Swagger UI em `http://localhost:5000/api-docs` autenticando e executando a rota de produtos]**

> "Agora vamos ver a mágica acontecer diante dos nossos olhos:"
> 1. Abra o **Swagger UI** (`http://localhost:5000/api-docs`).
> 2. Faça o login em `POST /api/auth/login` com o usuário Administrador:
>    - **E-mail:** `admin@email.com`
>    - **Senha:** `123456`
> 3. Copie o `token` JWT retornado, clique no botão verde **Authorize** no topo do Swagger e cole o token.
> 4. Vá no endpoint `GET /api/produtos` e clique em **Try it out ➔ Execute**:
>    - **1ª Chamada (Cache MISS):** Olhe os cabeçalhos da resposta (`Response headers`). Você verá `x-cache: MISS` e o tempo levará cerca de **150ms a 250ms**, porque foi buscar no PostgreSQL e gravou no Redis.
>    - **2ª Chamada (Cache HIT):** Clique em **Execute** novamente. Olhe o cabeçalho: ele mudou para `x-cache: HIT` e o tempo caiu para **2 a 4 milissegundos**!
> 
> "A nossa API agora responde quase 100 vezes mais rápido, entregando da memória sem tocar no banco de dados!"

---

## 📜 PARTE 3 — Paginação Eficiente e Compressão (5:15 – 7:00)

**[TELA: Comparando Offset vs Paginação por Cursor e mostrando o `compression()` no Express]**

> "Outro gargalo comum quando a base de dados cresce é a paginação. Usar `OFFSET 50000` obriga o banco a ler e descartar cinquenta mil registros antes de entregar os 20 que você pediu."

```mermaid
flowchart LR
    subgraph Offset Lento
        A["OFFSET 50.000"] -->|Lê e descarta 50.000 linhas no disco| B["Entrega 20 itens"]
    end
    subgraph Cursor Rápido
        C["WHERE id < ultimoId"] -->|Busca direta pelo índice B-Tree em O(log n)| D["Entrega 20 itens instantâneo"]
    end
```

> "Para alta escala, utilizamos a **Paginação Baseada em Cursor (Keyset Pagination)**: passamos o ID do último item visto (`WHERE id < :ultimoId ORDER BY id DESC LIMIT 20`), garantindo tempo de resposta constante seja na página 1 ou na página 1.000."

> "Além disso, ativamos a compressão no `src/app.js` com o pacote `compression`:"

```javascript
// src/app.js
import compression from 'compression';

app.use(compression()); // Comprime os JSONs via Gzip (reduz o tamanho dos dados em até 75%)
```

---

## 🚀 PARTE 4 — Testes de Carga com k6 & Análise com IA (7:00 – 8:45)

**[TELA: Terminal executando o k6 e exibindo o relatório visual de métricas]**

> "Como provamos cientificamente que a otimização funcionou? Com testes de estresse automatizados usando o **k6**."

> "Com a nossa API ligada em um terminal (`npm start`), abrimos um segundo terminal e disparamos o teste de carga:"

```bash
# Executa o teste de carga via Docker:
docker run --rm -i grafana/k6 run -e API_URL=http://host.docker.internal:5000 - <load-test.js
```

### O que nós analisamos no relatório final?

```mermaid
flowchart LR
    K6["k6 (Centenas de Usuários Virtuais)"] -->|Testa GET /api/produtos| API["Plantei API"]
    API -->|99% respondidas pela Memória RAM| Redis[("Redis")]
    API --> Metrics["Métricas do k6:<br/>✓ Falhas: 0.00%<br/>✓ Tempo p95: < 20ms<br/>✓ Vazão: > 1.000 req/s"]
```

> "Ao término do teste, olhamos três indicadores principais:
> 1. **`http_req_failed`**: Deve estar em **0.00%** (nenhuma requisição caiu).
> 2. **`p(95)`**: 95% de todas as pessoas receberam a resposta em **menos de 20ms** (graças ao cache do Redis).
> 3. **`http_reqs`**: A quantidade de requisições por segundo saltou de 75 req/s para **mais de 1.000 req/s**!"

---

### Análise Assistida por IA:
> "Podemos pegar o resumo do k6 e pedir para a IA avaliar a saúde da arquitetura:"

```markdown
Prompt para a IA:
"Analise este relatório de teste de carga do k6 para o endpoint GET /api/produtos da Plantei API:
- Total de requisições: 15.000
- Vazão: 1.100 req/s
- Tempo médio: 6ms | p95: 18ms | p99: 80ms
- Taxa de falhas: 0.00%
Avalie se o sistema suporta uma campanha de Black Friday com segurança."
```

> "A IA confirma a resiliência da arquitetura e atesta que o cache do Redis blindou o banco de dados relacional contra saturação!"

---

## 🎯 CONCLUSÃO E ENCERRAMENTO DA FORMAÇÃO (8:45 – 10:00)

**[TELA: Professor em destaque com retrospectiva comemorativa de todos os 4 módulos]**

> "Parabéns, devs! Chegamos ao final da nossa jornada completa!"

> "Olhem para trás e vejam tudo o que construímos ao longo desses 4 módulos:
> - No **Módulo 1**, dominamos Engenharia Limpa, boas práticas e IA como copiloto;
> - No **Módulo 2**, blindamos o código com a Pirâmide de Testes e automação de CI/CD;
> - No **Módulo 3**, estabelecemos a Cultura DevOps, containers seguros com Docker e Observabilidade estruturada;
> - E aqui no **Módulo 4**, desenhamos uma arquitetura madura, documentamos com Swagger e OpenAPI, e atingimos performance de alta escala com Redis e k6!"

> "Você agora domina o ciclo completo: sabe como projetar, codificar, testar, automatizar, documentar e otimizar sistemas modernos de software."

> "Coloque essas técnicas em prática no seu dia a dia profissional e muito sucesso na sua carreira! Até a próxima e bons códigos!"

---

## 📋 CHECKLIST RÁPIDO DO GRAVADOR

- [ ] **0:00** Abertura destacando que escala vertical (mais CPU/RAM) é paliativo caro para código ruim.
- [ ] **1:00** Demonstrar o problema N+1 no log do Sequelize e a correção com Eager Loading (`include`).
- [ ] **3:00** Subir o Redis via Docker, mostrar `src/config/redis.js`, plugar o `cacheMiddleware` e testar no Swagger vendo o `X-Cache: HIT` em 3ms.
- [ ] **5:15** Explicar paginação por cursor e middleware de compressão (`compression()`).
- [ ] **7:00** Rodar o k6 no terminal, mostrar o p95 caindo para menos de 20ms e analisar com o prompt de IA.
- [ ] **8:45** Fazer o fechamento comemorativo de toda a jornada dos 4 módulos!
