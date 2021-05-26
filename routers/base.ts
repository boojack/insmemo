import Router from "koa-router";
import { BaseController } from "../controllers/base";

export const baseRouter = new Router({
  prefix: "/api/base",
});

// 暂不提供
// baseRouter.get("/srctype", BaseController.getUrlContentType);
