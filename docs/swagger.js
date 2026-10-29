export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Plantei API',
    version: '1.0.0',
    description: 'Documentação viva interativa das rotas e esquemas da Plantei API.'
  },
  servers: [
    {
      url: '/',
      description: 'Servidor Atual (Automático)'
    },
    {
      url: 'http://localhost:5000',
      description: 'Ambiente Local de Desenvolvimento (Porta 5000)'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT gerado no endpoint de login (ex: Bearer {token})'
      }
    },
    schemas: {
      Produto: {
        type: 'object',
        required: ['nome', 'preco', 'estoque'],
        properties: {
          id: {
            type: 'integer',
            example: 1
          },
          nome: {
            type: 'string',
            minLength: 3,
            maxLength: 150,
            example: 'Monstera Deliciosa (Costela-de-Adão)'
          },
          descricao: {
            type: 'string',
            maxLength: 250,
            example: 'Planta de folhagem exuberante e fácil cultivo em ambientes internos.'
          },
          preco: {
            type: 'number',
            format: 'float',
            minimum: 0,
            example: 89.90
          },
          estoque: {
            type: 'integer',
            minimum: 0,
            example: 15
          },
          image_url: {
            type: 'string',
            format: 'uri',
            example: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
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
            example: 'Ficus Lyrata'
          },
          descricao: {
            type: 'string',
            example: 'Árvore ornamental de folhas largas.'
          },
          preco: {
            type: 'number',
            example: 129.90
          },
          estoque: {
            type: 'integer',
            example: 8
          },
          image_url: {
            type: 'string',
            example: 'https://images.unsplash.com/photo-1545241047-6083a3684587'
          }
        }
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'admin@plantei.com'
          },
          senha: {
            type: 'string',
            format: 'password',
            example: 'SenhaForte@123'
          }
        }
      },
      RegisterInput: {
        type: 'object',
        required: ['nome', 'email', 'senha', 'cpf'],
        properties: {
          nome: {
            type: 'string',
            example: 'Maria Silva'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'maria@plantei.com'
          },
          cpf: {
            type: 'string',
            minLength: 11,
            maxLength: 11,
            description: 'CPF com 11 dígitos numéricos',
            example: '12345678901'
          },
          senha: {
            type: 'string',
            format: 'password',
            example: 'SenhaSegura@123'
          },
          id_perfil: {
            type: 'integer',
            example: 2,
            description: 'ID do perfil: 1 (Admin), 2 (Usuário), 3 (Fornecedor)'
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          mensagem: {
            type: 'string',
            example: 'Descrição detalhada do erro'
          }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check da aplicação',
        tags: ['Infraestrutura'],
        responses: {
          200: {
            description: 'Serviço operacional'
          }
        }
      }
    },
    '/api/health': {
      get: {
        summary: 'Health check prefixado da API',
        tags: ['Infraestrutura'],
        responses: {
          200: {
            description: 'Serviço operacional'
          }
        }
      }
    },
    '/api/auth/register': {
      post: {
        summary: 'Cadastrar novo usuário',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterInput'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuário cadastrado com sucesso'
          },
          400: {
            description: 'Dados inválidos ou e-mail já cadastrado'
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Autenticar usuário e gerar token JWT',
        tags: ['Autenticação'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginInput'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Autenticado com sucesso, retorna token JWT'
          },
          401: {
            description: 'Credenciais inválidas'
          }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        summary: 'Encerrar sessão do usuário',
        tags: ['Autenticação'],
        responses: {
          200: {
            description: 'Logout realizado com sucesso'
          }
        }
      }
    },
    '/api/produtos': {
      get: {
        summary: 'Listar todos os produtos (Requer permissão PRODUTO_LISTAR)',
        tags: ['Produtos'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de produtos retornada com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Produto'
                  }
                }
              }
            }
          },
          401: {
            description: 'Token ausente ou inválido'
          },
          403: {
            description: 'Permissão insuficiente'
          }
        }
      },
      post: {
        summary: 'Cadastrar um novo produto',
        tags: ['Produtos'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProdutoInput'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Produto cadastrado com sucesso',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Produto'
                }
              }
            }
          },
          400: {
            description: 'Dados de validação inválidos'
          },
          401: {
            description: 'Não autorizado'
          }
        }
      }
    },
    '/api/produtos/{id}': {
      get: {
        summary: 'Buscar produto por ID',
        tags: ['Produtos'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'ID do produto'
          }
        ],
        responses: {
          200: {
            description: 'Produto encontrado',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Produto'
                }
              }
            }
          },
          404: {
            description: 'Produto não encontrado'
          }
        }
      },
      put: {
        summary: 'Atualizar completamente um produto',
        tags: ['Produtos'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ProdutoInput'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Produto atualizado com sucesso'
          },
          404: {
            description: 'Produto não encontrado'
          }
        }
      },
      patch: {
        summary: 'Atualizar parcialmente um produto',
        tags: ['Produtos'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Produto alterado com sucesso'
          },
          404: {
            description: 'Produto não encontrado'
          }
        }
      },
      delete: {
        summary: 'Remover produto por ID',
        tags: ['Produtos'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          204: {
            description: 'Produto removido com sucesso'
          },
          404: {
            description: 'Produto não encontrado'
          }
        }
      }
    }
  }
};

