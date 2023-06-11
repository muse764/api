FROM mcr.microsoft.com/devcontainers/typescript-node:0-18 AS build

WORKDIR /api

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run migrate:dev

RUN npm run build

FROM mcr.microsoft.com/devcontainers/typescript-node:0-18

COPY --from=build /api/node_modules ./
COPY --from=build /api/package*.json ./
COPY --from=build /api/dist ./dist

CMD ["npm", "start"]