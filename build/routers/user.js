"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const user_1 = require("../controllers/user");
const authCheck_1 = require("../middlewares/authCheck");
exports.userRouter = new koa_router_1.default({
    prefix: "/api/user",
});
exports.userRouter.get("/me", authCheck_1.validSigninCookie, user_1.UserController.getMyUserInfo);
exports.userRouter.post("/signup", user_1.UserController.signup);
exports.userRouter.post("/signin", user_1.UserController.signin);
exports.userRouter.post("/signout", user_1.UserController.signout);
exports.userRouter.get("/checkusername", authCheck_1.validSigninCookie, user_1.UserController.checkUsernameUsable);
exports.userRouter.post("/update", authCheck_1.validSigninCookie, user_1.UserController.update);
exports.userRouter.post("/checkpassword", authCheck_1.validSigninCookie, user_1.UserController.checkPassword);
