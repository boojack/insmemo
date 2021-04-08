import { Context } from "koa";
import { MemoModel } from "../models/MemoModel";

export namespace MemoController {
  // get memos by userid in cookie
  export async function getMemos(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;

    const { offset: offsetStr, amount: amountStr } = ctx.query;
    let offset = parseInt(offsetStr as string) | 0;
    let amount = parseInt(amountStr as string) | 20;

    const memos = await MemoModel.getMemosByUserId(userId, offset, amount);

    ctx.body = {
      status: 200,
      data: memos,
    };
  }

  // create memo
  export async function createMemo(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;
    const { content, uponMemoId } = ctx.request.body;

    if (!content) {
      throw new Error("content is empty");
    }

    const memo = await MemoModel.createMemo(userId, content, uponMemoId);

    ctx.body = {
      status: 200,
      data: memo,
    };
  }

  export async function deleteMemo(ctx: Context) {
    const { memoId } = ctx.request.body;

    if (!memoId) {
      throw new Error("memoid is empty");
    }

    await MemoModel.deleteMemoByID(memoId);

    ctx.body = {
      status: 200,
      message: "delete memo succeed",
    };
  }

  export async function updateMemo(ctx: Context) {
    const { memoId, content } = ctx.request.body;

    if (!content) {
      throw new Error("content is empty");
    }

    await MemoModel.updateMemoContent(memoId, content);

    ctx.body = {
      status: 200,
      message: "update memo content succeed",
    };
  }
}
