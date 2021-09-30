import DB from "../helpers/DBHelper";
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
    const nowTimeStr = utils.getDateTimeString(Date.now());
    const tag: TagType = {
      id: utils.genUUID(),
      userId,
      text,
      level: 0,
      createdAt: nowTimeStr,
    };
    const sql = `INSERT INTO tags (id, user_id, text, level, created_at) VALUES (?, ?, ?, ?, ?)`;

    await DB.run(sql, Object.values(tag));
    return tag;
  }

  export async function countTagsByUserId(userId: string): Promise<number> {
    const sql = `SELECT COUNT(*) as count FROM (SELECT tags.id FROM tags, memo_tag WHERE user_id=? AND tags.id=memo_tag.tag_id GROUP BY tags.id) as temp`;

    const data = await DB.get(sql, [userId]);
    if (data === null) {
      return 0;
    } else {
      return data.count as number;
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
    const sql = `INSERT INTO memo_tag (id, memo_id, tag_id) VALUES (?, ?, ?)`;

    await DB.run(sql, Object.values(memoTag));
    return memoTag;
  }

  export async function polishTagLevel(tagId: string): Promise<boolean> {
    const sql = `UPDATE tags SET level=level+1 WHERE id=?`;

    await DB.run(sql, [tagId]);
    return true;
  }

  export async function getTagsByUserId(userId: string): Promise<TagType[]> {
    const sql = `SELECT tags.id, tags.text, tags.level, tags.created_at, COUNT(*) as amount FROM tags, memo_tag WHERE user_id=? AND tags.id = memo_tag.tag_id GROUP BY tags.id`;

    const data = await DB.all(sql, [userId]);
    return data;
  }

  export async function getMemoTags(memoId: string): Promise<TagType[]> {
    const sql = `SELECT t.id id, t.text text FROM tags t, memo_tag mt WHERE mt.memo_id=? AND t.id=mt.tag_id`;

    const data = await DB.all<TagType[]>(sql, [memoId]);
    return data;
  }

  export async function getTagById(id: string): Promise<TagType | null> {
    const sql = `SELECT * FROM tags WHERE id=?`;

    const data = await DB.get<TagType>(sql, [id]);
    return data;
  }

  export async function updateTagText(id: string, text: string): Promise<boolean> {
    const sql = `UPDATE tags SET text=? WHERE id=?`;

    await DB.run(sql, [text, id]);
    return true;
  }

  export async function checkExist(userId: string, text: string): Promise<TagType | null> {
    const sql = `SELECT * FROM tags WHERE user_id=? AND text=?`;

    const data = await DB.get<TagType>(sql, [userId, text]);
    return data;
  }

  export async function deleteMemoTag(memoId: string, tagId: string): Promise<boolean> {
    const sql = `DELETE FROM memo_tag WHERE memo_id=? AND tag_id=?`;

    await DB.run(sql, [memoId, tagId]);
    return true;
  }

  export async function deleteMemoTagByMemoId(memoId: string): Promise<boolean> {
    const sql = `DELETE FROM memo_tag WHERE memo_id=?`;

    await DB.run(sql, [memoId]);
    return true;
  }

  export async function deleteMemoTagByTagId(tagId: string): Promise<boolean> {
    const sql = `DELETE FROM memo_tag WHERE tag_id=?`;

    await DB.run(sql, [tagId]);
    return true;
  }

  export async function deleteTagById(tagId: string): Promise<boolean> {
    const sql = `DELETE FROM tags WHERE id=?`;

    await DB.run(sql, [tagId]);
    return true;
  }
}
