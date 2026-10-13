/**
 * VÍDEO 1.2 — Testes Unitários: padrão AAA com funções puras
 *
 * Por que começar aqui?
 * `hash.js` não tem dependências externas — ideal para aprender
 * o padrão Arrange / Act / Assert sem precisar de mocks.
 */

import { describe, it, expect } from '@jest/globals';
import { gerarHash, compararHash } from '../../utils/hash.js';

describe('gerarHash()', () => {
  it('deve retornar uma string diferente da senha original', async () => {
    // Arrange — preparar os dados
    const senha = 'minhasenha123';

    // Act — executar a função
    const hash = await gerarHash(senha);

    // Assert — verificar o resultado
    expect(hash).not.toBe(senha);
    expect(typeof hash).toBe('string');
  });

  it('deve gerar hashes diferentes para a mesma senha (salt aleatório)', async () => {
    // Arrange
    const senha = 'mesmasenha';

    // Act
    const hash1 = await gerarHash(senha);
    const hash2 = await gerarHash(senha);

    // Assert — o bcrypt gera salt aleatório, então os hashes nunca são iguais
    expect(hash1).not.toBe(hash2);
  });

  it('deve gerar um hash com o formato bcrypt ($2b$...)', async () => {
    const hash = await gerarHash('qualquersenha');

    // Hashes bcrypt sempre começam com $2b$ ou $2a$
    expect(hash).toMatch(/^\$2[ab]\$/);
  });
});

describe('compararHash()', () => {
  it('deve retornar true quando a senha corresponde ao hash', async () => {
    // Arrange
    const senha = 'senha-correta';
    const hash = await gerarHash(senha);

    // Act
    const resultado = await compararHash(senha, hash);

    // Assert
    expect(resultado).toBe(true);
  });

  it('deve retornar false quando a senha não corresponde ao hash', async () => {
    // Arrange
    const hash = await gerarHash('senha-original');

    // Act
    const resultado = await compararHash('senha-errada', hash);

    // Assert
    expect(resultado).toBe(false);
  });

  it('deve retornar false para string vazia vs hash válido', async () => {
    const hash = await gerarHash('senha123');

    const resultado = await compararHash('', hash);

    expect(resultado).toBe(false);
  });
});
