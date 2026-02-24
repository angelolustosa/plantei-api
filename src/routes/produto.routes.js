import { Router } from "express";
import { produtoController } from '../controllers/index.js';
import authMiddleware from "../middlewares/auth.middleware.js";
import { autorizarPermissao } from "../middlewares/autorizar.middleware.js";

const router = Router();

// 🔐 tudo abaixo daqui exige token
router.use(authMiddleware);

// 📖 listar produtos
router.get(
  "/",
  autorizarPermissao('produto_listar'),
  produtoController.listar
);


router.get("/:id", produtoController.buscarPorId);
router.post("/", produtoController.criar);
router.put("/:id", produtoController.atualizar);
router.patch("/:id", produtoController.patch);
router.delete("/:id", produtoController.remover);

export default router;
