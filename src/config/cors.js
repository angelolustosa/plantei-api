import cors from 'cors';

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const allowedOrigins = [
  'http://localhost:5173',   // Vite padrão
  'http://127.0.0.1:5173',
  'http://localhost:3000',   // Front CRA
  'http://127.0.0.1:3000',
  'http://localhost:5000',   // Swagger UI / API local
  'http://127.0.0.1:5000',
  `http://${HOST}:${PORT}`,
  `http://localhost:${PORT}`,
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permite chamadas sem origin (Postman, curl, backend-backend)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(`:${PORT}`)
    ) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization', // 👈 JWT
  ],
  credentials: true, // 👈 se usar cookies futuramente
};

export default cors(corsOptions);
