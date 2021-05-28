import axios from "axios";
import { Context } from "koa";
import { wxConfig } from "../helpers/config";
import { utils } from "../helpers/utils";

const token = "insmemo0justsven0top";
const signature = {
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
    if (signature.value === "" || signature.expiresAt <= Date.now()) {
      const { data: token } = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxConfig.appID}&secret=${wxConfig.secret}`
      );
      const { data } = await axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token.access_token}&type=jsapi`);

      const timestamp = Math.ceil(Date.now() / 1000);
      const ticket = data.ticket;
      const rawString = `jsapi_ticket=${ticket}&noncestr=Wm3WZYTPz0wzccnW&timestamp=${timestamp}&url=https://insmemo.justsven.top/`;

      signature.value = utils.getInsecureSHA1ofStr(rawString);
      signature.timestamp = timestamp;
      signature.expiresAt = (timestamp + 7200) * 1000;
    }

    ctx.body = {
      succeed: true,
      timestamp: signature.timestamp,
      signature: signature.value,
    };
  }
}
