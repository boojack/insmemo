import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Serve from "koa-static";
import { DB } from "./helpers/DBHelper";
import { userRouter } from "./routers/user";

const app = new Koa();

app.use(bodyParser());
// static files server
app.use(Serve("./web/dist/"));

app.use(userRouter.routes());

app.listen(8080, async () => {
  await DB.connectToMySQL();
  console.info("server started");
});
