# ADR 001: Adoção de PostgreSQL e Autenticação JWT no Plantei API

## Status
Aceito (Accepted)

## Data
2026-10-29

## Contexto
A plataforma de e-commerce Plantei necessita de controle transacional rigoroso para operações críticas, tais como controle de estoque, criação de pedidos e relacionamento de permissões granulares de usuários (N:N entre Usuários, Perfis e Permissões).

Além disso, a arquitetura deve permitir escalonamento horizontal das instâncias da API sem dependência de sessões salvas na memória do servidor.

## Decisão
1. **Banco de Dados Relacional (PostgreSQL):** Utilizar PostgreSQL gerenciado pelo Sequelize ORM para assegurar integridade referencial, propriedades ACID e suporte a transações concorrentes.
2. **Autenticação Stateless (JWT):** Adotar JSON Web Tokens (JWT) para autenticação e autorização via header `Authorization: Bearer <token>`, permitindo que qualquer réplica da API valide a requisição de forma independente.

## Consequências

### Positivas
- **Integridade de Dados:** Garantia de consistência em operações de estoque e checkout.
- **Escala Horizontal:** As instâncias de `plantei-api` não mantêm estado de sessão local.
- **Ecossistema:** Facilidade de migrações e seeds através do Sequelize.

### Negativas / Desafios
- **Migrações de Schema:** Exige gerenciamento cuidadoso de scripts de migração em ambientes de produção.
- **Invalidação de Sessão:** A revogação imediata de tokens JWT antes do prazo de expiração exige mecanismos complementares (como denylist em memória/Redis).

