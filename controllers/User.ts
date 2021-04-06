import { Context } from "koa";

export namespace UserController {
  // just for test
  export async function test(ctx: Context) {
    ctx.body = "test";
  }

  export async function createUser(ctx: Context) {
    console.log(ctx.request.body);
    ctx.body = {
      
    }
  }
}
