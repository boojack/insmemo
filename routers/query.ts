import Router from "koa-router";
import { QueryController } from "../controllers/query";
import { validSigninCookie } from "../middlewares/authCheck";

export const queryRouter = new Router({
  prefix: "/api/query",
});

queryRouter.use(validSigninCookie);
queryRouter.get("/all", QueryController.getMyQueries);
queryRouter.post("/new", QueryController.createQuery);
queryRouter.post("/update", QueryController.updateQuery);
queryRouter.post("/delete", QueryController.deleteQueryById);
queryRouter.post("/pin", QueryController.pinQuery);
queryRouter.post("/unpin", QueryController.unpinQuery);
