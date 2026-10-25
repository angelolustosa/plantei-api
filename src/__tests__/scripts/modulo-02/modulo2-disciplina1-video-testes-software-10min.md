# Módulo 2 — Qualidade de Software e Testes com IA
# Disciplina 1 — Testes de Software: Da Pirâmide à Aplicação Prática no Projeto
**Duração estimada:** 9–10 min  
**Projeto:** `plantei-api`  
**Arquivos de referência:** `src/utils/hash.js` · `src/services/auth.service.js` · `src/__tests__/unit/hash.test.js` · `src/__tests__/unit/auth.service.test.js`  
**Objetivo:** Apresentar a pirâmide de testes e aplicar na prática testes unitários com padrão AAA e mocks no projeto real `plantei-api`, medindo a cobertura de código em até 10 minutos.

---

## 🎬 ABERTURA (0:00 – 1:00)

**[TELA: Editor com o projeto `plantei-api` aberto, terminal limpo]**

> "Fala devs, sejam muito bem-vindos! Se você já desenvolveu uma funcionalidade nova e ficou com aquele frio na barriga de subir para produção e quebrar o que já estava funcionando, esse vídeo é para você."

> "Hoje iniciamos a **Disciplina 1: Testes de Software**. Nós vamos entender a pirâmide de testes e aplicar imediatamente no nosso projeto real, o `plantei-api`."

> "Em menos de 10 minutos, nós vamos sair do zero: configurar o Jest para ES Modules, escrever nosso primeiro teste unitário com o padrão AAA, aprender como isolar dependências com mocks e medir a cobertura real do código."

---

## 📐 PARTE 1 — A Pirâmide de Testes e Estratégia de Cobertura (1:00 – 2:45)

**[TELA: Diagrama da pirâmide de testes no editor ou slide]**

> "Antes de sair digitando código, vamos entender *onde* investir nosso tempo. A regra de ouro na engenharia de software é a **Pirâmide de Testes**:"

```text
        /\
       /  \
      / E2E \          ← Poucos: lentos, caros, simulam o usuário real
     /--------\
    /          \
   / Integração \      ← Equilibrados: validam a comunicação entre rotas, controllers e banco
  /--------------\
 /                \
/   Unitários      \   ← Base massiva: ultra-rápidos, baratos, isolam regras de negócio
/____________________\
```

> "Na base temos os **testes unitários**: são 70% da sua suíte. Eles rodam em milissegundos porque não tocam em banco de dados, nem em rede."

> "No meio, **testes de integração**: cerca de 20%, testando rotas HTTP com Supertest."

> "No topo, os **testes E2E**: cerca de 10%, simulando fluxos completos do navegador até o banco."

> "No `plantei-api`, nós organizamos exatamente essa divisão dentro de `src/__tests__`: uma pasta `unit` e uma pasta `integration`."

---

## ⚙️ PARTE 2 — Configuração Express no `package.json` (2:45 – 4:00)

**[TELA: Abrir o arquivo `package.json` e destacar as dependências e scripts]**

> "O `plantei-api` é um projeto moderno que utiliza ECMAScript Modules nativo (`\"type\": \"module\"`). Para o Jest rodar perfeitamente sem transpilação pesada com Babel, nós instalamos:"

```bash
npm install --save-dev jest @jest/globals supertest
```

> "E no `package.json`, configuramos o script com a flag experimental de módulos VM do Node:"

```json
"scripts": {
  "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js",
  "test:watch": "node --experimental-vm-modules node_modules/jest/bin/jest.js --watch",
  "test:coverage": "node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage"
}
```

> "Pronto! O Jest já descobre automaticamente qualquer arquivo dentro de `src/__tests__` que termine com `.test.js`."

---

## 🧪 PARTE 3 — Teste Unitário com Padrão AAA na Prática (4:00 – 6:15)

**[TELA: Abrir lado a lado `src/utils/hash.js` e `src/__tests__/unit/hash.test.js`]**

> "Vamos para o primeiro teste. O arquivo `src/utils/hash.js` tem duas funções fundamentais de segurança: `gerarHash` e `compararHash` usando o `bcrypt`."

> "Para garantir legibilidade profissional, seguimos à risca o padrão **AAA — Arrange, Act, Assert**:"

```javascript
import { describe, it, expect } from '@jest/globals';
import { gerarHash, compararHash } from '../../utils/hash.js';

describe('Hash Utils (src/utils/hash.js)', () => {
  it('deve gerar um hash diferente da senha original e permitir validação', async () => {
    // 1. Arrange (Preparar o cenário)
    const senhaPlana = 'Plantei@2026';

    // 2. Act (Executar a função alvo)
    const hashGerado = await gerarHash(senhaPlana);
    const senhaValida = await compararHash(senhaPlana, hashGerado);
    const senhaInvalida = await compararHash('SenhaErrada', hashGerado);

    // 3. Assert (Verificar se o comportamento está correto)
    expect(hashGerado).not.toBe(senhaPlana);
    expect(senhaValida).toBe(true);
    expect(senhaInvalida).toBe(false);
  });
});
```

> "Veja a clareza: se alguém mexer no algoritmo de hash ou quebrar a biblioteca, o teste acusa na hora exatamente em qual asserção falhou."

---

## 🎭 PARTE 4 — Isolando o Banco com Mocks em `auth.service.js` (6:15 – 8:15)

**[TELA: Abrir `src/services/auth.service.js` e `src/__tests__/unit/auth.service.test.js`]**

> "Agora o próximo nível: como testar regras de negócio que dependem de banco de dados ou tokens sem precisar subir o PostgreSQL? Usando **Mocks**!"

> "No `src/services/auth.service.js`, o método `autenticarUsuario` consulta o model `Usuario` e assina um JWT."

> "No teste unitário, nós substituímos o model real por um mock controlado:"

```javascript
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Simulamos o model do Sequelize
const mockUsuario = {
  findOne: jest.fn(),
};

describe('AuthService — autenticarUsuario', () => {
  it('deve lançar erro quando o usuário não for encontrado', async () => {
    // Arrange: configuramos o mock para simular usuário inexistente
    mockUsuario.findOne.mockResolvedValue(null);

    // Act & Assert: esperamos que o service rejeite com erro de segurança
    await expect(authService.autenticarUsuario('naoexiste@plantei.com', '123456'))
      .rejects.toThrow('Usuário ou senha inválidos');
  });
});
```

> "Repare no detalhe de segurança: tanto para e-mail incorreto quanto para senha errada, a mensagem é exatamente a mesma para evitar enumeração de contas."

---

## 📊 PARTE 5 — Execução e Relatório de Cobertura (8:15 – 9:15)

**[TELA: Terminal rodando `npm run test:coverage`]**

> "Agora vamos rodar nossa suíte e gerar o relatório de cobertura:"

```bash
npm run test:coverage
```

> "Olha que sensacional no terminal: o Jest gera uma tabela com 4 métricas vitais:
> - **% Stmts:** linhas de declaração executadas.
> - **% Branch:** caminhos de `if/else` testados.
> - **% Funcs:** funções invocadas.
> - **% Lines:** linhas de código cobertas."

> "Ele cria também uma pasta `coverage/lcov-report/index.html`. Você abre no navegador e vê linha por linha destacada em verde ou vermelho."

---

## 🏁 ENCERRAMENTO E PRÓXIMOS PASSOS (9:15 – 10:00)

**[TELA: Tela final com resumo dos comandos e link para a Disciplina 2]**

> "Em menos de 10 minutos nós:
> 1. Estruturamos a estratégia na pirâmide de testes;
> 2. Configuramos o Jest com ES Modules no `plantei-api`;
> 3. Implementamos testes unitários com padrão AAA e mocks;
> 4. Medimos a cobertura real do código."

> "Na próxima aula — **Disciplina 2: Testes Automatizados com IA** — nós vamos usar Inteligência Artificial como copiloto para analisar essas lacunas de cobertura e gerar dezenas de cenários de borda em segundos."

> "Bons estudos, coloque a mão na massa no código e até o próximo vídeo!"

---

## 📋 Check-list de Gravação

- [ ] Node.js v20+ ativo no terminal
- [ ] Font size do VS Code ajustado para 18px (legível em 1080p)
- [ ] Arquivo `package.json` aberto na linha de scripts
- [ ] Terminal limpo para executar `npm test` e `npm run test:coverage`
- [ ] Navegador pronto com `coverage/lcov-report/index.html` gerado

## 🔑 Conceitos-Chave da Disciplina 1

- **Pirâmide de Testes:** 70% Unitários, 20% Integração, 10% E2E.
- **Padrão AAA:** *Arrange* (cenário), *Act* (execução), *Assert* (validação).
- **Mocks no Jest:** Isolam banco e APIs externas para garantir testes rápidos e determinísticos.
- **Métricas de Cobertura:** Cobertura de branches (desvios condicionais) é mais crítica do que apenas cobertura de linhas.
