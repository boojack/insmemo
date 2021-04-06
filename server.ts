import Koa from "koa";
import { DB } from "./helpers/DBHelper";
import { userRouter } from "./routers/user";

const App = new Koa();

App.use(userRouter.routes());

App.listen(8080, async () => {
  await DB.connectToMySQL();
});
