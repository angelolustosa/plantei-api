import { Router } from "express";
import produtoController from "../controllers/contato.controller.js";

const router = Router();

router.get("/", produtoController.listar);
router.get("/:id", produtoController.buscarPorId);
router.post("/", produtoController.criar);

export default router;