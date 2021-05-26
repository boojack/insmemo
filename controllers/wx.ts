import { Context } from "koa";
import { utils } from "../helpers/utils";

const token = "insmemo0justsven0top";

export namespace WxController {
  export async function validate(ctx: Context) {
    const signature = ctx.query.signature;
    const timestamp = ctx.query.timestamp;
    const echostr = ctx.query.echostr;
    const nonce = ctx.query.nonce;

    const oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = token;
    oriArray.sort();

    const original = oriArray.join("");
    const sha = utils.getInsecureSHA1ofJSON(original);

    if (signature === sha) {
      ctx.body = echostr;
    } else {
      ctx.body = { message: "error" };
    }
  }
}
