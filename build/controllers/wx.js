"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WxController = void 0;
const xml2js_1 = require("xml2js");
const utils_1 = require("../helpers/utils");
const MemoModel_1 = require("../models/MemoModel");
const UserModel_1 = require("../models/UserModel");
const TOKEN = "insmemo0justsven0top";
var WxController;
(function (WxController) {
    function validate(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const signature = ctx.query.signature;
            const timestamp = ctx.query.timestamp;
            const echostr = ctx.query.echostr;
            const nonce = ctx.query.nonce;
            const original = [nonce, timestamp, TOKEN].sort().join("");
            const sha1Code = utils_1.utils.getInsecureSHA1ofStr(original);
            if (signature === sha1Code) {
                ctx.body = echostr;
            }
            else {
                ctx.body = "wx validate error";
            }
        });
    }
    WxController.validate = validate;
    function handleWxMessage(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, xml2js_1.parseStringPromise)(ctx.request.body, {
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
                    const user = yield UserModel_1.UserModel.getUserByWxUserId(wxUserId);
                    if (user) {
                        const msgType = data.MsgType;
                        let content = "";
                        if (msgType === "text") {
                            content = data.Content;
                        }
                        else if (msgType === "image") {
                            content = data.PicUrl;
                        }
                        else if (msgType === "voice") {
                            content = data.Recognition;
                        }
                        else if (msgType === "link") {
                            const title = data.Title;
                            const description = data.Description;
                            const url = data.Url;
                            content = `${title}\n${description}\n${url}`;
                        }
                        if (content) {
                            yield MemoModel_1.MemoModel.createMemo(user.id, content);
                            responseContent = `保存成功 🎉`;
                        }
                    }
                    else {
                        responseContent = `请先绑定微信 id：${wxUserId}。`;
                    }
                }
                catch (error) {
                    responseContent = `Error: ${error}`;
                }
            }
            else {
                ctx.body = {
                    success: false,
                    msg: "data is null",
                };
                return;
            }
            ctx.type = "application/xml";
            ctx.method = "GET";
            ctx.body = getWxApplyMsgXML(userId, accountId, responseContent);
        });
    }
    WxController.handleWxMessage = handleWxMessage;
    function getWxApplyMsgXML(toUser, fromUser, content) {
        const time = Math.round(new Date().getTime() / 1000);
        return `<xml><ToUserName><![CDATA[${toUser}]]></ToUserName><FromUserName><![CDATA[${fromUser}]]></FromUserName><Content><![CDATA[${content}]]></Content><CreateTime>${time}</CreateTime><MsgType><![CDATA[text]]></MsgType></xml>`;
    }
})(WxController = exports.WxController || (exports.WxController = {}));
