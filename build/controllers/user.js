"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserModel_1 = require("../models/UserModel");
var UserController;
(function (UserController) {
    /**
     * Get my userinfo
     * use for check sign in status
     */
    function getMyUserInfo(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ctx.cookies.get("user_id");
            const userinfo = yield UserModel_1.UserModel.getUserInfoById(userId);
            if (!userinfo) {
                ctx.body = {
                    succeed: false,
                };
                return;
            }
            // 数据去敏
            const data = userinfo;
            delete data.password;
            ctx.body = {
                succeed: true,
                data,
            };
        });
    }
    UserController.getMyUserInfo = getMyUserInfo;
    function signup(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = ctx.request.body;
            if (!username || !password) {
                throw new Error("30001");
            }
            const usernameUsable = yield UserModel_1.UserModel.checkUsernameUsable(username);
            if (!usernameUsable) {
                throw new Error("20002");
            }
            const user = yield UserModel_1.UserModel.createUser(username, password);
            if (!user) {
                throw new Error("20003");
            }
            ctx.cookies.set("user_id", user.id, {
                expires: new Date(Date.now() + 1000 * 3600 * 24 * 365),
            });
            ctx.body = {
                succeed: true,
                message: "sign up succeed",
            };
        });
    }
    UserController.signup = signup;
    function signin(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password } = ctx.request.body;
            if (!username || !password) {
                throw new Error("30001");
            }
            const user = yield UserModel_1.UserModel.validSigninInfo(username, password);
            if (!user) {
                throw new Error("20004");
            }
            ctx.cookies.set("user_id", user.id, {
                expires: new Date(Date.now() + 1000 * 3600 * 24 * 365),
            });
            ctx.body = {
                succeed: true,
                message: "sign in succeed",
            };
        });
    }
    UserController.signin = signin;
    function signout(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.cookies.set("user_id", null, {});
            ctx.body = {
                succeed: true,
                message: "sign out succeed",
            };
        });
    }
    UserController.signout = signout;
    function checkUsernameUsable(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = ctx.query;
            if (!username) {
                throw new Error("30001");
            }
            const usernameUsable = yield UserModel_1.UserModel.checkUsernameUsable(username);
            ctx.body = {
                succeed: true,
                data: usernameUsable,
            };
        });
    }
    UserController.checkUsernameUsable = checkUsernameUsable;
    function update(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ctx.cookies.get("user_id");
            const { username, password, githubName, wxUserId } = ctx.request.body;
            yield UserModel_1.UserModel.updateUser(userId, username, password, githubName, wxUserId);
            ctx.body = {
                succeed: true,
                message: "update succeed",
            };
        });
    }
    UserController.update = update;
    function checkPassword(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ctx.cookies.get("user_id");
            const { password } = ctx.request.body;
            if (!password) {
                throw new Error("30001");
            }
            const isValid = yield UserModel_1.UserModel.validPassword(userId, password);
            ctx.body = {
                succeed: true,
                data: isValid,
            };
        });
    }
    UserController.checkPassword = checkPassword;
})(UserController = exports.UserController || (exports.UserController = {}));
