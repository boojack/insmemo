import Router from "koa-router";
import { UserController } from "../controllers/user";
import { validSigninCookie } from "../middlewares/jwt";

export const userRouter = new Router({
  prefix: "/api/user",
});

userRouter.get("/me", validSigninCookie, UserController.getMyUserInfo);
userRouter.get("/amount", validSigninCookie, UserController.getDataAmount);
// userRouter.post("/signup", UserController.signup);
userRouter.post("/signin", UserController.signin);
userRouter.post("/signout", UserController.signout);
userRouter.get("/checkusername", UserController.checkUsernameUsable);
userRouter.post("/update", UserController.update);
