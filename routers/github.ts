import Router from "koa-router";
import { GithubController } from "../controllers/github";

export const githubRouter = new Router({
  prefix: "/api/gh",
});

githubRouter.get("/oauth", GithubController.oauth);
