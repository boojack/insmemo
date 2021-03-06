import { DB } from "../helpers/DBHelper";
import { utils } from "../helpers/utils";

interface TagType {
  id: string;
  userId: string;
  text: string;
  level: number;
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
  export async function createTag(userId: string, text: string): Promise<TagType> {
    const nowTimeStr = utils.getTimeString();
    const tag: TagType = {
      id: utils.genUUID(),
      userId,
      text,
      level: 0,
      createdAt: nowTimeStr,
    };
    const sql = `INSERT INTO tags (id, user_id, text, level, created_at) VALUES (?)`;

    await DB.query(sql, [Object.values(tag)]);
    return tag;
  }

  export async function countTagsByUserId(userId: string): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM (SELECT tags.id FROM tags, memo_tag WHERE user_id=? AND tags.id=memo_tag.tag_id GROUP BY tags.id) as temp`;

    const data = await DB.query(sql, [userId]);
    if (Array.isArray(data) && data.length > 0) {
      return data[0].count as number;
    } else {
      return Promise.reject("Error in database.");
    }
  }

  /**
   * create memotag
   * @param memoId
   * @param tagId
   */
  export async function createMemoTag(memoId: string, tagId: string): Promise<Object> {
    const memoTag: MemoTagType = {
      id: utils.genUUID(),
      memoId,
      tagId,
    };
    const sql = `INSERT INTO memo_tag (id, memo_id, tag_id) VALUES (?)`;

    await DB.query(sql, [Object.values(memoTag)]);
    return memoTag;
  }

  export async function increaseTagLevel(tagId: string): Promise<boolean> {
    const sql = `UPDATE tags SET level=level+1 WHERE id=?`;

    await DB.query(sql, [tagId]);
    return true;
  }

  export async function getTagsByUserId(userId: string): Promise<TagType[]> {
    const sql = `SELECT tags.id, tags.text, tags.level, tags.created_at, COUNT(*) as amount FROM tags, memo_tag WHERE user_id=? AND tags.id = memo_tag.tag_id GROUP BY tags.id`;

    const data = await DB.query(sql, [userId]);
    if (Array.isArray(data)) {
      return data;
    } else {
      return Promise.reject("Error in database.");
    }
  }

  export async function getMemoTags(memoId: string): Promise<TagType[]> {
    const sql = `SELECT t.id id, t.text text FROM tags t, memo_tag mt WHERE mt.memo_id=? AND t.id=mt.tag_id`;

    const data = await DB.query<TagType[]>(sql, [memoId]);
    if (Array.isArray(data)) {
      return data;
    } else {
      return Promise.reject("Error in database.");
    }
  }

  export async function checkExist(userId: string, text: string): Promise<TagType | null> {
    const sql = `SELECT * FROM tags WHERE user_id=? AND text=?`;

    const data = await DB.query<TagType[]>(sql, [userId, text]);
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

  export async function deleteMemoTag(memoId: string, tagId: string): Promise<boolean> {
    const sql = `DELETE FROM memo_tag WHERE memo_id=? AND tag_id=?`;

    await DB.query(sql, [memoId, tagId]);
    return true;
  }

  export async function deleteMemoTagByMemoId(memoId: string): Promise<boolean> {
    const sql = `DELETE FROM memo_tag WHERE memo_id=?`;

    await DB.query(sql, [memoId]);
    return true;
  }

  export async function deleteMemoTagByTagId(tagId: string): Promise<boolean> {
    const sql = `DELETE FROM memo_tag WHERE tag_id=?`;

    await DB.query(sql, [tagId]);
    return true;
  }

  export async function deleteTagById(tagId: string): Promise<boolean> {
    const sql = `DELETE FROM tags WHERE id=?`;

    await DB.query(sql, [tagId]);
    return true;
  }
}

// const createSql = `
// CREATE TABLE tags (
//   id VARCHAR(36) NOT NULL,
//   user_id VARCHAR(36) NOT NULL,
//   text VARCHAR(36) NOT NULL,
//   level int UNSIGNED NOT NULL DEFAULT 0,
//   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
