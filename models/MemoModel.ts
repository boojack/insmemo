import { DB } from "../helpers/DBHelper";
import { utils } from "../helpers/utils";

interface MemoType {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export namespace MemoModel {
  export async function createMemo(userId: string, content: string): Promise<MemoType> {
    const sql = `INSERT INTO memos (id, content, user_id, created_at, updated_at) VALUES (?)`;
    const nowTimeStr = utils.getTimeString();
    const memo: MemoType = {
      id: utils.genUUID(),
      content,
      userId,
      createdAt: nowTimeStr,
      updatedAt: nowTimeStr,
    };

    await DB.query(sql, [Object.values(memo)]);
    return memo;
  }

  export async function countMemosByUserId(userId: string): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM memos WHERE user_id=?`;

    const data = await DB.query(sql, [userId]);
    if (Array.isArray(data) && data.length > 0) {
      return data[0].count as number;
    } else {
      return Promise.reject("Error in database.");
    }
  }

  export async function getMemosByUserId(userId: string, offset: number, amount: number = 20): Promise<MemoType[]> {
    const sql = `SELECT * FROM memos WHERE user_id=? ORDER BY created_at DESC LIMIT ${amount} OFFSET ${offset}`;

    const data = await DB.query<MemoType[]>(sql, [userId]);

    if (Array.isArray(data)) {
      return data;
    } else {
      return Promise.reject("Error in database.");
    }
  }

  export async function getMemosWithDuration(userId: string, from: Date, to: Date): Promise<MemoType[]> {
    const sql = `
      SELECT * FROM memos 
      WHERE 
        user_id=?
        ${Boolean(from) ? "AND created_at > '" + utils.getTimeString(from) + "'" : ""} 
        ${Boolean(to) ? "AND created_at < '" + utils.getTimeString(to) + "'" : ""} 
      ORDER BY created_at 
      DESC 
    `;

    const data = await DB.query<MemoType[]>(sql, [userId]);
    if (Array.isArray(data)) {
      return data;
    } else {
      return Promise.reject("Error in database.");
    }
  }

  export async function getMemoById(id: string): Promise<MemoType | null> {
    const sql = `SELECT * FROM memos WHERE id=?`;

    const data = await DB.query<MemoType[]>(sql, [id]);
    if (Array.isArray(data)) {
      if (data.length > 0) {
        return data[0];
      } else {
        return null;
      }
    } else {
      return Promise.reject("Error in database.");
    }
  }

  export async function updateMemoContent(memoId: string, content: string): Promise<boolean> {
    const sql = `UPDATE memos SET content=?, updated_at=? WHERE id=?`;
    const nowTimeStr = utils.getTimeString();

    await DB.query(sql, [content, nowTimeStr, memoId]);
    return true;
  }

  export async function deleteMemoByID(memoId: string): Promise<boolean> {
    const sql = `DELETE FROM memos WHERE id=?`;

    await DB.query(sql, [memoId]);
    return true;
  }

  export async function getMemosStatByUserId(userId: string): Promise<{ timetamp: string; count: number }[]> {
    const sql = `SELECT created_at as timestamp, COUNT(*) as amount
    FROM memos
    WHERE user_id=?
    GROUP BY CONVERT(created_at, DATE)
    ORDER BY created_at;`;

    const data = await DB.query<{ timetamp: string; count: number }[]>(sql, [userId]);
    if (Array.isArray(data)) {
      return data;
    } else {
      return Promise.reject("Error in database.");
    }
  }
}
