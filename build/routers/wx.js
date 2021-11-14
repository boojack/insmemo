"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wxRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const wx_1 = require("../controllers/wx");
exports.wxRouter = new koa_router_1.default({
    prefix: "/api/wx",
});
exports.wxRouter.get("/", wx_1.WxController.validate);
exports.wxRouter.post("/", wx_1.WxController.handleWxMessage);
