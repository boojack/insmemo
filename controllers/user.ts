import { Context } from "koa";
import { UserModel } from "../models/UserModel";

export namespace UserController {
  /**
   * Get my userinfo
   * use for check sign in status
   */
  export async function getMyUserInfo(ctx: Context) {
    const userId = ctx.session?.userId as string;
    const userinfo = await UserModel.getUserInfoById(userId);

    if (!userinfo) {
      ctx.body = {
        succeed: false,
      };
      return;
    }

    // 数据去敏
    const data = userinfo as IterObject;
    delete data.password;

    ctx.body = {
      succeed: true,
      data,
    };
  }

  export async function signup(ctx: Context) {
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      throw new Error("30001");
    }

    const usernameUsable = await UserModel.checkUsernameUsable(username);
    if (!usernameUsable) {
      throw new Error("20002");
    }

    const user = await UserModel.createUser(username, password);

    if (!user) {
      throw new Error("20003");
    }

    ctx.session!.userId = user.id;

    ctx.body = {
      succeed: true,
      message: "sign up succeed",
    };
  }

  export async function signin(ctx: Context) {
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      throw new Error("30001");
    }

    const user = await UserModel.validSigninInfo(username, password);

    if (!user) {
      throw new Error("20004");
    }

    ctx.session!.userId = user.id;

    ctx.body = {
      succeed: true,
      message: "sign in succeed",
    };
  }

  export async function signout(ctx: Context) {
    ctx.session!.userId = null;

    ctx.body = {
      succeed: true,
      message: "sign out succeed",
    };
  }

  export async function checkUsernameUsable(ctx: Context) {
    const { username } = ctx.query;

    if (!username) {
      throw new Error("30001");
    }

    const usernameUsable = await UserModel.checkUsernameUsable(username as string);

    ctx.body = {
      succeed: true,
      data: usernameUsable,
    };
  }

  export async function update(ctx: Context) {
    const userId = ctx.session?.userId as string;
    const { username, password, githubName, wxUserId } = ctx.request.body;

    await UserModel.updateUser(userId, username, password, githubName, wxUserId);

    ctx.body = {
      succeed: true,
      message: "update succeed",
    };
  }

  export async function checkPassword(ctx: Context) {
    const userId = ctx.session?.userId as string;
    const { password } = ctx.request.body;

    if (!password) {
      throw new Error("30001");
    }

    const isValid = await UserModel.validPassword(userId, password as string);

    ctx.body = {
      succeed: true,
      data: isValid,
    };
  }
}
