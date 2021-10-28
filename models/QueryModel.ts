import DB from "../helpers/DBHelper";
import { utils } from "../helpers/utils";

interface QueryType {
  id: string;
  userId: string;
  title: string;
  querystring: string;
  createdAt: string;
  updatedAt: string;
  pinnedAt?: string;
}

export namespace QueryModel {
  /**
   * create query
   * @param userId
   * @param text
   */
  export async function createQuery(userId: string, title: string, querystring: string): Promise<QueryType> {
    const nowTimeStr = utils.getDateTimeString(Date.now());
    const query: QueryType = {
      id: utils.genUUID(),
      userId,
      title,
      querystring,
      createdAt: nowTimeStr,
      updatedAt: nowTimeStr,
    };
    const sql = `INSERT INTO queries (id, user_id, title, querystring, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`;

    await DB.run(sql, Object.values(query));
    return query;
  }

  export async function pinQuery(queryId: string): Promise<boolean> {
    const nowTimeStr = utils.getDateTimeString(Date.now());
    const sql = `UPDATE queries SET pinned_at=? WHERE id=?`;

    await DB.run(sql, [nowTimeStr, queryId]);
    return true;
  }

  export async function unpinQuery(queryId: string): Promise<boolean> {
    const sql = `UPDATE queries SET pinned_at=NULL WHERE id=?`;

    await DB.run(sql, [queryId]);
    return true;
  }

  export async function getQueriesByUserId(userId: string): Promise<QueryType[]> {
    const sql = `SELECT * FROM queries WHERE user_id=?`;

    const data = await DB.all<QueryType[]>(sql, [userId]);
    return data;
  }

  export async function getQueryById(id: string): Promise<QueryType | null> {
    const sql = `SELECT * FROM queries WHERE id=?`;

    const data = await DB.get<QueryType>(sql, [id]);
    return data;
  }

  export async function getQueryByText(userId: string, text: string): Promise<QueryType | null> {
    const sql = `SELECT * FROM queries WHERE user_id=? AND querystring=?`;

    const data = await DB.get<QueryType>(sql, [userId, text]);
    return data;
  }

  export async function updateQuery(id: string, title: string, querystring: string): Promise<boolean> {
    const nowTimeStr = utils.getDateTimeString(Date.now());
    const sql = `UPDATE queries SET title=?, querystring=?, updated_at=? WHERE id=?`;

    await DB.run(sql, [title, querystring, nowTimeStr, id]);
    return true;
  }

  export async function deleteQueryById(queryId: string): Promise<boolean> {
    const sql = `DELETE FROM queries WHERE id=?`;

    await DB.run(sql, [queryId]);
    return true;
  }
}
