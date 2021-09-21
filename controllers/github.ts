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
    const tokenRes = await axios.get(
      `https://github.com/login/oauth/access_token?client_id=${githubOAuthConfig.clientId}&client_secret=${githubOAuthConfig.clientSecret}&code=${code}`
    );
    const accessToken = querystring.parse(tokenRes.data).access_token as string;

    if (!accessToken) {
      throw new Error("20010");
    }

    const ghUserRes = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: "token " + accessToken,
      },
    });
    const ghUser = ghUserRes.data as GithubUserInfo;

    if (!ghUser) {
      throw new Error("20010");
    }

    // 如果已经登录，则更新绑定信息
    const userId = ctx.cookies.get("user_id") as string;

    if (userId) {
      const githubNameUsable = await UserModel.checkGithubnameUsable(ghUser.login);
      if (!githubNameUsable) {
        throw new Error("20011");
      }
      await UserModel.updateGithubName(userId, ghUser.login);
    }

    let user = await UserModel.getUserByGhName(ghUser.login);

    if (!user) {
      // 创建新用户
      if (user === null) {
        // 防止用户名重复
        let username = ghUser.name;
        let usernameUsable = await UserModel.checkUsernameUsable(username);
        while (!usernameUsable) {
          username += "v";
          usernameUsable = await UserModel.checkUsernameUsable(username);
        }
        user = await UserModel.createUser(username, username, ghUser.login);
      }
    }

    ctx.cookies.set("user_id", user.id, {
      maxAge: 1000 * 3600 * 24 * 365,
    });
    ctx.redirect("https://memos.justsven.top/");
  }
}
