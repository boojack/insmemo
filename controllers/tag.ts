import { Context } from "koa";
import { utils } from "../helpers/utils";
import { TagModel } from "../models/TagModel";

export namespace TagController {
  // create tag
  export async function createTag(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;
    const { text } = ctx.request.body;

    if (!utils.isString(text)) {
      throw new Error("30001");
    }

    let tag = await TagModel.checkExist(userId, text);
    if (!tag) {
      tag = await TagModel.createTag(userId, text);
    }

    ctx.body = {
      succeed: true,
      data: tag,
    };
  }

  // connect memo with tag
  export async function linkMemoTag(ctx: Context) {
    const { memoId, tagId } = ctx.request.body;

    if (!utils.isString(memoId) || !utils.isString(tagId)) {
      throw new Error("30001");
    }

    const memoTag = await TagModel.createMemoTag(memoId, tagId);

    ctx.body = {
      succeed: true,
      data: memoTag,
    };
  }

  // get memo tags
  export async function getTagsByMemoId(ctx: Context) {
    const { id: memoId } = ctx.query;

    if (!utils.isString(memoId)) {
      throw new Error("30001");
    }

    const tags = await TagModel.getMemoTags(memoId as string);

    ctx.body = {
      succeed: true,
      data: tags,
    };
  }

  // get my tags
  export async function getMyTags(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;

    const tags = await TagModel.getTagsByUserId(userId);

    ctx.body = {
      succeed: true,
      data: tags,
    };
  }

  // delete tag
  export async function deleteTagById(ctx: Context) {
    const { tagId } = ctx.request.body;

    if (!utils.isString(tagId)) {
      throw new Error("30001");
    }

    await TagModel.deleteMemoTagByTagId(tagId);
    await TagModel.deleteTagById(tagId);

    ctx.body = {
      succeed: true,
      data: true,
    };
  }
}
