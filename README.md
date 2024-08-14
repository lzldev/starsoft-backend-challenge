# Starsoft-backend-challenge

Projeto criada de acordo com para o `starsoft-backend-challenge`.

Veja Também: **[DEPLOY.MD](./DEPLOY.md)**

## Tecnologias:

### Nestjs

Usado como framework principal do projeto.

### Postgres

Banco de Dados do projeto.

### Docker

Usado para o deploy e desenvovimento do projeto.

### Redis

Usado como cache de endpoints de auditoria de eventos, e como cache de roles dos usuários.

### Kafka

Usado para processar os eventos da API em lotes, antes de serem persistidos no banco de dados, diminuindo a carga no Postgres e melhorando a escalabilidade da API.

## Microserviços

- **Api:** Parte Prinicipal da aplicação, fornece os Endpoints REST.

- **Log Consumer:** Microserviço de consumir eventos do Kafka, Separado da aplicação principal com intuito de separar a escalabilidade dos Consumers da API REST.

## Exemplo de uso da API:

> Todo esse processo pode ser realizado pelo swagger em `/swagger`.

1. Crie um usuario usando a rota de registro `POST /auth/register`.
1. Faça o login na API pela rota `POST /auth/login`
1. Adicione o token da rota login como autenticação Bearer Token.\
   > Header: `Authorization: Bearer xxxxxxx`
1. Eleve a permissão do seu usuario atraves do Endpoint `PUT /user`

   > ```json
   > {
   >   "role": "admin"
   > }
   > ```

1. Com a role de admin agora é possivel acessar o endpoint de `GET /audit` e `GET /audit/:key`, e listar os eventos da aplicação.

## Desenvolvimento

Requisitos:

- pnpm
- docker compose

Execute:

```sh
pnpm install
```

Copie o `.env.development.example` para `.env`\

Então:

```sh
docker compose .env up # isso vai usar o arquivo compose.yaml
```

Inicie o Serviço:
\
**API:**

```
pnpm start:dev
```

**Log-Consumer:**

```
pnpm start:dev
```
