
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration=production

FROM node:20-alpine
WORKDIR /site
RUN npm i -g serve


ARG APP_NAME=demo
COPY --from=build /app/dist/${APP_NAME}/browser/ /site/

EXPOSE 4200

CMD ["serve", "-s", ".", "-l", "4200"]
