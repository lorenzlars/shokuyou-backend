FROM node:22

WORKDIR /usr/src/app

RUN npm install -g pnpm@latest-10

COPY pnpm-lock.yaml ./

RUN pnpm fetch --prod

COPY . .

RUN pnpm install --ignore-scripts

RUN pnpm run build

CMD ["node", "dist/main"]
