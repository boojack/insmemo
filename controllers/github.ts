import { Context } from "koa";
import { UserModel } from "../models/UserModel";
import { githubOAuthConfig } from "../helpers/config";
import axios from "axios";
import querystring from "querystring";

interface GithubUserInfo {
  id: number;
  login: string;
  name: string;
}

export namespace GithubController {
  export async function oauth(ctx: Context) {
    const { code } = ctx.query;

    const atRes = await axios.get(
      `https://github.com/login/oauth/access_token?client_id=${githubOAuthConfig.clientId}&client_secret=${githubOAuthConfig.clientSecret}&code=${code}`
    );
    const accessToken = querystring.parse(atRes.data).access_token as string;
    if (!accessToken) {
      throw new Error("20010");
    }

    const userRes = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: "token " + accessToken,
      },
    });
    const ghUser = userRes.data as GithubUserInfo;
    if (!ghUser) {
      throw new Error("20010");
    }

    let user = await UserModel.getUserByGhName(ghUser.login);
    if (!user) {
      if (user === null) {
        user = await UserModel.createUser(ghUser.name, ghUser.name, ghUser.login);
      } else {
        throw new Error("50001");
      }
    }

    ctx.cookies.set("user_id", user.id, {
      maxAge: 1000 * 3600 * 24 * 365,
    });

    ctx.redirect("https://insmemo.justsven.top/");
  }
}
