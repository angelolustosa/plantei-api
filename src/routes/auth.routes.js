import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', authController.register); //cadastro de usuário com a senha criptografada e validação de email
router.post('/login', authController.login); // confere o usuário e senha, e retorna um token JWT se for válido 
router.post('/logout', authController.logout);

export default router;
