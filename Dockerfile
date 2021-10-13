FROM node:lts-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install --only=production
EXPOSE 8080
ENV TZ=Asia/Shanghai
CMD [ "node", "./build/server.js" ]
