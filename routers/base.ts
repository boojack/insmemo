import Router from "koa-router";
import { BaseController } from "../controllers/base";

export const baseRouter = new Router({
  prefix: "/api/base",
});

baseRouter.get("/srctype", BaseController.getUrlContentType);
