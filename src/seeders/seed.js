import { sequelize } from '../config/database.js';
import { runSeeders } from './index.js';

(async () => {
  try {
    await sequelize.sync();
    await runSeeders();
    console.log('🌱 Seed finalizado');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();