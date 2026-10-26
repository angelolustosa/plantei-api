import express from 'express';
import cors from './config/cors.js';
import routes from './routes/index.js';
import healthRoutes from './routes/health.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(cors);
app.use(express.json());

// Health check acessível na raiz (/health) e via prefixo (/api/health)
app.use('/health', healthRoutes);

// Rotas da API (/api/health, /api/produtos, etc.)
app.use('/api', routes);

app.use(errorMiddleware);

export default app;
