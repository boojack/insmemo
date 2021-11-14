"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const memo_1 = require("../controllers/memo");
const authCheck_1 = require("../middlewares/authCheck");
exports.memoRouter = new koa_router_1.default({
    prefix: "/api/memo",
});
exports.memoRouter.use(authCheck_1.validSigninCookie);
exports.memoRouter.get("/", memo_1.MemoController.getMemoById);
exports.memoRouter.get("/all", memo_1.MemoController.getAllMemos);
exports.memoRouter.get("/linked", memo_1.MemoController.getLinkedMemosById);
exports.memoRouter.get("/deleted", memo_1.MemoController.getDeletedMemos);
exports.memoRouter.post("/new", memo_1.MemoController.createMemo);
exports.memoRouter.post("/hide", memo_1.MemoController.hideMemo);
exports.memoRouter.post("/restore", memo_1.MemoController.restoreMemo);
exports.memoRouter.post("/delete", memo_1.MemoController.deleteMemo);
exports.memoRouter.post("/update", memo_1.MemoController.updateMemo);
