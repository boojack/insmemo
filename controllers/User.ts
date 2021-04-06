import { Context } from "koa";

export namespace UserController {
  export function test(ctx: Context) {
    ctx.body = "test";
  }

  export function createUser(ctx: Context) {}
}
