FROM node:lts-alpine

WORKDIR /usr/src/app
ENV TZ=Asia/Shanghai

COPY . .

RUN yarn
RUN yarn build

CMD ["GH_CLIENT_ID=187ba36888f152b06612", "GH_CLIENT_SECRET=10b6fec4146cbb7bdf64016b3cf0905366a35041", "GH_REDIRECT_URI=https://memos.justsven.top/", "node", "./build/server.js"]

EXPOSE 8080