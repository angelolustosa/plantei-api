import cors from 'cors';

// Configuração do CORS
//app.use(cors()); // 👈 libera tudo

const allowedOrigins = [
  'http://localhost:5173',   // Vite padrão
  'http://127.0.0.1:5173',
  'http://localhost:3000',   // se usar outro front CRA
];
const corsOptions = {
  origin: (origin, callback) => {
    // Permite chamadas sem origin (Postman, curl, backend-backend)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
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
