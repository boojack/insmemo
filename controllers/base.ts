import { Context } from "koa";
import axios from "axios";

export namespace BaseController {
  export async function getUrlContentType(ctx: Context) {
    try {
      const url = ctx.query.url as string;
      const res = await axios.get(url);

      ctx.body = {
        succeed: true,
        data: res.headers["content-type"],
      };
    } catch (error) {
      ctx.body = {
        succeed: true,
        data: "no content",
      };
    }
  }
}
