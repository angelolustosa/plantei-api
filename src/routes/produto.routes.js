import { Router } from "express";
import { produtoController } from '../controllers/index.js';
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// 🔐 tudo abaixo daqui exige token
router.use(authMiddleware);

router.get("/", produtoController.listar);
router.get("/:id", produtoController.buscarPorId);
router.post("/", produtoController.criar);
router.put("/:id", produtoController.atualizar);
router.patch("/:id", produtoController.patch);
router.delete("/:id", produtoController.remover);

export default router;
