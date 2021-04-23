import { Context, Next } from "koa";
import { getErrorInfo } from "../helpers/Error";

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    const err = getErrorInfo(error);

    ctx.status = err.statusCode;
    ctx.body = {
      status: error,
      succeed: false,
      message: `${err.message}`,
    };
    console.error("Error handler:", error, error.message);
  }
}
