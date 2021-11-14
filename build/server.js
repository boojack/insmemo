"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_mount_1 = __importDefault(require("koa-mount"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa2_connect_history_api_fallback_1 = __importDefault(require("koa2-connect-history-api-fallback"));
const errorHandler_1 = require("./middlewares/errorHandler");
const user_1 = require("./routers/user");
const memo_1 = require("./routers/memo");
const query_1 = require("./routers/query");
const github_1 = require("./routers/github");
const wx_1 = require("./routers/wx");
const app = new koa_1.default();
app.use(errorHandler_1.errorHandler);
if (process.env.NODE_ENV === "dev") {
    app.use((0, cors_1.default)({
        credentials: true,
    }));
}
app.use((0, koa_mount_1.default)("/", (0, koa_static_1.default)("./web/", {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    defer: true,
})));
app.use((0, koa2_connect_history_api_fallback_1.default)({ whiteList: ["/api"] }));
app.use((0, koa_bodyparser_1.default)({
    enableTypes: ["json", "form", "text", "xml"],
}));
app.use(user_1.userRouter.routes());
app.use(memo_1.memoRouter.routes());
app.use(query_1.queryRouter.routes());
app.use(github_1.githubRouter.routes());
app.use(wx_1.wxRouter.routes());
app.listen(8080, () => {
    console.log("server started in :8080");
});
