import { Context, Next } from "koa";

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      succeed: false,
      message: `${error.message}`,
    };
    console.error("Error handler:", error.message);
  }
}
