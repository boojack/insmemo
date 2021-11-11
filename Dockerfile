FROM node:lts-alpine

WORKDIR /usr/src/app
ENV TZ=Asia/Shanghai
EXPOSE 8080

COPY ./package.json ./package.json

RUN npm install --only=production

COPY ./build/ ./build/
COPY ./web/ ./web/

CMD [ "node", "./build/server.js" ]