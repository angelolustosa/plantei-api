import { Router } from "express";
import categoriaController from "../controllers/categoria.controller";

const router = Router();

router.get("/", categoriaController.listar);
router.get("/:id", categoriaController.buscarPorId);
router.post("/", categoriaController.criar);
router.put("/:id", categoriaController.atualizar);
router.patch("/:id", categoriaController.patch);
router.delete("/:id", categoriaController.remover);

export default router;
