import { Context } from "koa";
import { TagModel } from "../models/TagModel";

export namespace TagController {
  // create tag
  export async function createTag(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;
    const { text } = ctx.request.body;

    if (!text) {
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
  export async function createMemoTag(ctx: Context) {
    const { memoId, tagId } = ctx.request.body;

    if (!memoId || !tagId) {
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
    const memoId = ctx.params.id as string;

    if (!Boolean(memoId)) {
      throw new Error("30001");
    }

    const tags = await TagModel.getMemoTags(memoId);

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

    if (!Boolean(tagId)) {
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
