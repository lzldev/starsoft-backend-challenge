FROM node:iron-alpine3.19 AS base_image
RUN apk update
RUN npm install --global pnpm@9.6.0

FROM base_image AS installer
WORKDIR /app/
COPY ./package.json ./pnpm-lock.yaml ./nest-cli.json ./
COPY ./tsconfig.json ./tsconfig.build.json ./ 
RUN pnpm install

FROM installer AS code
WORKDIR /app/
COPY --from=installer /app/ .
COPY ./apps ./apps
COPY ./libs ./libs

FROM code AS api-builder
WORKDIR /app/
RUN pnpm nest build starsoft-take-home

FROM code AS log-consumer-builder
WORKDIR /app/
RUN pnpm nest build log-consumer

FROM base_image AS api
WORKDIR /app/
COPY --from=installer /app/node_modules/ ./node_modules/
COPY --from=api-builder /app/dist/ ./dist/
COPY --from=api-builder /app/package.json .
CMD node ./dist/apps/starsoft-take-home/main.js

FROM base_image AS log-consumer
WORKDIR /app/
COPY --from=installer /app/node_modules/ ./node_modules/
COPY --from=log-consumer-builder /app/dist/ ./dist/
COPY --from=log-consumer-builder /app/package.json .
CMD node ./dist/apps/log-consumer/main.js

