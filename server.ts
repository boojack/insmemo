import Koa from "koa";
import Serve from "koa-static";
import { DB } from "./helpers/DBHelper";
import { userRouter } from "./routers/user";

const app = new Koa();

app.use(Serve("./web/dist/"));

app.use(userRouter.routes());

app.listen(8080, async () => {
  await DB.connectToMySQL();
});
