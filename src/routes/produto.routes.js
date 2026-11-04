import { Router } from "express";
import { produtoController } from '../controllers/index.js';
import authMiddleware from "../middlewares/auth.middleware.js";
import { autorizarPermissao } from "../middlewares/autorizar.middleware.js";
import { cacheMiddleware } from "../middlewares/cache.middleware.js";

const router = Router();

// 🔐 tudo abaixo daqui exige token
router.use(authMiddleware);

// 📖 listar produtos
router.get(
  "/",
  autorizarPermissao('PRODUTO_LISTAR'),
  cacheMiddleware(60), // 👈 Cacheia a vitrine de produtos por 60 segundos
  produtoController.listar
);


router.get("/:id", produtoController.buscarPorId);
router.post("/", produtoController.criar);
router.put("/:id", produtoController.atualizar);
router.patch("/:id", produtoController.patch);
router.delete("/:id", produtoController.remover);

export default router;
