import { Context } from "koa";
import utils from "../helpers/utils";
import { MemoModel } from "../models/MemoModel";

export namespace MemoController {
  // example: /api/memo/all
  export async function getAllMemos(ctx: Context) {
    const userId = ctx.session?.userId as string;
    const memos = await MemoModel.getAllMemosByUserId(userId);

    ctx.body = {
      succeed: true,
      data: memos,
    };
  }

  export async function getDeletedMemos(ctx: Context) {
    const userId = ctx.session?.userId as string;

    const memos: any[] = await MemoModel.getDeletedMemosByUserId(userId);

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

  // get linked memos
  export async function getLinkedMemosById(ctx: Context) {
    const userId = ctx.session?.userId as string;
    const { memoId } = ctx.query;

    if (!utils.isString(memoId)) {
      throw new Error("30001");
    }

    const memos = await MemoModel.getLinkedMemosById(userId, memoId as string);

    ctx.body = {
      succeed: true,
      data: memos,
    };
  }

  // create memo
  export async function createMemo(ctx: Context) {
    const userId = ctx.session?.userId as string;
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
}
