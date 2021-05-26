import Router from "koa-router";
import { WxController } from "../controllers/wx";

export const wxRouter = new Router({
  prefix: "/api/wx",
});

wxRouter.get("/", WxController.validate);
