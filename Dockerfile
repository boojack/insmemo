FROM node:lts-alpine

WORKDIR /usr/src/app
ENV TZ=Asia/Shanghai

COPY . .

RUN npm install --only=production

RUN npm run build

CMD [ "node", "./build/server.js" ]

EXPOSE 8080