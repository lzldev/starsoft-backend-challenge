# Deploy

### Requisitos:

- Github Actions
- AWS ECR
- Docker
- Docker Compose

## Deploy:

Primeiro Crie um Repositório ECR

Então faça um fork do repositório no github.

Com o fork feito preencha os secrets para github actions com os seguintes valores:

---

`AWS_ACCESS_KEY_ID` -> ID da chave de acesso a AWS\
`AWS_SECRET_ACCESS_KEY` -> Secret da chave de acesso a AWS\
`AWS_REGION` -> Região da AWS onde o repositório ECR se encontra\
`AWS_ECR_REPO` -> Url do repositório no ECR.\
Ex: <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/<REPO_NAME>

---

Com o repositório configurado, inicie a github action para fazer a build dos containers

Após a conclusão da Action. Acesse a maquina onde vai ser feito o Deploy. Clone o repositório github e preencha o arquivo `.env` com os seguintes valores:

---

`PORT` -> Porta da API\
`JWT_SECRET` -> Segredo para o JWT\
`SWAGGER` -> **OPCIONAL** Controla se o swagger vai esta presente no deploy\
`DATABASE_USERNAME` -> Usuário do banco de dados\
`DATABASE_PASSWORD` -> Senha do banco de dados\
`DATABASE_DBNAME` -> Nome do banco de dados\
`ECR_REPO` -> Url do repositório no ECR\

---

Com o `.env` preenchido. Faça login no repositório com o docker.

```bash
# Exemplo:
aws ecr get-login-password --region <AWS_REGION> | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/<REPO_NAME>
```

Feito isso, a aplicação está pronta para o deploy.\
Use o comando:

```bash
docker compose --env-file .env -f compose.prod.yaml up --no-build
```

O `compose.prod.yaml` também inclui o container `watchtower`, que inclui tualiza os containers quando uma nova versão dos containers estiver disponivel, mantendo a aplicação atualizada mesmo sem supervisão.
