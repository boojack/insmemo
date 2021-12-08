import { Context, Next } from "koa";

export async function validSigninCookie(ctx: Context, next: Next) {
  const userId = ctx.session?.userId ?? "";

  if (!Boolean(userId)) {
    throw new Error("20001");
  }

  await next();
}
