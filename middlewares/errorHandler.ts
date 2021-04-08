import { Context, Next } from "koa";

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    ctx.status = 400;
    ctx.body = `${error.message}`;
    console.error("Error handler:", error.message);
  }
}
