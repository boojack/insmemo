import { Context } from "koa";
import { UserModel } from "../models/UserModel";

export namespace UserController {
  /**
   * Get my userinfo
   * use for check sign in status
   */
  export async function getMyUserInfo(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;
    const user = await UserModel.getUserInfoById(userId);

    // 数据去敏
    const data = user as IterObject;
    delete data.password;

    ctx.body = {
      data,
    };
  }

  export async function signup(ctx: Context) {
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      throw new Error("20001");
    }

    const usernameUsable = await UserModel.checkUsernameUsable(username);
    if (!usernameUsable) {
      throw new Error("20002");
    }

    const user = await UserModel.createUser(username, password);

    if (!user) {
      throw new Error("20003");
    }

    ctx.cookies.set("user_id", user.id, {
      expires: new Date(Date.now() + 1000 * 3600 * 24 * 365),
    });

    ctx.body = {
      succeed: true,
      message: "sign up succeed",
    };
  }

  export async function signin(ctx: Context) {
    const { username, password } = ctx.request.body;

    if (!username || !password) {
      throw new Error("20001");
    }

    const user = await UserModel.validSigninInfo(username, password);

    if (!user) {
      throw new Error("20003");
    }

    ctx.cookies.set("user_id", user.id, {
      expires: new Date(Date.now() + 1000 * 3600 * 24 * 365),
    });

    ctx.body = {
      succeed: true,
      message: "sign in succeed",
    };
  }

  export async function signout(ctx: Context) {
    ctx.cookies.set("user_id", "", {
      expires: new Date(),
    });

    ctx.body = {
      succeed: true,
      message: "sign out succeed",
    };
  }
}
