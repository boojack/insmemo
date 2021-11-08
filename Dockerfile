FROM node:lts-alpine
WORKDIR /usr/src/app
ENV TZ=Asia/Shanghai
EXPOSE 8080
CMD [ "node", "./build/server.js" ]
COPY package.json .
RUN npm install --only=production
COPY . .
