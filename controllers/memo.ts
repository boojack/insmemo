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
      data: memos,
    };
  }

  // get memo by id
  export async function getMemoById(ctx: Context) {
    const id = ctx.params.id as string;

    const memo = await MemoModel.getMemoById(id);

    ctx.body = {
      data: memo,
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
      data: memo,
    };
  }

  // save local memo
  export async function saveLocalMemo(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;
    const { content, uponMemoId, createdAt, updatedAt } = ctx.request.body;

    if (!content) {
      throw new Error("content is empty");
    }

    const memo = await MemoModel.saveLocalMemo(userId, content, createdAt, updatedAt, uponMemoId);

    ctx.body = {
      data: memo,
    };
  }

  export async function deleteMemo(ctx: Context) {
    const { memoId } = ctx.request.body;

    if (!memoId) {
      throw new Error("memoid is empty");
    }

    const result = await MemoModel.deleteMemoByID(memoId);
    if (!result) {
      throw new Error("delete memo failed");
    }

    ctx.body = {
      message: "delete memo succeed",
    };
  }

  export async function updateMemo(ctx: Context) {
    const { memoId, content } = ctx.request.body;

    if (!content) {
      throw new Error("content is empty");
    }

    const result = await MemoModel.updateMemoContent(memoId, content);
    if (!result) {
      throw new Error("update memo failed");
    }

    ctx.body = {
      message: "update memo content succeed",
    };
  }
}
