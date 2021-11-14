"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const query_1 = require("../controllers/query");
const authCheck_1 = require("../middlewares/authCheck");
exports.queryRouter = new koa_router_1.default({
    prefix: "/api/query",
});
exports.queryRouter.use(authCheck_1.validSigninCookie);
exports.queryRouter.get("/all", query_1.QueryController.getMyQueries);
exports.queryRouter.post("/new", query_1.QueryController.createQuery);
exports.queryRouter.post("/update", query_1.QueryController.updateQuery);
exports.queryRouter.post("/delete", query_1.QueryController.deleteQueryById);
exports.queryRouter.post("/pin", query_1.QueryController.pinQuery);
exports.queryRouter.post("/unpin", query_1.QueryController.unpinQuery);
