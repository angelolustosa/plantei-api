/**
 * VÍDEO 1.2 — Testes Unitários: validações do Model Sequelize
 *
 * Conceito-chave: `Model.build()` cria a instância em memória,
 * sem nenhuma conexão com o banco de dados.
 * Perfeito para testar regras de validação de forma isolada e rápida.
 */

import { describe, it, expect } from '@jest/globals';
import { Produto } from '../../models/Produto.js';

// Payload base válido — reutilizamos em vários testes
const produtoValido = {
  nome: 'Samambaia',
  preco: 29.90,
  estoque: 10,
};

describe('Model Produto — Validações', () => {

  // ----- CAMPO: nome -----

  it('deve aceitar um produto com dados válidos', async () => {
    const produto = Produto.build(produtoValido);

    // Se não lançar erro, o produto é válido
    await expect(produto.validate()).resolves.not.toThrow();
  });

  it('deve rejeitar nome vazio', async () => {
    const produto = Produto.build({ ...produtoValido, nome: '' });

    await expect(produto.validate()).rejects.toThrow('Nome do produto é obrigatório');
  });

  it('deve rejeitar nome com menos de 3 caracteres', async () => {
    const produto = Produto.build({ ...produtoValido, nome: 'AB' });

    await expect(produto.validate()).rejects.toThrow('Nome deve ter entre 3 e 150 caracteres');
  });

  it('deve rejeitar nome com mais de 150 caracteres', async () => {
    const nomeGigante = 'A'.repeat(151);
    const produto = Produto.build({ ...produtoValido, nome: nomeGigante });

    await expect(produto.validate()).rejects.toThrow('Nome deve ter entre 3 e 150 caracteres');
  });

  // ----- CAMPO: preco -----

  it('deve rejeitar preço negativo', async () => {
    const produto = Produto.build({ ...produtoValido, preco: -1 });

    await expect(produto.validate()).rejects.toThrow('Preço deve ser maior ou igual a zero');
  });

  it('deve aceitar preço igual a zero (produto gratuito)', async () => {
    const produto = Produto.build({ ...produtoValido, preco: 0 });

    await expect(produto.validate()).resolves.not.toThrow();
  });

  // ----- CAMPO: estoque -----

  it('deve rejeitar estoque negativo', async () => {
    const produto = Produto.build({ ...produtoValido, estoque: -1 });

    await expect(produto.validate()).rejects.toThrow('Estoque não pode ser negativo');
  });

  it('deve aceitar estoque igual a zero (sem estoque)', async () => {
    const produto = Produto.build({ ...produtoValido, estoque: 0 });

    await expect(produto.validate()).resolves.not.toThrow();
  });

  // ----- CAMPO: image_url -----

  it('deve rejeitar image_url com formato inválido', async () => {
    const produto = Produto.build({ ...produtoValido, image_url: 'nao-e-uma-url' });

    await expect(produto.validate()).rejects.toThrow('URl da imagem inválida');
  });

  it('deve aceitar image_url válida', async () => {
    const produto = Produto.build({
      ...produtoValido,
      image_url: 'https://exemplo.com/imagem.jpg',
    });

    await expect(produto.validate()).resolves.not.toThrow();
  });

});
