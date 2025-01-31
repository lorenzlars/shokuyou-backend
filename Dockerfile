FROM node:22 AS builder

WORKDIR /app

RUN npm install -g pnpm@latest-10

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:22

WORKDIR /app

COPY --from=builder /app/dist ./

CMD ["node", "main"]
