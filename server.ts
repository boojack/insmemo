import Koa from "koa";
import bodyParser from "koa-bodyparser";
import Mount from "koa-mount";
import Serve from "koa-static";
import session from "koa-session";
import historyApiFallback from "koa2-connect-history-api-fallback";
import { errorHandler } from "./middlewares/errorHandler";
import { userRouter } from "./routers/user";
import { memoRouter } from "./routers/memo";
import { queryRouter } from "./routers/query";
import { githubRouter } from "./routers/github";
import { wxRouter } from "./routers/wx";

const app = new Koa();

const CONFIG: Partial<session.opts> = {
  key: "session",
  maxAge: 1000 * 3600 * 24 * 365,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
  secure: false,
  sameSite: "strict",
};

app.keys = ["justsven.site"];

app.use(session(CONFIG, app));

app.use(errorHandler);

app.use(
  Mount(
    "/",
    Serve("./web/", {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      defer: true,
    })
  )
);

app.use(historyApiFallback({ whiteList: ["/api"] }));

app.use(
  bodyParser({
    enableTypes: ["json", "form", "text", "xml"],
  })
);

app.use(userRouter.routes());
app.use(memoRouter.routes());
app.use(queryRouter.routes());
app.use(githubRouter.routes());
app.use(wxRouter.routes());

app.listen(8080, () => {
  console.log("server started in :8080");
});
