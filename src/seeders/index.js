import { seedPerfis } from './perfil.seeder.js';
import { seedPermissoes } from './permissao.seeder.js';
import { seedPerfilPermissoes } from './perfilPermissao.seeder.js';

export async function runSeeders() {
  await seedPerfis();
  await seedPermissoes();
  await seedPerfilPermissoes();
}