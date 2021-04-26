import { Context, Next } from "koa";
import { getErrorInfo } from "../helpers/Error";

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    const errorInfo = getErrorInfo(error.message);

    ctx.status = errorInfo.statusCode;
    ctx.body = {
      succeed: false,
      status: errorInfo.statusCode ?? 500,
      message: `${errorInfo.message}`,
      data: null,
    };
    console.error("Error handler:", error.message, errorInfo);
  }
}
