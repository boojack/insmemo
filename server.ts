import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import Serve from "koa-static";
import { DB } from "./helpers/DBHelper";
import { userRouter } from "./routers/user";
import { memoRouter } from "./routers/memo";
import { errorHandler } from "./middlewares/errorHandler";

const app = new Koa();

app.use(errorHandler);
// 仅供 dev 使用
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

DB.connectToMySQL().then(() => {
  app.listen(8080, async () => {
    console.info("server started");
  });
});
