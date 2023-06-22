FROM mcr.microsoft.com/devcontainers/typescript-node:0-18 AS build

WORKDIR /api

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm migrate:dev

RUN pnpm build

FROM mcr.microsoft.com/devcontainers/typescript-node:0-18

COPY --from=build /api/node_modules ./
COPY --from=build /api/package.json ./
COPY --from=build /api/pnpm-lock.yaml ./
COPY --from=build /api/dist ./dist

CMD ["pnpm", "start"]