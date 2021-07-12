import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import Mount from "koa-mount";
import Serve from "koa-static";
import { errorHandler } from "./middlewares/errorHandler";
import { userRouter } from "./routers/user";
import { memoRouter } from "./routers/memo";
import { tagRouter } from "./routers/tag";
import { githubRouter } from "./routers/github";

const app = new Koa();

// 错误处理中间件
app.use(errorHandler);

// 托管静态文件
app.use(
  Mount(
    "/",
    Serve("./web/dist/", {
      // 缓存 1 月
      maxAge: 1000 * 60 * 60 * 24 * 30,
      defer: true,
    })
  )
);

// 托管静态文件
app.use(
  Mount(
    "/mp",
    Serve("./statics/mp/", {
      defer: true,
    })
  )
);

// 跨域（仅供 dev 使用）
if (process.env.NODE_ENV === "dev") {
  app.use(
    cors({
      credentials: true,
    })
  );
}

app.use(bodyParser());

app.use(userRouter.routes());
app.use(memoRouter.routes());
app.use(tagRouter.routes());
app.use(githubRouter.routes());

app.listen(8080, () => {
  console.log("server started in :8080");
});
