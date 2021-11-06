import Router from "koa-router";
import { MemoController } from "../controllers/memo";
import { validSigninCookie } from "../middlewares/authCheck";

export const memoRouter = new Router({
  prefix: "/api/memo",
});

memoRouter.use(validSigninCookie);
memoRouter.get("/", MemoController.getMemoById);
memoRouter.get("/all", MemoController.getAllMemos);
memoRouter.get("/linked", MemoController.getLinkedMemosById);
memoRouter.get("/deleted", MemoController.getDeletedMemos);
memoRouter.post("/new", MemoController.createMemo);
memoRouter.post("/hide", MemoController.hideMemo);
memoRouter.post("/restore", MemoController.restoreMemo);
memoRouter.post("/delete", MemoController.deleteMemo);
memoRouter.post("/update", MemoController.updateMemo);
