import { Context } from "koa";
import { utils } from "../helpers/utils";

const token = "insmemo0justsven0top";

export namespace WxController {
  export async function validate(ctx: Context) {
    const signature = ctx.query.signature;
    const timestamp = ctx.query.timestamp;
    const echostr = ctx.query.echostr;
    const nonce = ctx.query.nonce;

    const original = [nonce, timestamp, token].sort().join("");
    const sha1Code = utils.getInsecureSHA1ofStr(original);

    if (signature === sha1Code) {
      ctx.body = echostr;
    } else {
      ctx.body = "wx validate error";
    }
  }
}
