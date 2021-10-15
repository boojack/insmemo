import Router from "koa-router";
import { MemoController } from "../controllers/memo";
import { validSigninCookie } from "../middlewares/authCheck";

export const memoRouter = new Router({
  prefix: "/api/memo",
});

memoRouter.use(validSigninCookie);
memoRouter.get("/", MemoController.getMemoById);
memoRouter.get("/all", MemoController.getMemos);
memoRouter.get("/linkeds", MemoController.getLinkedMemosById);
memoRouter.get("/trash", MemoController.getDeletedMemos);
memoRouter.get("/count", MemoController.getMemosCount);
memoRouter.post("/new", MemoController.createMemo);
memoRouter.post("/hide", MemoController.hideMemo);
memoRouter.post("/restore", MemoController.restoreMemo);
memoRouter.post("/delete", MemoController.deleteMemo);
memoRouter.post("/update", MemoController.updateMemo);
memoRouter.get("/stat", MemoController.getMemoStat);
