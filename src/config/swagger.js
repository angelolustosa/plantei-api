import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const isDevelopment = process.env.NODE_ENV !== 'production';
const baseUrl = isDevelopment ? 'http://localhost:3000' : 'https://plantei-api.onrender.com';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Plantei API',
      version: '1.0.0',
      description: 'API para gerenciamento de produtos e contatos',
    },
    servers: [
      {
        url: `${baseUrl}/api`,
        description: isDevelopment ? 'Servidor de desenvolvimento' : 'Servidor de produção',
      },
    ],
    components: {
      schemas: {
        Produto: {
          type: 'object',
          required: ['nome', 'preco', 'estoque'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do produto',
              example: 1
            },
            nome: {
              type: 'string',
              minLength: 3,
              maxLength: 150,
              description: 'Nome do produto',
              example: 'Tomate Orgânico'
            },
            descricao: {
              type: 'string',
              maxLength: 250,
              description: 'Descrição do produto',
              example: 'Tomates orgânicos frescos, cultivados sem agrotóxicos'
            },
            preco: {
              type: 'number',
              format: 'decimal',
              minimum: 0,
              description: 'Preço do produto',
              example: 12.50
            },
            estoque: {
              type: 'integer',
              minimum: 0,
              description: 'Quantidade em estoque',
              example: 100
            },
            image_url: {
              type: 'string',
              format: 'uri',
              description: 'URL da imagem do produto',
              example: 'https://exemplo.com/imagem-tomate.jpg'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
              example: '2024-01-15T10:30:00Z'
            }
          }
        },
        ProdutoInput: {
          type: 'object',
          required: ['nome', 'preco', 'estoque'],
          properties: {
            nome: {
              type: 'string',
              minLength: 3,
              maxLength: 150,
              description: 'Nome do produto',
              example: 'Tomate Orgânico'
            },
            descricao: {
              type: 'string',
              maxLength: 250,
              description: 'Descrição do produto',
              example: 'Tomates orgânicos frescos, cultivados sem agrotóxicos'
            },
            preco: {
              type: 'number',
              format: 'decimal',
              minimum: 0,
              description: 'Preço do produto',
              example: 12.50
            },
            estoque: {
              type: 'integer',
              minimum: 0,
              description: 'Quantidade em estoque',
              example: 100
            },
            image_url: {
              type: 'string',
              format: 'uri',
              description: 'URL da imagem do produto',
              example: 'https://exemplo.com/imagem-tomate.jpg'
            }
          }
        },
        Contato: {
          type: 'object',
          required: ['nome', 'email', 'mensagem'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do contato',
              example: 1
            },
            nome: {
              type: 'string',
              minLength: 3,
              maxLength: 150,
              description: 'Nome do contato',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 150,
              description: 'E-mail do contato',
              example: 'joao@email.com'
            },
            mensagem: {
              type: 'string',
              maxLength: 500,
              description: 'Mensagem do contato',
              example: 'Gostaria de saber mais sobre os produtos disponíveis.'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
              example: '2024-01-15T10:30:00Z'
            }
          }
        },
        ContatoInput: {
          type: 'object',
          required: ['nome', 'email', 'mensagem'],
          properties: {
            nome: {
              type: 'string',
              minLength: 3,
              maxLength: 150,
              description: 'Nome do contato',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              maxLength: 150,
              description: 'E-mail do contato',
              example: 'joao@email.com'
            },
            mensagem: {
              type: 'string',
              maxLength: 500,
              description: 'Mensagem do contato',
              example: 'Gostaria de saber mais sobre os produtos disponíveis.'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            mensagem: {
              type: 'string',
              description: 'Mensagem de resposta',
              example: 'Operação realizada com sucesso!'
            },
            data: {
              description: 'Dados retornados'
            }
          }
        },
        ApiListResponse: {
          type: 'object',
          properties: {
            mensagem: {
              type: 'string',
              description: 'Mensagem de resposta',
              example: 'Contatos retornados com sucesso!'
            },
            size: {
              type: 'integer',
              description: 'Quantidade de itens',
              example: 10
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Contato'
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            erro: {
              type: 'string',
              description: 'Mensagem de erro',
              example: 'Recurso não encontrado'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };