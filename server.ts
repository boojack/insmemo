import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import Mount from "koa-mount";
import Serve from "koa-static";
import historyApiFallback from "koa2-connect-history-api-fallback";
import { errorHandler } from "./middlewares/errorHandler";
import { userRouter } from "./routers/user";
import { memoRouter } from "./routers/memo";
import { queryRouter } from "./routers/query";
import { githubRouter } from "./routers/github";
import { wxRouter } from "./routers/wx";

const app = new Koa();

app.use(errorHandler);

if (process.env.NODE_ENV === "dev") {
  app.use(
    cors({
      credentials: true,
    })
  );
}

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
