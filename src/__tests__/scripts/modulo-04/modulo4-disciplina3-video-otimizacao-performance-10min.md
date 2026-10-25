# Módulo 4 — System Design e Arquitetura Escalável com IA
# Disciplina 3 — Otimização e Performance: Caçando Gargalos, Cache com Redis e Testes de Carga com k6
**Duração estimada:** 9–10 min  
**Projeto:** `plantei-api`  
**Arquivos de referência:** `src/controllers/produto.controller.js` · `src/config/database.js` · `src/middlewares/cache.middleware.js` · `load-test.js`  
**Objetivo:** Identificar e solucionar gargalos críticos de banco de dados (o problema N+1 no Sequelize), implementar estratégia de Cache-Aside com Redis para leituras intensas, aplicar paginação eficiente e executar testes de estresse com k6 analisando percentis (p95, p99) assistidos por IA em até 10 minutos.

---

## 🎬 ABERTURA (0:00 – 1:00)

**[TELA: Gráficos de tempo de resposta em milissegundos caindo de 850ms para 12ms após otimização, terminal com teste de carga rodando]**

> "Fala devs, sejam muito bem-vindos à **Disciplina 3: Otimização e Performance**!"

> "Um sistema bem desenhado e documentado precisa cumprir uma promessa crucial ao usuário: **velocidade**. No mundo real, um atraso de apenas 1 segundo no carregamento de uma página pode reduzir as conversões de venda em mais de 20% e quadruplicar os custos de servidores na nuvem."

> "Muitos times tentam resolver lentidão apenas aumentando o tamanho da máquina (escala vertical cara). Mas se o código tem um gargalo de banco de dados, colocar mais CPU só faz o sistema gastar mais dinheiro para continuar lento."

> "Nesta última aula de 10 minutos, nós vamos aprender a caçar gargalos de verdade: vamos resolver o famoso problema N+1 no Sequelize, implementar cache com Redis para a vitrine de produtos do `plantei-api` e validar tudo com testes de carga automatizados com o k6."

---

## 🔍 PARTE 1 — Caçando o Problema N+1 e Otimizando Queries (1:00 – 3:15)

**[TELA: Editor exibindo o log SQL no terminal com dezenas de `SELECT` sendo disparados sequencialmente]**

> "O erro de performance número 1 em aplicações com ORMs (como Sequelize, TypeORM ou Prisma) é o **Problema das N+1 Consultas**."

> "Imagine que na rota de produtos do `plantei-api` você precisa listar 50 produtos e a categoria de cada um. Se você fizer isso de forma ingênua:"

```javascript
// CÓDIGO INEFICIENTE (Gera 1 + 50 = 51 queries no banco!)
const produtos = await Produto.findAll(); // 1 query
for (const p of produtos) {
  const categoria = await p.getCategoria(); // +50 queries individuais!
}
```

> "Isso destrói o banco de dados. Em vez de 1 consulta rápida, você abre 51 idas e vindas de rede (Network Round Trips)."

> "A solução correta é o **Eager Loading com JOIN otimizado** e índices adequados:"

```javascript
// CÓDIGO OTIMIZADO (1 única query com INNER/LEFT JOIN)
const produtos = await Produto.findAll({
  attributes: ['id', 'nome', 'preco', 'estoque'], // Seleciona apenas as colunas necessárias
  include: [{
    model: Categoria,
    as: 'categoria',
    attributes: ['id', 'nome']
  }],
  limit: 20,
  order: [['id', 'DESC']]
});
```

> "E no PostgreSQL, executamos `EXPLAIN ANALYZE` na query gerada para confirmar que o banco está utilizando índices indexados (`Index Scan`), e não varrendo a tabela inteira (`Seq Scan`)."

---

## ⚡ PARTE 2 — Cache Distribuído com Redis (3:15 – 5:30)

**[TELA: Diagrama do padrão Cache-Aside e código do middleware de cache no Express]**

> "Mesmo com queries otimizadas, bater no disco do banco de dados para buscar produtos que mudam raramente é um desperdício. Para rotas de leitura intensa (`GET /api/produtos`), nós aplicamos o padrão **Cache-Aside com Redis**."

```text
Requisição GET /api/produtos
          │
          ▼
   [ Cache no Redis? ]
    ├── SIM (Cache Hit ➔ 3ms) ───► Retorna resposta imediatamente da memória RAM!
    └── NÃO (Cache Miss ➔ 45ms) ─► Busca no PostgreSQL ➔ Salva no Redis (TTL) ➔ Retorna
```

> "Vejam como criamos um middleware de cache reutilizável:"

```javascript
// src/middlewares/cache.middleware.js
import redisClient from '../config/redis.js';

export const cacheMiddleware = (durationSeconds = 60) => async (req, res, next) => {
  if (req.method !== 'GET') return next();

  const cacheKey = `cache:${req.originalUrl || req.url}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Intercepta a resposta original para gravar no Redis
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      res.setHeader('X-Cache', 'MISS');
      redisClient.setEx(cacheKey, durationSeconds, JSON.stringify(body));
      return originalJson(body);
    };

    next();
  } catch (err) {
    next(); // Fallback gracioso: se o Redis falhar, segue para o banco sem travar a API
  }
};
```

> "Aplicamos esse middleware na rota `produto.routes.js`. A primeira requisição leva 40ms; as próximas levam **2 a 4 milissegundos**, sem encostar no PostgreSQL!"

---

## 📜 PARTE 3 — Paginação Eficiente e Compressão de Resposta (5:30 – 7:00)

**[TELA: Editor exibindo a diferença entre paginação Offset vs Cursor-based e middleware de compressão]**

> "Outro grande gargalo ao lidar com milhares de itens é a paginação. Usar `OFFSET 100000` faz o banco escanear cem mil registros antes de retornar os 20 que você pediu."

> "Para alta escala, preferimos a **Paginação Baseada em Cursor (Keyset Pagination)**: passamos o ID do último item visualizado (`WHERE id < :ultimoId ORDER BY id DESC LIMIT 20`), garantindo tempo de resposta constante independente de estarmos na página 1 ou na página 1.000."

> "Além disso, ativamos o middleware de compressão no Express:"

```javascript
import compression from 'compression';
app.use(compression()); // Comprime payloads JSON via Gzip/Brotli, reduzindo consumo de rede em até 75%
```

---

## 🚀 PARTE 4 — Testes de Carga com k6 e Análise Assistida por IA (7:00 – 8:50)

**[TELA: Terminal executando teste com k6 com 200 usuários virtuais e exibindo métricas de p90, p95 e throughput]**

> "Como provamos cientificamente que a otimização funcionou? Com testes de carga automatizados usando o **k6**."

> "Criamos um script que simula 200 usuários simultâneos navegando na listagem de produtos:"

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Rampa de subida
    { duration: '1m', target: 200 },  // Carga máxima sustentada
    { duration: '30s', target: 0 },   // Resfriamento
  ],
  thresholds: {
    http_req_duration: ['p(95)<150'], // 95% das requisições devem responder em menos de 150ms
    http_req_failed: ['rate<0.01'],    // Erros devem ser inferiores a 1%
  },
};

export default function () {
  const res = http.get('http://localhost:3000/api/produtos');
  check(res, { 'status é 200': (r) => r.status === 200 });
  sleep(1);
}
```

**[TELA: Dividir tela com relatório do k6 e prompt de IA analisando métricas]**

> "Pegamos os resultados do k6 e passamos para a nossa IA:"

```markdown
Prompt para Análise de Performance:
"Analise o relatório do k6 para o endpoint GET /api/produtos:
- Total de requisições: 12.450
- Taxa de transferência: 415 req/s
- Latência média: 14ms | p95: 38ms | p99: 110ms | Falhas: 0.00%
Avalie a capacidade da arquitetura e identifique se o p99 indica saturação de CPU ou latência de rede esporádica."
```

> "A IA analisa o desvio padrão e confirma a saúde da esteira, garantindo que o sistema está pronto para suportar grandes volumes com total tranquilidade."

---

## 🎯 CONCLUSÃO E ENCERRAMENTO DA TRILHA (8:50 – 10:00)

**[TELA: Professor em destaque com retrospectiva visual de todos os 4 módulos]**

> "Parabéns, devs! Chegamos ao fim da nossa jornada completa!"

> "Olhem para trás e vejam a transformação:"
> - No **Módulo 1**, partimos de fundamentos sólidos de Engenharia Limpa e IA como copiloto.
> - No **Módulo 2**, blindamos o código com Pirâmide de Testes, mocks, geração automatizada e Quality Gates.
> - No **Módulo 3**, estabelecemos a Cultura DevOps, containers seguros com Docker e Observabilidade com IA.
> - E aqui no **Módulo 4**, desenhamos um System Design maduro, documentamos tudo com OpenAPI e C4 Model, e atingimos performance de alta escala com cache e testes de estresse."

> "Você agora domina não apenas como escrever código, mas como projetar, testar, automatizar, operar e escalar sistemas modernos de software."

> "Coloque essas práticas em produção no seu dia a dia e nos vemos nas próximas trilhas. Até lá e bons códigos!"

---

## 📋 CHECKLIST RÁPIDO DO GRAVADOR

- [ ] **0:00** Abertura destacando por que velocidade importa e por que subir máquina não corrige código ruim.
- [ ] **1:00** Demonstrar o problema N+1 no log do Sequelize e a correção com Eager Loading (`include`).
- [ ] **3:15** Explicar o padrão Cache-Aside com Redis e mostrar a resposta caindo para menos de 5ms.
- [ ] **5:30** Abordar paginação por cursor e middleware de compressão (`compression()`).
- [ ] **7:00** Executar o script do k6 no terminal e mostrar a análise de p95/p99 com IA.
- [ ] **8:50** Fazer o fechamento comemorativo de toda a jornada dos 4 módulos!
