FROM node:22

WORKDIR /usr/src/app

RUN npm install -g pnpm@latest-10

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

COPY . .

RUN pnpm run build

CMD ["node", "dist/main"]
