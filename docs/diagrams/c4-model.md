# Diagramas Arquiteturais - C4 Model

Visualização dos diagramas C4 da API Plantei. A fonte Mermaid editável está em [c4-model.mmd](./c4-model.mmd).

```mermaid
graph TD
    Client["👤 Usuário / App Web (React)"] -->|HTTPS / REST| LB["🌐 NGINX (Load Balancer & Reverse Proxy)"]
    LB -->|Reverse Proxy / Round Robin| API1["🚀 plantei-api (Instância 1 - Node.js)"]
    LB -->|Reverse Proxy / Round Robin| API2["🚀 plantei-api (Instância 2 - Node.js)"]
    
    API1 -->|Conexão Pool / Sequelize| DB[("🐘 PostgreSQL (plantei_db)")]
    API2 -->|Conexão Pool / Sequelize| DB
    
    API1 -->|Cache Leitura & Rate Limit| Cache[("⚡ Redis Cache")]
    API2 -->|Cache Leitura & Rate Limit| Cache

    subgraph "Camada de Dados e Cache"
        DB
        Cache
    end

    subgraph "Camada de Aplicação"
        API1
        API2
    end
```

## Nível 1 - Contexto

```mermaid
C4Context
    title Contexto do sistema Plantei

    System_Ext(cliente, "Cliente consumidor", "Aplicação cliente não detalhada neste repositório.")

    System_Boundary(plantei, "Plantei") {
        System(api, "Plantei API", "API REST para autenticação, produtos e contatos.")
    }

    Rel(cliente, api, "Consome os endpoints", "HTTP / JSON")
```

## Nível 2 - Containers

```mermaid
C4Container
    title Containers da Plantei API

    System_Ext(cliente, "Cliente consumidor", "Aplicação cliente não detalhada neste repositório.")

    System_Boundary(plantei, "Plantei") {
        Container(api, "API REST", "Node.js, Express 5.1.0", "Expõe endpoints REST, health check e documentação Swagger UI.")
        ContainerDb(db, "Banco de dados", "PostgreSQL", "Armazena produtos, contatos, usuários, perfis e permissões.")
    }

    Rel(cliente, api, "Faz chamadas REST", "HTTP / JSON")
    Rel(api, db, "Lê e grava dados", "Sequelize / SQL")
```

## Nível 3 - Componentes

```mermaid
C4Component
    title Componentes da API REST

    Container_Ext(cliente, "Cliente consumidor", "Aplicação cliente", "Cliente da API fora deste repositório.")
    ContainerDb_Ext(db, "Banco de dados", "PostgreSQL", "Persistência relacional acessada pelo Sequelize.")

    Container_Boundary(api, "API REST - Express") {
        Component(globalMiddleware, "Middlewares globais", "Express", "CORS, log de requisições e tratamento de erros.")
        Component(routes, "Rotas", "Express Router", "Registra endpoints de health, autenticação, produtos e contatos.")
        Component(authMiddleware, "Autenticação e autorização", "JWT", "Valida tokens e permissões nas rotas protegidas.")
        Component(controllers, "Controllers", "JavaScript", "Traduz requisições HTTP em respostas da API.")
        Component(services, "Services", "JavaScript", "Implementa operações de autenticação, produtos e contatos.")
        Component(models, "Models e associações", "Sequelize", "Define entidades e relacionamentos persistidos.")
        Component(authConfig, "Segurança e configuração", "JWT, bcrypt", "Configura tokens e hashing de senhas.")
    }

    Rel(cliente, globalMiddleware, "Envia requisições", "HTTP / JSON")
    Rel(globalMiddleware, routes, "Encaminha requisições")
    Rel(routes, authMiddleware, "Protege rotas de produtos")
    Rel(routes, controllers, "Despacha para controllers")
    Rel(authMiddleware, models, "Consulta usuário, perfil e permissões")
    Rel(controllers, services, "Invoca operações")
    Rel(services, models, "Consulta e altera entidades")
    Rel(services, authConfig, "Usa JWT e hashing de senhas")
    Rel(models, db, "Executa operações", "Sequelize / SQL")
```
