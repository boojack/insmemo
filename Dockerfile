FROM node:lts-alpine

WORKDIR /usr/src/app
ENV TZ=Asia/Shanghai

COPY . .

RUN yarn
RUN yarn build

CMD ["node", "./build/server.js"]

EXPOSE 8080