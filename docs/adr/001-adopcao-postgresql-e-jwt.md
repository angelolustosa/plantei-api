# ADR 001: Adoção de PostgreSQL e Autenticação JWT no Plantei API

## Status

Aceito (Accepted)

## Data

2026-10-29

## Contexto

O sistema necessita de integridade referencial para pedidos, estoque e usuários, além de suporte a alta concorrência com réplicas sem sessão em memória.

## Decisão

1. Utilizar PostgreSQL com Sequelize ORM para consistência transacional ACID.
2. Utilizar autenticação stateless via tokens JWT para facilitar o escalonamento horizontal.

## Consequências

- **Positivas:** Fácil escalabilidade das instâncias de API e integridade garantida no banco.
- **Negativas:** Exige migrações controladas de banco e revogação de tokens via lista de bloqueio/Redis.
