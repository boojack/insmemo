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

    const githubNameUsable = await UserModel.checkGithubnameUsable(ghUser.login);
    if (!githubNameUsable) {
      throw new Error("20011");
    }

    // 如果已经登录，则更新绑定信息
    const userId = ctx.cookies.get("user_id") as string;
    if (userId) {
      await UserModel.updateGithubName(userId, ghUser.login);
    }

    let user = await UserModel.getUserByGhName(ghUser.login);
    if (!user) {
      if (user === null) {
        // 防止用户名重复
        let username = ghUser.name;
        let usernameUsable = await UserModel.checkUsernameUsable(username);
        while (!usernameUsable) {
          username += "v";
          usernameUsable = await UserModel.checkUsernameUsable(username);
        }
        user = await UserModel.createUser(username, username, ghUser.login);
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
