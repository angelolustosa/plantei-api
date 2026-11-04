import { Router } from "express";
import { produtoController } from '../controllers/index.js';
import authMiddleware from "../middlewares/auth.middleware.js";
import { autorizarPermissao } from "../middlewares/autorizar.middleware.js";
import { cacheMiddleware, invalidarCache } from "../middlewares/cache.middleware.js";

const router = Router();

// 🔐 tudo abaixo daqui exige token
router.use(authMiddleware);

// 📖 Listar produtos com Cache-Aside de 60s
router.get(
  "/",
  autorizarPermissao('PRODUTO_LISTAR'),
  cacheMiddleware(60),
  produtoController.listar
);

/* // 📖 listar produtos
router.get(
  "/",
  autorizarPermissao('PRODUTO_LISTAR'),
  produtoController.listar
);
 */

router.get("/:id", cacheMiddleware(30), produtoController.buscarPorId);

// ✍️ Mutações: limpam o cache da vitrine de produtos
router.post("/", produtoController.criar, async (req, res, next) => {
  await invalidarCache('cache:/api/produtos*');
});

router.put("/:id", produtoController.atualizar, async (req, res, next) => {
  await invalidarCache('cache:/api/produtos*');
});

router.delete("/:id", produtoController.remover, async (req, res, next) => {
  await invalidarCache('cache:/api/produtos*');
});


export default router;
