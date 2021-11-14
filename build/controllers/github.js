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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubController = void 0;
const UserModel_1 = require("../models/UserModel");
const config_1 = require("../helpers/config");
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
var GithubController;
(function (GithubController) {
    function oauth(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = ctx.query;
            const tokenRes = yield axios_1.default.get(`https://github.com/login/oauth/access_token?client_id=${config_1.githubOAuthConfig.clientId}&client_secret=${config_1.githubOAuthConfig.clientSecret}&code=${code}`);
            const accessToken = querystring_1.default.parse(tokenRes.data).access_token;
            if (!accessToken) {
                throw new Error("20010");
            }
            const ghUserRes = yield axios_1.default.get(`https://api.github.com/user`, {
                headers: {
                    Authorization: "token " + accessToken,
                },
            });
            const ghUser = ghUserRes.data;
            if (!ghUser) {
                throw new Error("20010");
            }
            // 如果已经登录，则更新绑定信息
            const userId = ctx.cookies.get("user_id");
            if (userId) {
                const githubNameUsable = yield UserModel_1.UserModel.checkGithubnameUsable(ghUser.login);
                if (!githubNameUsable) {
                    throw new Error("20011");
                }
                yield UserModel_1.UserModel.updateUser(userId, "", "", ghUser.login);
            }
            let user = yield UserModel_1.UserModel.getUserByGhName(ghUser.login);
            if (user === null) {
                // 创建新用户，防止用户名重复
                let username = ghUser.name;
                let usernameUsable = yield UserModel_1.UserModel.checkUsernameUsable(username);
                while (!usernameUsable) {
                    username += "v";
                    usernameUsable = yield UserModel_1.UserModel.checkUsernameUsable(username);
                }
                user = yield UserModel_1.UserModel.createUser(username, username, ghUser.login);
            }
            ctx.cookies.set("user_id", user.id, {
                expires: new Date(Date.now() + 1000 * 3600 * 24 * 365),
            });
            ctx.redirect("https://memos.justsven.top/");
        });
    }
    GithubController.oauth = oauth;
})(GithubController = exports.GithubController || (exports.GithubController = {}));
