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
  export function createMemo(userId: string, content: string, uponMemoId?: string): Promise<MemoType> {
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

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [Object.values(memo)], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(memo);
        }
      });
    });
  }

  export function saveLocalMemo(
    userId: string,
    content: string,
    createdAt: string,
    updatedAt: string,
    uponMemoId?: string
  ): Promise<MemoType> {
    const sql = `INSERT INTO memos (id, content, user_id, upon_memo_id, created_at, updated_at) VALUES (?)`;
    const nowTimeStr = utils.getTimeString();
    const memo: MemoType = {
      id: utils.genUUID(),
      content,
      userId,
      uponMemoId,
      createdAt: createdAt || nowTimeStr,
      updatedAt: updatedAt || nowTimeStr,
    };

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [Object.values(memo)], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(memo);
        }
      });
    });
  }

  export function getMemosByUserId(userId: string, offset: number, amount: number = 20): Promise<MemoType[]> {
    const sql = `SELECT * FROM memos WHERE user_id=? ORDER BY created_at DESC LIMIT ${amount} OFFSET ${offset}`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(DB.parseResult(result) as MemoType[]);
        }
      });
    });
  }

  export function getMemoById(id: string): Promise<MemoType> {
    const sql = `SELECT * FROM memos WHERE id=?`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve((DB.parseResult(result) as MemoType[])[0]);
        }
      });
    });
  }

  export function updateMemoContent(memoId: string, content: string): Promise<boolean> {
    const sql = `UPDATE memos SET content=?, updated_at=? WHERE id=?`;
    const nowTimeStr = utils.getTimeString();

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [content, nowTimeStr, memoId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  export function deleteMemoByID(memoId: string): Promise<boolean> {
    const sql = `DELETE FROM memos WHERE id=?`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [memoId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

// const createSql = `
// CREATE TABLE memos (
//   id VARCHAR(36) NOT NULL,
//   content TEXT NOT NULL,
//   user_id VARCHAR(36) NOT NULL,
//   upon_memo_id VARCHAR(36),
//   created_at TIMESTAMP NOT NULL,
//   updated_at TIMESTAMP NOT NULL,
//   PRIMARY KEY(id),
//   FOREIGN KEY(user_id) REFERENCES users(id)
// )
// `;
