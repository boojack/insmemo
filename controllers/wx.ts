import { Context } from "koa";
import { parseStringPromise } from "xml2js";
import utils from "../helpers/utils";
import { MemoModel } from "../models/MemoModel";
import { UserModel } from "../models/UserModel";

const TOKEN = "insmemo0justsven0top";

export namespace WxController {
  export async function validate(ctx: Context) {
    const signature = ctx.query.signature;
    const timestamp = ctx.query.timestamp;
    const echostr = ctx.query.echostr;
    const nonce = ctx.query.nonce;

    const original = [nonce, timestamp, TOKEN].sort().join("");
    const sha1Code = utils.getInsecureSHA1ofStr(original);

    if (signature === sha1Code) {
      ctx.body = echostr;
    } else {
      ctx.body = "wx validate error";
    }
  }

  export async function handleWxMessage(ctx: Context) {
    const data = await parseStringPromise(ctx.request.body, {
      explicitArray: false,
      explicitRoot: false,
    });

    let responseContent = "";
    let userId = "";
    let accountId = "";

    if (data) {
      const wxUserId = data.FromUserName;
      userId = wxUserId;
      accountId = data.ToUserName;

      try {
        const user = await UserModel.getUserByWxUserId(wxUserId);
        if (user) {
          const msgType = data.MsgType;
          let content = "";

          if (msgType === "text") {
            content = data.Content;
          } else if (msgType === "image") {
            content = data.PicUrl;
          } else if (msgType === "voice") {
            content = data.Recognition;
          } else if (msgType === "link") {
            const title = data.Title;
            const description = data.Description;
            const url = data.Url;
            content = `${title}\n${description}\n${url}`;
          }

          if (content) {
            await MemoModel.createMemo(user.id, content);
            responseContent = `保存成功 🎉`;
          }
        } else {
          responseContent = `请先绑定微信 id：${wxUserId}。`;
        }
      } catch (error) {
        responseContent = `Error: ${error}`;
      }
    } else {
      ctx.body = {
        success: false,
        msg: "data is null",
      };
      return;
    }

    ctx.type = "application/xml";
    ctx.method = "GET";
    ctx.body = getWxApplyMsgXML(userId, accountId, responseContent);
  }

  function getWxApplyMsgXML(toUser: string, fromUser: string, content: string) {
    const time = Math.round(new Date().getTime() / 1000);

    return `<xml><ToUserName><![CDATA[${toUser}]]></ToUserName><FromUserName><![CDATA[${fromUser}]]></FromUserName><Content><![CDATA[${content}]]></Content><CreateTime>${time}</CreateTime><MsgType><![CDATA[text]]></MsgType></xml>`;
  }
}
