"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.githubRouter = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const github_1 = require("../controllers/github");
exports.githubRouter = new koa_router_1.default({
    prefix: "/api/gh",
});
exports.githubRouter.get("/oauth", github_1.GithubController.oauth);
