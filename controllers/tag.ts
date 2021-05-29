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
    } else {
      await TagModel.increaseTagLevel(tag.id);
    }

    ctx.body = {
      succeed: true,
      data: tag,
    };
  }

  // polish tag
  export async function polishTag(ctx: Context) {
    const { tagId } = ctx.request.body;

    if (!utils.isString(tagId)) {
      throw new Error("30001");
    }

    const result = await TagModel.increaseTagLevel(tagId);

    ctx.body = {
      succeed: true,
      data: result,
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

  // remove memo with tag
  export async function deleteMemoTagLink(ctx: Context) {
    const { memoId, tagId } = ctx.request.body;

    if (!utils.isString(memoId) || !utils.isString(tagId)) {
      throw new Error("30001");
    }

    await TagModel.deleteMemoTag(memoId, tagId);

    ctx.body = {
      succeed: true,
      data: true,
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

    for (const t of tags) {
      const amount = await TagModel.getTagLinkCount(t.id);
      (t as IterObject)["amount"] = amount;
    }

    ctx.body = {
      succeed: true,
      data: tags,
    };
  }

  // get my tags
  export async function getTagLinkCount(ctx: Context) {
    const { tagId } = ctx.query;

    if (!utils.isString(tagId)) {
      throw new Error("30001");
    }

    const count: number = await TagModel.getTagLinkCount(tagId as string);

    ctx.body = {
      succeed: true,
      data: count,
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
