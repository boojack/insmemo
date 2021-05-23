import fs from "fs";
import http from "http";
import https from "https";
import path from "path";
import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import Serve from "koa-static";
import { errorHandler } from "./middlewares/errorHandler";
import { userRouter } from "./routers/user";
import { memoRouter } from "./routers/memo";
import { tagRouter } from "./routers/tag";

const app = new Koa();

// 错误处理中间件
app.use(errorHandler);

// 跨域（仅供 dev 使用）
if (process.env.NODE_ENV === "dev") {
  app.use(
    cors({
      credentials: true,
    })
  );
}
app.use(bodyParser());

// static files server
app.use(Serve("./web/dist/"));

app.use(userRouter.routes());
app.use(memoRouter.routes());
app.use(tagRouter.routes());

const config = {
  http: {
    port: 8080,
  },
  https: {
    port: 8081,
    options: {
      key: fs.readFileSync(path.resolve(process.cwd(), "certs/justsven.top.key"), "utf8").toString(),
      cert: fs.readFileSync(path.resolve(process.cwd(), "certs/justsven.top.pem"), "utf8").toString(),
    },
  },
};

const appCallback = app.callback();

const httpServer = http.createServer(appCallback);
httpServer.listen(config.http.port, () => {
  console.log("http server started");
});

const httpsServer = https.createServer(config.https.options, appCallback);
httpsServer.listen(config.https.port, () => {
  console.log("https server started");
});
