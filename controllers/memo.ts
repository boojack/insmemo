import { Context } from "koa";
import { utils } from "../helpers/utils";
import { MemoModel } from "../models/MemoModel";
import { TagModel } from "../models/TagModel";

export namespace MemoController {
  // get memos by userid in cookie
  // example: /api/memo/all?offset=0&amount=20
  export async function getMemos(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;
    const { offset: offsetStr, amount: amountStr } = ctx.query;
    let offset = parseInt(offsetStr as string) || 0;
    let amount = parseInt(amountStr as string) || 20;

    const memos: any[] = await MemoModel.getMemosByUserId(userId, offset, amount);

    for (const m of memos) {
      m.tags = await TagModel.getMemoTags(m.id);
    }

    ctx.body = {
      succeed: true,
      data: memos,
    };
  }

  export async function getDeletedMemos(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;

    const memos: any[] = await MemoModel.getDeletedMemosByUserId(userId);

    ctx.body = {
      succeed: true,
      data: memos,
    };
  }

  // get memos count
  export async function getMemosCount(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;

    const count = await MemoModel.countMemosByUserId(userId);

    ctx.body = {
      succeed: true,
      data: count,
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
    const { content } = ctx.request.body;

    if (!utils.isString(content)) {
      throw new Error("30001");
    }

    const memo = await MemoModel.createMemo(userId, content);

    ctx.body = {
      succeed: true,
      data: memo,
    };
  }

  export async function hideMemo(ctx: Context) {
    const { memoId } = ctx.request.body;

    if (!utils.isString(memoId)) {
      throw new Error("30001");
    }

    try {
      const nowTimeStr = utils.getDateTimeString(Date.now());
      await MemoModel.updateMemoDeletedAt(memoId, nowTimeStr);
    } catch (error) {
      throw new Error("50002");
    }

    ctx.body = {
      succeed: true,
      message: "delete memo succeed",
    };
  }

  export async function restoreMemo(ctx: Context) {
    const { memoId } = ctx.request.body;

    if (!utils.isString(memoId)) {
      throw new Error("30001");
    }

    try {
      await MemoModel.updateMemoDeletedAt(memoId, null);
    } catch (error) {
      throw new Error("50002");
    }

    ctx.body = {
      succeed: true,
      message: "delete memo succeed",
    };
  }

  export async function deleteMemo(ctx: Context) {
    const { memoId } = ctx.request.body;

    if (!utils.isString(memoId)) {
      throw new Error("30001");
    }

    try {
      await TagModel.deleteMemoTagByMemoId(memoId);
      await MemoModel.deleteMemoByID(memoId);
    } catch (error) {
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

    const data: IterObject = {
      id: memoId,
      content,
    };

    ctx.body = {
      succeed: true,
      message: "update memo content succeed",
      data,
    };
  }

  export async function getMemoStat(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;

    const data = await MemoModel.getMemosStatByUserId(userId);

    ctx.body = {
      succeed: true,
      data,
    };
  }
}
