import Router from "koa-router";
import { WxController } from "../controllers/wx";

export const tagRouter = new Router({
  prefix: "/api/wx",
});

tagRouter.get("/", WxController.validate);
