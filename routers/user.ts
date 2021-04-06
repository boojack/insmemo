import Router from "koa-router";
import { UserController } from "../controllers/User";

export const userRouter = new Router({
  prefix: "/api/user",
});

userRouter.get("/test", UserController.test);
