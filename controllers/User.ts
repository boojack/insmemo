import { Context } from "koa";
import { UserModel } from "../models/UserModel";

export namespace UserController {
  export async function me(ctx: Context) {
    const userId = ctx.cookies.get("user_id");

    if (!userId) {
      ctx.body = {
        status: 200,
        message: "need to sign in",
      };
      return;
    }

    const user = await UserModel.getUserInfoById(userId);

    ctx.body = {
      status: 200,
      data: user,
    };
  }

  export async function signup(ctx: Context) {
    const {
      request: { body },
    } = ctx;

    const { username, password } = body;

    if (!username || !password) {
      ctx.body = {
        status: "200",
        message: "bad request",
      };
      return;
    }

    const usernameUsable = await UserModel.checkUsernameUsable(username);
    if (!usernameUsable) {
      ctx.body = {
        status: "200",
        message: "username unusable",
      };
      return;
    }

    const user = await UserModel.createUser(username, password);

    if (!user) {
      ctx.body = {
        status: "200",
        message: "username unusable",
      };
      return;
    }

    // TODO: 数据去敏
    user.password = "";

    ctx.cookies.set("user_id", user.id, {
      sameSite: true,
    });

    ctx.body = {
      status: "200",
      message: "succeed",
      data: user,
    };
  }

  export async function signin(ctx: Context) {
    const {
      request: { body },
    } = ctx;

    const { username, password } = body;

    if (!username || !password) {
      ctx.body = {
        status: "200",
        message: "bad request",
      };
      return;
    }

    const user = await UserModel.validSigninInfo(username, password);

    if (!user) {
      ctx.body = {
        status: "200",
        message: "unvalid",
      };
      return;
    }

    // TODO: 数据去敏
    user.password = "";

    ctx.cookies.set("user_id", user.id, {
      sameSite: true,
    });

    ctx.body = {
      status: "200",
      message: "succeed",
    };
  }

  export async function signout(ctx: Context) {
    ctx.cookies.set("user_id", "", {
      sameSite: true,
      expires: new Date(),
    });

    ctx.body = {
      status: "200",
      message: "succeed",
    };
  }
}
