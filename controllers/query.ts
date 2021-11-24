import { Context } from "koa";
import utils from "../helpers/utils";
import { QueryModel } from "../models/QueryModel";

export namespace QueryController {
  // create query
  export async function createQuery(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;
    const { querystring, title } = ctx.request.body;

    if (!utils.isString(querystring) || !utils.isString(title)) {
      throw new Error("30001");
    }

    if (title === "" || querystring === "") {
      throw new Error("30001");
    }

    let query = await QueryModel.getQueryByText(userId, querystring);
    if (!query) {
      query = await QueryModel.createQuery(userId, title, querystring);
    }

    ctx.body = {
      succeed: true,
      data: query,
    };
  }

  export async function pinQuery(ctx: Context) {
    const { queryId } = ctx.request.body;

    if (!utils.isString(queryId)) {
      throw new Error("30001");
    }

    const result = await QueryModel.pinQuery(queryId);

    ctx.body = {
      succeed: true,
      data: result,
    };
  }

  export async function unpinQuery(ctx: Context) {
    const { queryId } = ctx.request.body;

    if (!utils.isString(queryId)) {
      throw new Error("30001");
    }

    const result = await QueryModel.unpinQuery(queryId);

    ctx.body = {
      succeed: true,
      data: result,
    };
  }

  // update query
  export async function updateQuery(ctx: Context) {
    const { queryId, querystring, title } = ctx.request.body;

    if (!utils.isString(queryId) || !utils.isString(querystring) || !utils.isString(title)) {
      throw new Error("30001");
    }

    if (queryId === "" || title === "" || querystring === "") {
      throw new Error("30001");
    }

    await QueryModel.updateQuery(queryId, title, querystring);
    const query = await QueryModel.getQueryById(queryId);

    ctx.body = {
      succeed: true,
      data: query,
    };
  }

  // get my queries
  export async function getMyQueries(ctx: Context) {
    const userId = ctx.cookies.get("user_id") as string;

    const queries = await QueryModel.getQueriesByUserId(userId);

    ctx.body = {
      succeed: true,
      data: queries,
    };
  }

  // delete query
  export async function deleteQueryById(ctx: Context) {
    const { queryId } = ctx.request.body;

    if (!utils.isString(queryId)) {
      throw new Error("30001");
    }

    await QueryModel.deleteQueryById(queryId);

    ctx.body = {
      succeed: true,
      data: true,
    };
  }
}
