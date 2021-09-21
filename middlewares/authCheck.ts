import { Context, Next } from "koa";

export async function validSigninCookie(ctx: Context, next: Next) {
  const userId = ctx.cookies.get("user_id");

  if (!userId) {
    throw new Error("20001");
  }

  await next();
}
