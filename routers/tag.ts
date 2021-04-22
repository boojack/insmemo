import Router from "koa-router";
import { TagController } from "../controllers/tag";
import { validSigninCookie } from "../middlewares/jwt";

export const tagRouter = new Router({
  prefix: "/api/tag",
});

tagRouter.use(validSigninCookie);
tagRouter.get("/memo/:id", TagController.getTagsByMemoId);
tagRouter.post("/new", TagController.createTag);
tagRouter.post("/con", TagController.createMemoTag);
tagRouter.get("/all", TagController.getMyTags);
tagRouter.post("/delete", TagController.deleteTagById);
