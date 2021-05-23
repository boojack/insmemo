import { DB } from "../helpers/DBHelper";
import { utils } from "../helpers/utils";

interface MemoType {
  id: string;
  content: string;
  userId: string;
  uponMemoId?: string;
  createdAt: string;
  updatedAt: string;
}

export namespace MemoModel {
  export async function createMemo(userId: string, content: string, uponMemoId?: string): Promise<MemoType> {
    const sql = `INSERT INTO memos (id, content, user_id, upon_memo_id, created_at, updated_at) VALUES (?)`;
    const nowTimeStr = utils.getTimeString();
    const memo: MemoType = {
      id: utils.genUUID(),
      content,
      userId,
      uponMemoId,
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

  export async function getMemosWithDuration(
    userId: string,
    from: Date,
    to: Date,
    offset: number = 0,
    amount: number = 20
  ): Promise<MemoType[]> {
    const sql = `
      SELECT * FROM memos 
      WHERE 
        user_id=?
        ${Boolean(from) ? "AND created_at > '" + utils.getTimeString(from) + "'" : ""} 
        ${Boolean(to) ? "AND created_at < '" + utils.getTimeString(to) + "'" : ""} 
      ORDER BY created_at 
      DESC 
      LIMIT ${amount} 
      OFFSET ${offset}
    `;

    const data = await DB.query<MemoType[]>(sql, [userId]);
    if (Array.isArray(data)) {
      return data;
    } else {
      return Promise.reject("Error in database.");
    }
  }

  export async function getMemoById(id: string): Promise<MemoType> {
    const sql = `SELECT * FROM memos WHERE id=?`;

    const data = await DB.query<MemoType[]>(sql, [id]);
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
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
}

// const createSql = `
// CREATE TABLE memos (
//   id VARCHAR(36) NOT NULL,
//   content TEXT NOT NULL,
//   user_id VARCHAR(36) NOT NULL,
//   upon_memo_id VARCHAR(36),
//   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY(id),
//   FOREIGN KEY(user_id) REFERENCES users(id)
// )
// `;
