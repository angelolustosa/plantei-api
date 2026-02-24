import { Perfil } from '../models/index.js';

export async function seedPerfis() {
  const perfis = [
    { nome: 'Administrador', codigo: 'ADMIN' },
    { nome: 'Usuário', codigo: 'USER' },
    { nome: 'Fornecedor', codigo: 'FORN' },
  ];

  for (const perfil of perfis) {
    await Perfil.findOrCreate({
      where: { codigo: perfil.codigo },
      defaults: perfil,
    });
  }

  console.log('✅ Perfis criados');
}