import { DB } from "../helpers/DBHelper";
import { utils } from "../helpers/utils";

interface TagType {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

interface MemoTagType {
  id: string;
  memoId: string;
  tagId: string;
}

export namespace TagModel {
  /**
   * create tag
   * @param userId
   * @param text
   */
  export function createTag(userId: string, text: string): Promise<TagType> {
    const nowTimeStr = utils.getNowTimeString();
    const tag: TagType = {
      id: utils.genUUID(),
      userId,
      text,
      createdAt: nowTimeStr,
    };
    const sql = `INSERT INTO tags (id, user_id, text, created_at) VALUES (?)`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [Object.values(tag)], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(tag);
        }
      });
    });
  }

  /**
   * create memotag
   * @param memoId
   * @param tagId
   */
  export function createMemoTag(memoId: string, tagId: string): Promise<Object> {
    const memoTag: MemoTagType = {
      id: utils.genUUID(),
      memoId,
      tagId,
    };
    const sql = `INSERT INTO memo_tag (id, memo_id, tag_id) VALUES (?)`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [Object.values(memoTag)], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(memoTag);
        }
      });
    });
  }

  export function getTagsByUserId(userId: string): Promise<TagType[]> {
    const sql = `SELECT * FROM tags WHERE user_id=?`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(DB.parseResult(result) as TagType[]);
        }
      });
    });
  }

  export function getMemoTags(memoId: string): Promise<any[]> {
    const sql = `SELECT t.id id, t.text text FROM tags t, memo_tag mt WHERE mt.memo_id=? AND t.id=mt.tag_id`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [memoId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(DB.parseResult(result) as any[]);
        }
      });
    });
  }

  export function checkExist(userId: string, text: string): Promise<TagType> {
    const sql = `SELECT * FROM tags WHERE user_id=? AND text=?`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [userId, text], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve((DB.parseResult(result) as TagType[])[0]);
        }
      });
    });
  }

  export function deleteMemoTagByMemoId(memoId: string): Promise<boolean> {
    const sql = `DELETE FROM memo_tag WHERE memo_id=?`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [memoId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  export function deleteMemoTagByTagId(tagId: string): Promise<boolean> {
    const sql = `DELETE FROM memo_tag WHERE tag_id=?`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [tagId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  export function deleteTagById(tagId: string): Promise<boolean> {
    const sql = `DELETE FROM tags WHERE id=?`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [tagId], (err, result) => {
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
// CREATE TABLE tags (
//   id VARCHAR(36) NOT NULL,
//   user_id VARCHAR(36) NOT NULL,
//   text VARCHAR(36) NOT NULL,
//   created_at TIMESTAMP NOT NULL,
//   PRIMARY KEY(id),
//   FOREIGN KEY(user_id) REFERENCES users(id)
// )
// `;

// const createMemoTagSql = `
// CREATE TABLE memo_tag (
//   id VARCHAR(36) NOT NULL,
//   memo_id VARCHAR(36) NOT NULL,
//   tag_id VARCHAR(36) NOT NULL,
//   PRIMARY KEY(id),
//   FOREIGN KEY(memo_id) REFERENCES memos(id),
//   FOREIGN KEY(tag_id) REFERENCES tags(id)
// )
// `;
