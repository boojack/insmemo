import Router from "koa-router";
import { MemoController } from "../controllers/memo";
import { validSigninCookie } from "../middlewares/jwt";

export const memoRouter = new Router({
  prefix: "/api/memo",
});

memoRouter.use(validSigninCookie);
memoRouter.get("/", MemoController.getMemoById);
memoRouter.get("/all", MemoController.getMemos);
memoRouter.get("/count", MemoController.getMemosCount);
memoRouter.post("/new", MemoController.createMemo);
memoRouter.post("/delete", MemoController.deleteMemo);
memoRouter.post("/update", MemoController.updateMemo);
memoRouter.get("/stat", MemoController.getMemoStat);
