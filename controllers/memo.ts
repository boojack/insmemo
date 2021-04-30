import { Context } from "koa";
import { utils } from "../helpers/utils";
import { MemoModel } from "../models/MemoModel";
import { TagModel } from "../models/TagModel";

export namespace MemoController {
  // get memos by userid in cookie
  export async function getMemos(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;
    const { offset: offsetStr, amount: amountStr } = ctx.query;
    let offset = parseInt(offsetStr as string) || 0;
    let amount = parseInt(amountStr as string) || 20;

    const memos = await MemoModel.getMemosByUserId(userId, offset, amount);

    ctx.body = {
      succeed: true,
      data: memos,
    };
  }

  // get memo by id
  export async function getMemoById(ctx: Context) {
    const { id } = ctx.query;

    if (!utils.isString(id)) {
      throw new Error("30001");
    }

    const memo = await MemoModel.getMemoById(id as string);

    ctx.body = {
      succeed: true,
      data: memo,
    };
  }

  // create memo
  export async function createMemo(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;
    const { content, uponMemoId } = ctx.request.body;

    if (!utils.isString(content)) {
      throw new Error("30001");
    }

    const memo = await MemoModel.createMemo(userId, content, uponMemoId);

    ctx.body = {
      succeed: true,
      data: memo,
    };
  }

  export async function deleteMemo(ctx: Context) {
    const { memoId } = ctx.request.body;

    if (!utils.isString(memoId)) {
      throw new Error("30001");
    }

    // 删除 memo_tag
    await TagModel.deleteMemoTagByMemoId(memoId);
    const result = await MemoModel.deleteMemoByID(memoId);
    if (!result) {
      throw new Error("50002");
    }

    ctx.body = {
      succeed: true,
      message: "delete memo succeed",
    };
  }

  export async function updateMemo(ctx: Context) {
    const { memoId, content } = ctx.request.body;

    if (!utils.isString(memoId) || !utils.isString(content)) {
      throw new Error("30001");
    }

    const result = await MemoModel.updateMemoContent(memoId, content);
    if (!result) {
      throw new Error("50002");
    }

    ctx.body = {
      succeed: true,
      message: "update memo content succeed",
    };
  }
}
