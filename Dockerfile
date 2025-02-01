FROM node:22 as build

WORKDIR /usr/src/app

RUN corepack enable

COPY . .

ENV NODE_ENV production

RUN yarn install --immutable

RUN yarn run build


FROM node:22

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
