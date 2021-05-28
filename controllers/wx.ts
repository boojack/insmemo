import axios from "axios";
import { Context } from "koa";
import { wxConfig } from "../helpers/config";
import { utils } from "../helpers/utils";

const token = "insmemo0justsven0top";
const jsapiTicket = {
  value: "",
  timestamp: 0,
  expiresAt: Date.now(),
};

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

  export async function getSignatures(ctx: Context) {
    if (jsapiTicket.value === "" || jsapiTicket.expiresAt <= Date.now()) {
      const { data: token } = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxConfig.appID}&secret=${wxConfig.secret}`
      );

      console.log(token, token.access_token);
      const { data } = await axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token.access_token}&type=jsapi`);

      console.log(data);

      const timestamp = Math.ceil(Date.now() / 1000);
      if (data.ticket) {
        jsapiTicket.value = data.ticket;
        jsapiTicket.timestamp = timestamp;
        jsapiTicket.expiresAt = Date.now() + 7200 * 1000;
      }
    }

    const rawString = `jsapi_ticket=${jsapiTicket.value}&noncestr=insmemo&timestamp=${jsapiTicket.timestamp}&url=https://insmemo.justsven.top/`;

    ctx.body = {
      succeed: true,
      timestamp: jsapiTicket.timestamp,
      signature: utils.getInsecureSHA1ofStr(rawString),
    };
  }
}
