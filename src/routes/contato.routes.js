import { Router } from "express";
import produtoController from "../controllers/contato.controller.js";

const router = Router();

/**
 * @swagger
 * /contatos:
 *   get:
 *     summary: Lista todos os contatos
 *     tags: [Contatos]
 *     responses:
 *       200:
 *         description: Lista de contatos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiListResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", produtoController.listar);

/**
 * @swagger
 * /contatos/{id}:
 *   get:
 *     summary: Busca um contato por ID
 *     tags: [Contatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do contato
 *         example: 1
 *     responses:
 *       200:
 *         description: Contato encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contato'
 *       404:
 *         description: Contato não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", produtoController.buscarPorId);

/**
 * @swagger
 * /contatos:
 *   post:
 *     summary: Cria um novo contato
 *     tags: [Contatos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContatoInput'
 *           example:
 *             nome: "Maria Santos"
 *             email: "maria@email.com"
 *             mensagem: "Olá, gostaria de mais informações sobre os produtos orgânicos disponíveis. Tenho interesse em fazer uma compra em grande quantidade."
 *     responses:
 *       201:
 *         description: Contato criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               mensagem: "Contato criado com sucesso!"
 *               data:
 *                 id: 1
 *                 nome: "Maria Santos"
 *                 email: "maria@email.com"
 *                 mensagem: "Olá, gostaria de mais informações sobre os produtos orgânicos disponíveis."
 *                 createdAt: "2024-01-15T10:30:00Z"
 *                 updatedAt: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", produtoController.criar);

export default router;