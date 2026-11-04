const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Plantei API',
    version: '1.0.0',
    description: 'Documentação da API Plantei, incluindo autenticação, produtos, contatos e verificação de saúde.',
  },
  servers: [
    {
      url: '/',
      description: 'Servidor atual',
    },
    {
      url: 'http://localhost:5000',
      description: 'Ambiente local de desenvolvimento',
    },
  ],
  tags: [
    { name: 'Health', description: 'Verificação de disponibilidade da API e do banco de dados.' },
    { name: 'Autenticação', description: 'Cadastro, login e logout de usuários.' },
    { name: 'Produtos', description: 'Operações protegidas de gerenciamento de produtos.' },
    { name: 'Contatos', description: 'Cadastro e consulta de contatos.' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Informe o token JWT no formato Bearer.',
      },
    },
    schemas: {
      Produto: {
        type: 'object',
        description: 'Produto armazenado no catálogo.',
        properties: {
          id: {
            type: 'integer',
            readOnly: true,
            example: 42,
          },
          nome: {
            type: 'string',
            minLength: 3,
            maxLength: 150,
            example: 'Vaso de cerâmica artesanal',
          },
          descricao: {
            type: 'string',
            maxLength: 250,
            nullable: true,
            example: 'Vaso artesanal em cerâmica, ideal para plantas de pequeno porte.',
          },
          preco: {
            type: 'number',
            format: 'double',
            minimum: 0,
            example: 89.9,
          },
          estoque: {
            type: 'integer',
            minimum: 0,
            example: 24,
          },
          image_url: {
            type: 'string',
            format: 'uri',
            maxLength: 255,
            nullable: true,
            example: 'https://plantei.com.br/images/vaso-ceramica.jpg',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            readOnly: true,
            example: '2026-03-15T12:30:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            readOnly: true,
            example: '2026-03-16T09:10:00.000Z',
          },
        },
      },
      ProdutoInput: {
        type: 'object',
        description: 'Dados para criação ou atualização de um produto.',
        required: ['nome', 'preco', 'estoque'],
        properties: {
          nome: {
            type: 'string',
            minLength: 3,
            maxLength: 150,
            example: 'Vaso de cerâmica artesanal',
          },
          descricao: {
            type: 'string',
            maxLength: 250,
            nullable: true,
            example: 'Vaso artesanal em cerâmica, ideal para plantas de pequeno porte.',
          },
          preco: {
            type: 'number',
            format: 'double',
            minimum: 0,
            example: 89.9,
          },
          estoque: {
            type: 'integer',
            minimum: 0,
            example: 24,
          },
          image_url: {
            type: 'string',
            format: 'uri',
            maxLength: 255,
            nullable: true,
            example: 'https://plantei.com.br/images/vaso-ceramica.jpg',
          },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'ana.silva@plantei.com.br',
          },
          senha: {
            type: 'string',
            format: 'password',
            minLength: 1,
            example: 'MinhaSenhaSegura123!',
          },
        },
      },
      RegisterInput: {
        type: 'object',
        description: 'Campos exigidos pelo model Usuario. A senha é armazenada com hash.',
        required: ['nome', 'email', 'senha', 'cpf', 'id_perfil'],
        properties: {
          nome: {
            type: 'string',
            example: 'Ana Silva',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'ana.silva@plantei.com.br',
          },
          senha: {
            type: 'string',
            format: 'password',
            minLength: 1,
            example: 'MinhaSenhaSegura123!',
          },
          cpf: {
            type: 'string',
            minLength: 11,
            maxLength: 11,
            pattern: '^\\d{11}$',
            description: 'CPF informado com exatamente 11 dígitos, sem pontuação.',
            example: '12345678901',
          },
          id_perfil: {
            type: 'integer',
            minimum: 1,
            example: 2,
          },
        },
      },
      Usuario: {
        type: 'object',
        description: 'Dados não sensíveis do usuário; a senha nunca é retornada pela API.',
        properties: {
          id: { type: 'integer', example: 7 },
          nome: { type: 'string', example: 'Ana Silva' },
          email: { type: 'string', format: 'email', example: 'ana.silva@plantei.com.br' },
          cpf: {
            type: 'string',
            minLength: 11,
            maxLength: 11,
            pattern: '^\\d{11}$',
            example: '12345678901',
          },
          id_perfil: { type: 'integer', example: 2 },
          createdAt: { type: 'string', format: 'date-time', example: '2026-03-15T12:30:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2026-03-15T12:30:00.000Z' },
        },
      },
      Perfil: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 2 },
          nome: { type: 'string', example: 'Usuário' },
          codigo: { type: 'string', example: 'USER' },
        },
      },
      Contato: {
        type: 'object',
        properties: {
          id: { type: 'integer', readOnly: true, example: 15 },
          nome: { type: 'string', minLength: 3, maxLength: 150, example: 'Ana Silva' },
          email: { type: 'string', format: 'email', maxLength: 150, example: 'ana.silva@plantei.com.br' },
          mensagem: {
            type: 'string',
            minLength: 1,
            maxLength: 500,
            example: 'Gostaria de saber mais sobre a disponibilidade deste produto.',
          },
          createdAt: { type: 'string', format: 'date-time', readOnly: true, example: '2026-03-15T12:30:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', readOnly: true, example: '2026-03-15T12:30:00.000Z' },
        },
      },
      ContatoInput: {
        type: 'object',
        required: ['nome', 'email', 'mensagem'],
        properties: {
          nome: { type: 'string', minLength: 3, maxLength: 150, example: 'Ana Silva' },
          email: { type: 'string', format: 'email', maxLength: 150, example: 'ana.silva@plantei.com.br' },
          mensagem: {
            type: 'string',
            minLength: 1,
            maxLength: 500,
            example: 'Gostaria de saber mais sobre a disponibilidade deste produto.',
          },
        },
      },
      HealthStatus: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['UP', 'DEGRADED'], example: 'UP' },
          service: { type: 'string', example: 'plantei-api' },
          timestamp: { type: 'string', format: 'date-time', example: '2026-03-15T12:30:00.000Z' },
          uptimeSeconds: { type: 'integer', example: 3600 },
          memoryUsageMB: { type: 'integer', example: 48 },
          database: { type: 'string', enum: ['CONNECTED', 'DISCONNECTED', 'UNKNOWN'], example: 'CONNECTED' },
          error: { type: 'string', example: 'Não foi possível conectar ao banco de dados.' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          erro: {
            oneOf: [
              { type: 'string', example: 'Usuário ou senha inválidos' },
              { type: 'array', items: { type: 'string' }, example: ['Nome do produto é obrigatório'] },
            ],
          },
        },
      },
    },
    parameters: {
      id: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Identificador numérico do recurso.',
        schema: { type: 'integer', minimum: 1 },
        example: 42,
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica a saúde da API na raiz.',
        responses: {
          '200': {
            description: 'API e banco de dados disponíveis.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthStatus' } } },
          },
          '503': {
            description: 'API disponível, mas com banco de dados indisponível.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthStatus' } } },
          },
        },
      },
    },
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica a saúde da API pelo prefixo /api.',
        responses: {
          '200': {
            description: 'API e banco de dados disponíveis.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthStatus' } } },
          },
          '503': {
            description: 'API disponível, mas com banco de dados indisponível.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthStatus' } } },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Registra um usuário.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } },
        },
        responses: {
          '201': {
            description: 'Usuário criado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    mensagem: { type: 'string', example: 'Usuário criado com sucesso' },
                    id: { type: 'integer', example: 7 },
                    email: { type: 'string', format: 'email', example: 'ana.silva@plantei.com.br' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos ou email/CPF já cadastrado.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Autentica um usuário e retorna um token JWT.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } },
        },
        responses: {
          '200': {
            description: 'Login realizado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    usuario: {
                      type: 'object',
                      properties: {
                        id: { type: 'integer', example: 7 },
                        nome: { type: 'string', example: 'Ana Silva' },
                        email: { type: 'string', format: 'email', example: 'ana.silva@plantei.com.br' },
                        perfil: { type: 'string', example: 'Usuário' },
                      },
                    },
                    mensagem: { type: 'string', example: 'Login realizado com sucesso' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Email ou senha inválidos.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Autenticação'],
        summary: 'Encerra a sessão no cliente.',
        description: 'A API usa JWT sem estado; o cliente deve descartar o token.',
        responses: {
          '200': {
            description: 'Logout realizado.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { mensagem: { type: 'string', example: 'Logout realizado' } },
                },
              },
            },
          },
        },
      },
    },
    '/api/produtos': {
      get: {
        tags: ['Produtos'],
        summary: 'Lista os produtos.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Produtos retornados com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    mensagem: { type: 'string', example: 'Produtos retornados com sucesso!' },
                    size: { type: 'integer', example: 1 },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Produto' } },
                  },
                },
              },
            },
          },
          '401': { description: 'Token ausente ou inválido.' },
          '403': { description: 'Usuário sem permissão para listar produtos.' },
        },
      },
      post: {
        tags: ['Produtos'],
        summary: 'Cria um produto.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProdutoInput' } } },
        },
        responses: {
          '201': {
            description: 'Produto criado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    mensagem: { type: 'string', example: 'Produto criado com sucesso!' },
                    data: { $ref: '#/components/schemas/Produto' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos para criação do produto.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
          '401': { description: 'Token ausente ou inválido.' },
        },
      },
    },
    '/api/produtos/{id}': {
      parameters: [{ $ref: '#/components/parameters/id' }],
      get: {
        tags: ['Produtos'],
        summary: 'Busca um produto pelo identificador.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Produto encontrado ou mensagem de produto não encontrado.',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/Produto' },
                    {
                      type: 'object',
                      properties: { erro: { type: 'string', example: 'Produto não encontrado' } },
                    },
                  ],
                },
              },
            },
          },
          '401': { description: 'Token ausente ou inválido.' },
        },
      },
      put: {
        tags: ['Produtos'],
        summary: 'Atualiza um produto.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProdutoInput' } } },
        },
        responses: {
          '200': {
            description: 'Produto atualizado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    mensagem: { type: 'string', example: 'Produto atualizado com sucesso!' },
                    data: { $ref: '#/components/schemas/Produto' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos para atualização do produto.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
          '401': { description: 'Token ausente ou inválido.' },
          '404': {
            description: 'Produto não encontrado.',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { erro: { type: 'string', example: 'Produto não encontrado' } } },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Produtos'],
        summary: 'Atualiza parcialmente um produto.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ProdutoInput' },
                  { type: 'object', minProperties: 1 },
                ],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Produto atualizado parcialmente.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    mensagem: { type: 'string', example: 'Produto atualizado parcialmente!' },
                    data: { $ref: '#/components/schemas/Produto' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos para atualização do produto.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
          '401': { description: 'Token ausente ou inválido.' },
          '404': {
            description: 'Produto não encontrado.',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { erro: { type: 'string', example: 'Produto não encontrado' } } },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Produtos'],
        summary: 'Remove um produto.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Produto removido com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { mensagem: { type: 'string', example: 'Produto removido com sucesso!' } },
                },
              },
            },
          },
          '401': { description: 'Token ausente ou inválido.' },
          '404': {
            description: 'Produto não encontrado.',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { erro: { type: 'string', example: 'Produto não encontrado' } } },
              },
            },
          },
        },
      },
    },
    '/api/contatos': {
      get: {
        tags: ['Contatos'],
        summary: 'Lista os contatos cadastrados.',
        responses: {
          '200': {
            description: 'Contatos retornados com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    mensagem: { type: 'string', example: 'Contatos retornados com sucesso!' },
                    size: { type: 'integer', example: 1 },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Contato' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Contatos'],
        summary: 'Cria um contato.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ContatoInput' } } },
        },
        responses: {
          '201': {
            description: 'Contato criado com sucesso.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    mensagem: { type: 'string', example: 'Contato criado com sucesso!' },
                    data: { $ref: '#/components/schemas/Contato' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Dados inválidos para criação do contato.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    },
    '/api/contatos/{id}': {
      parameters: [{ $ref: '#/components/parameters/id' }],
      get: {
        tags: ['Contatos'],
        summary: 'Busca um contato pelo identificador.',
        responses: {
          '200': {
            description: 'Contato encontrado.',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Contato' } } },
          },
          '404': {
            description: 'Contato não encontrado.',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { erro: { type: 'string', example: 'Contato não encontrado' } } },
              },
            },
          },
        },
      },
    },
  },
};

export { swaggerSpec };
export default swaggerSpec;
