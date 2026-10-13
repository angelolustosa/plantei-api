# Módulo 2 — Qualidade de Software e Testes com IA
# Vídeo 1.1 — Por que Testar? A Pirâmide de Qualidade + Configuração do Ambiente
**Duração estimada:** 8–10 min  
**Projeto:** `plantei-api`  
**Pré-requisito:** projeto rodando, nenhum teste configurado ainda

---

## 🎬 ABERTURA (0:00 – 0:40)

**[TELA: editor fechado, slide ou fundo neutro]**

> "Fala pessoal, bem-vindos ao Módulo 2. A gente vai falar sobre qualidade de software — e qualidade na prática significa uma coisa: testes."

> "Mas não só escrever testes pelo escrever. A ideia é entender *por que* testar, *o que* testar primeiro, e como isso protege o projeto quando a gente faz mudanças."

> "E a gente vai fazer tudo isso direto no projeto `plantei-api`, que a gente já conhece. Nada de exemplo artificial."

---

## 📐 PARTE 1 — A Pirâmide de Testes (0:40 – 3:30)

**[TELA: digitar no editor ou mostrar diagrama]**

> "Quando a gente fala de testes, existe uma estrutura clássica chamada Pirâmide de Testes. Ela diz o seguinte:"

```
        /\
       /  \
      / E2E \          ← poucos, lentos, caros
     /--------\
    /          \
   / Integração \      ← fluxo completo da aplicação
  /--------------\
 /                \
/   Unitários      \   ← muitos, rápidos, baratos
/____________________\
```

> "Na base temos os **testes unitários** — eles testam uma função isolada, sem banco, sem servidor, sem nada externo. São os mais baratos de escrever e os mais rápidos de rodar."

> "No meio temos os **testes de integração** — eles testam o fluxo completo: a requisição chega, passa pelo middleware, chama o service, bate no banco, e volta uma resposta. Mais lentos, mas testam que as peças se conectam certo."

> "No topo, **testes E2E** — End to End — simulam um usuário real no navegador clicando em botões. São os mais próximos da realidade, mas também os mais frágeis e lentos. A gente vai chegar lá."

> "A recomendação geral é: 70% dos seus testes devem ser unitários, 20% integração, e 10% E2E. Isso é a proporção que dá o melhor retorno."

---

## 🔍 PARTE 2 — Identificando o que testar no projeto (3:30 – 5:30)

**[TELA: abrir o projeto `plantei-api` no VS Code]**

> "Vamos abrir o nosso projeto e identificar os candidatos perfeitos para cada tipo de teste."

**[Abre `src/utils/hash.js`]**

> "Olha esse arquivo. `gerarHash` e `compararHash`. Duas funções que recebem parâmetros e retornam um resultado. Sem banco, sem API, sem nada externo. **Candidato perfeito para teste unitário.** A gente começa por aqui."

**[Abre `src/services/auth.service.js`]**

> "Agora o `auth.service.js`. Aqui tem lógica crítica: verificar senha, gerar JWT. Mas ele depende do banco e do JWT — então vai precisar de **mocks**. Teste unitário também, mas com uma técnica diferente."

**[Abre `src/models/Produto.js`]**

> "O model do Produto tem várias validações: nome obrigatório, preço não negativo, estoque não negativo. Essas regras precisam funcionar certo, e a gente consegue testar **sem banco** usando o Sequelize em modo de validação. Isso é muito poderoso."

**[Abre `src/middlewares/auth.middleware.js`]**

> "E o middleware de autenticação. Ele verifica o token JWT e busca o usuário no banco. Aqui a gente vai usar mocks para simular o JWT e o banco separadamente."

> "Resumindo: temos candidatos claros em quatro camadas diferentes do projeto. Vamos configurar o ambiente agora."

---

## ⚙️ PARTE 3 — Configurando o ambiente de testes (5:30 – 8:30)

**[TELA: abrir `package.json`]**

> "Antes de tudo, veja o que tem no `package.json` hoje:"

```json
"test": "echo \"Error: no test specified\" && exit 1"
```

> "Isso é o padrão quando você cria um projeto npm sem configurar testes. Vamos mudar isso agora."

**[TELA: terminal integrado do VS Code]**

> "Vamos instalar três pacotes como dependências de desenvolvimento:"

```bash
npm install --save-dev jest @jest/globals supertest
```

> "O **Jest** é o framework de testes — ele descobre os arquivos, roda os testes e gera os relatórios."

> "O **@jest/globals** fornece os helpers tipados para ESM — porque nosso projeto usa `\"type\": \"module\"`, o que traz uma particularidade."

> "O **Supertest** é uma biblioteca que permite fazer requisições HTTP no Express sem precisar subir um servidor de verdade. Usamos nos testes de integração."

**[TELA: `package.json` atualizado]**

> "Agora precisamos configurar o Jest no `package.json`. Tem um detalhe importante: nosso projeto usa ES Modules. O Jest ainda precisa de um flag especial para lidar com isso:"

```json
"scripts": {
  "test": "node --experimental-vm-modules node_modules/.bin/jest",
  "test:watch": "node --experimental-vm-modules node_modules/.bin/jest --watch",
  "test:coverage": "node --experimental-vm-modules node_modules/.bin/jest --coverage"
},
"jest": {
  "testEnvironment": "node",
  "testMatch": ["**/__tests__/**/*.test.js"]
}
```

> "O `--experimental-vm-modules` é o que permite o Jest trabalhar com `import/export` nativamente. Sem ele, você recebe erros de sintaxe."

**[TELA: criar pasta `src/__tests__/unit/` e `src/__tests__/integration/`]**

> "E criamos a estrutura de pastas. Dentro de `src`, uma pasta `__tests__` com duas subpastas: `unit` para testes unitários e `integration` para testes de integração."

```
src/
  __tests__/
    unit/
    integration/
```

> "Essa separação é intencional. A gente consegue rodar só os unitários — que são rápidos — durante o desenvolvimento, e os de integração no pipeline de CI."

---

## 🏁 ENCERRAMENTO (8:30 – 9:30)

**[TELA: estrutura de pastas no explorer do VS Code]**

> "Ambiente configurado. No próximo vídeo a gente escreve o primeiro teste de verdade — começando pelo `hash.js`, que é o exemplo mais limpo do padrão que a gente vai usar em todo o módulo: **Arrange, Act, Assert**."

> "Até lá."

---

## 📋 Checklist antes de gravar

- [ ] `npm install` já rodado, `node_modules` presente
- [ ] Projeto abrindo no VS Code sem erros
- [ ] `package.json` original (sem os scripts de teste) para mostrar o "antes"
- [ ] Terminal integrado visível e limpo
