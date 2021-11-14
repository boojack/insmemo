"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const tag_1 = require("../controllers/tag");
const authCheck_1 = require("../middlewares/authCheck");
exports.tagRouter = new koa_router_1.default({
    prefix: "/api/tag",
});
exports.tagRouter.use(authCheck_1.validSigninCookie);
exports.tagRouter.get("/all", tag_1.TagController.getMyTags);
exports.tagRouter.get("/memo", tag_1.TagController.getTagsByMemoId);
exports.tagRouter.post("/new", tag_1.TagController.createTag);
exports.tagRouter.post("/update", tag_1.TagController.updateTag);
exports.tagRouter.post("/polish", tag_1.TagController.polishTag);
exports.tagRouter.post("/pin", tag_1.TagController.pinTag);
exports.tagRouter.post("/unpin", tag_1.TagController.unpinTag);
exports.tagRouter.post("/link", tag_1.TagController.linkMemoTag);
exports.tagRouter.post("/rmlink", tag_1.TagController.deleteMemoTagLink);
exports.tagRouter.post("/delete", tag_1.TagController.deleteTagById);
