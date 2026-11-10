// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
// 📊 Gerador de Relatório Visual HTML interativo
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

// ⚙️ Configurações do teste de carga com o k6
export const options = {
  stages: [
    { duration: '20s', target: 50 },  // Rampa de aquecimento (50 usuários)
    { duration: '40s', target: 200 }, // Pico de carga sustentada (200 usuários simultâneos)
    { duration: '20s', target: 0 },   // Rampa de resfriamento
  ],
  thresholds: {
    // 95% das requisições devem responder em menos de 50ms (efeito do Cache Redis)
    http_req_duration: ['p(95)<50', 'p(99)<120'],
    // Taxa de falha deve ser inferior a 1%
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:5000';

// Credenciais de administrador válidas no plantei-api
const USUARIO_TESTE = {
  email: __ENV.AUTH_EMAIL || 'admin@email.com',
  senha: __ENV.AUTH_PASSWORD || '123456',
};

/**
 * 🔑 SETUP: Executa UMA ÚNICA VEZ antes do teste iniciar.
 * Faz o login como administrador e repassa o token para os 200 VUs.
 */
export function setup() {
  const headers = { 'Content-Type': 'application/json' };

  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify(USUARIO_TESTE),
    { headers }
  );

  const token = loginRes.json('token');

  if (!token) {
    console.error('❌ Falha ao obter token JWT no setup! Status:', loginRes.status, loginRes.body);
  } else {
    console.log('✅ Token JWT obtido com sucesso para o teste de carga!');
  }

  return { token };
}

/**
 * 🚀 EXECUÇÃO: Cada um dos 200 usuários virtuais executa este loop.
 */
export default function (data) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      ...(data.token ? { Authorization: `Bearer ${data.token}` } : {}),
    },
  };

  const res = http.get(`${BASE_URL}/api/produtos`, params);

  check(res, {
    'status é 200': (r) => r.status === 200,
    'header X-Cache presente': (r) => r.headers['X-Cache'] !== undefined,
  });

  sleep(0.5); // Simula o intervalo de leitura do usuário real
}

/**
 * 📈 GERAÇÃO DE RELATÓRIO VISUAL HTML:
 * Ao final do teste, cria automaticamente o arquivo 'relatorio-k6.html' na raiz do projeto.
 */
export function handleSummary(data) {
  return {
    'relatorio-k6.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

