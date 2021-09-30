import DB from "../helpers/DBHelper";
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
    const sql = `INSERT INTO memos (id, content, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`;
    const nowTimeStr = utils.getDateTimeString(Date.now());
    const memo: MemoType = {
      id: utils.genUUID(),
      content,
      userId,
      createdAt: nowTimeStr,
      updatedAt: nowTimeStr,
    };

    await DB.run(sql, Object.values(memo));
    return memo;
  }

  export async function countMemosByUserId(userId: string): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM memos WHERE user_id=?`;

    const data = await DB.get(sql, [userId]);
    if (data === null) {
      return 0;
    } else {
      return data.count as number;
    }
  }

  export async function getMemosByUserId(userId: string, offset: number, amount: number = 20): Promise<MemoType[]> {
    const sql = `SELECT * FROM memos WHERE user_id=? ORDER BY created_at DESC LIMIT ${amount} OFFSET ${offset}`;

    const data = await DB.all<MemoType[]>(sql, [userId]);
    return data;
  }

  export async function getMemosWithDuration(userId: string, from: Date, to: Date): Promise<MemoType[]> {
    const sql = `
      SELECT * FROM memos 
      WHERE 
        user_id=?
        ${Boolean(from) ? "AND created_at > '" + utils.getDateTimeString(from) + "'" : ""} 
        ${Boolean(to) ? "AND created_at < '" + utils.getDateTimeString(to) + "'" : ""} 
      ORDER BY created_at 
      DESC 
    `;

    const data = await DB.all<MemoType[]>(sql, [userId]);
    return data;
  }

  export async function getMemoById(id: string): Promise<MemoType | null> {
    const sql = `SELECT * FROM memos WHERE id=?`;

    const data = await DB.get<MemoType>(sql, [id]);
    return data;
  }

  export async function updateMemoContent(memoId: string, content: string): Promise<boolean> {
    const sql = `UPDATE memos SET content=?, updated_at=? WHERE id=?`;
    const nowTimeStr = utils.getDateTimeString(Date.now());

    await DB.run(sql, [content, nowTimeStr, memoId]);
    return true;
  }

  export async function deleteMemoByID(memoId: string): Promise<boolean> {
    const sql = `DELETE FROM memos WHERE id=?`;

    await DB.run(sql, [memoId]);
    return true;
  }

  export async function replaceMemoTagText(userId: string, prev: string, curr: string): Promise<boolean> {
    const sql = `UPDATE memos SET content=REPLACE(content, ?, ?) WHERE user_id=?`;
    await DB.run(sql, ["# " + prev + " ", "# " + curr + " ", userId]);
    return true;
  }

  export async function getMemosStatByUserId(userId: string): Promise<{ timetamp: string; count: number }[]> {
    const sql = `SELECT created_at as timestamp, COUNT(*) as amount
    FROM memos
    WHERE user_id=?
    GROUP BY created_at
    ORDER BY created_at;`;

    const data = await DB.all<{ timetamp: string; count: number }[]>(sql, [userId]);
    return data;
  }
}
