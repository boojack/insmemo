import axios from "axios";
import { Context } from "koa";
import { wxConfig } from "../helpers/config";
import { utils } from "../helpers/utils";

const token = "insmemo0justsven0top";
const accessToken = {
  value: "",
  expiresAt: Date.now(),
};
const jsapiTicket = {
  value: "",
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
    if (accessToken.value === "" || accessToken.expiresAt <= Date.now()) {
      const { data } = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxConfig.appID}&secret=${wxConfig.secret}`
      );

      if (data.access_token) {
        accessToken.value = data.access_token;
        accessToken.expiresAt = Date.now() + 7200 * 1000;
      }
    }

    if (jsapiTicket.value === "" || jsapiTicket.expiresAt <= Date.now()) {
      const { data } = await axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken.value}&type=jsapi`);

      if (data.ticket) {
        jsapiTicket.value = data.ticket;
        jsapiTicket.expiresAt = Date.now() + 7200 * 1000;
      }
    }

    const timestamp = Math.ceil(Date.now() / 1000);
    const rawString = `jsapi_ticket=${jsapiTicket.value}&noncestr=insmemo&timestamp=${timestamp}&url=http://mp.weixin.qq.com?params=value`;

    ctx.body = {
      succeed: true,
      timestamp: timestamp,
      signature: utils.getInsecureSHA1ofStr(rawString),
    };
  }
}
