import { Context } from "koa";
import { TagModel } from "../models/TagModel";

export namespace TagController {
  // create tag
  export async function createTag(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;
    const { text } = ctx.request.body;

    if (!text) {
      throw new Error("text is empty");
    }
    let tag = await TagModel.checkExist(userId, text);
    if (!tag) {
      tag = await TagModel.createTag(userId, text);
    }

    ctx.body = {
      data: tag,
    };
  }

  // connect memo with tag
  export async function createMemoTag(ctx: Context) {
    const { memoId, tagId } = ctx.request.body;

    if (!memoId || !tagId) {
      throw new Error("req body err");
    }

    const memoTag = await TagModel.createMemoTag(memoId, tagId);

    ctx.body = {
      data: memoTag,
    };
  }

  // get memo tags
  export async function getTagsByMemoId(ctx: Context) {
    const memoId = ctx.params.id as string;

    const tags = await TagModel.getMemoTags(memoId);

    ctx.body = {
      data: tags,
    };
  }

  // get my tags
  export async function getMyTags(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;

    const tags = await TagModel.getTagsByUserId(userId);

    ctx.body = {
      data: tags,
    };
  }

  // delete tag
  export async function deleteTagById(ctx: Context) {
    const { tagId } = ctx.request.body;

    await TagModel.deleteMemoTagByTagId(tagId);
    await TagModel.deleteTagById(tagId);

    ctx.body = {
      data: true,
    };
  }
}
