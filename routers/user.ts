import Router from "koa-router";
import { UserController } from "../controllers/user";

export const userRouter = new Router({
  prefix: "/api/user",
});

userRouter.get("/me", UserController.me);
userRouter.post("/signup", UserController.signup);
userRouter.post("/signin", UserController.signin);
userRouter.post("/signout", UserController.signout);
