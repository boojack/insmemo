import Router from "koa-router";
import { TagController } from "../controllers/tag";
import { validSigninCookie } from "../middlewares/authCheck";

export const tagRouter = new Router({
  prefix: "/api/tag",
});

tagRouter.use(validSigninCookie);
tagRouter.get("/all", TagController.getMyTags);
tagRouter.get("/memo", TagController.getTagsByMemoId);
tagRouter.post("/new", TagController.createTag);
tagRouter.post("/update", TagController.updateTag);
tagRouter.post("/polish", TagController.polishTag);
tagRouter.post("/link", TagController.linkMemoTag);
tagRouter.post("/rmlink", TagController.deleteMemoTagLink);
tagRouter.post("/delete", TagController.deleteTagById);
