"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModel = void 0;
const DBHelper_1 = __importDefault(require("../helpers/DBHelper"));
const utils_1 = require("../helpers/utils");
var TagModel;
(function (TagModel) {
    /**
     * create tag
     * @param userId
     * @param text
     */
    function createTag(userId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const nowTimeStr = utils_1.utils.getDateTimeString(Date.now());
            const tag = {
                id: utils_1.utils.genUUID(),
                userId,
                text,
                level: 0,
                createdAt: nowTimeStr,
            };
            const sql = `INSERT INTO tags (id, user_id, text, level, created_at) VALUES (?, ?, ?, ?, ?)`;
            yield DBHelper_1.default.run(sql, Object.values(tag));
            return tag;
        });
    }
    TagModel.createTag = createTag;
    function countTagsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) as count FROM (SELECT tags.id FROM tags, memo_tag WHERE user_id=? AND tags.id=memo_tag.tag_id GROUP BY tags.id) as temp`;
            const data = yield DBHelper_1.default.get(sql, [userId]);
            if (data === null) {
                return 0;
            }
            else {
                return data.count;
            }
        });
    }
    TagModel.countTagsByUserId = countTagsByUserId;
    /**
     * create memotag
     * @param memoId
     * @param tagId
     */
    function createMemoTag(memoId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const memoTag = {
                id: utils_1.utils.genUUID(),
                memoId,
                tagId,
            };
            const sql = `INSERT INTO memo_tag (id, memo_id, tag_id) VALUES (?, ?, ?)`;
            yield DBHelper_1.default.run(sql, Object.values(memoTag));
            return memoTag;
        });
    }
    TagModel.createMemoTag = createMemoTag;
    function pinTag(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const nowTimeStr = utils_1.utils.getDateTimeString(Date.now());
            const sql = `UPDATE tags SET pinned_at=? WHERE id=?`;
            yield DBHelper_1.default.run(sql, [nowTimeStr, tagId]);
            return true;
        });
    }
    TagModel.pinTag = pinTag;
    function unpinTag(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE tags SET pinned_at=NULL WHERE id=?`;
            yield DBHelper_1.default.run(sql, [tagId]);
            return true;
        });
    }
    TagModel.unpinTag = unpinTag;
    function polishTagLevel(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE tags SET level=level+1 WHERE id=?`;
            yield DBHelper_1.default.run(sql, [tagId]);
            return true;
        });
    }
    TagModel.polishTagLevel = polishTagLevel;
    function getTagsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT tags.id, tags.text, tags.level, tags.created_at, tags.pinned_at, COUNT(*) as amount FROM tags, memo_tag WHERE user_id=? AND tags.id = memo_tag.tag_id GROUP BY tags.id`;
            const data = yield DBHelper_1.default.all(sql, [userId]);
            return data;
        });
    }
    TagModel.getTagsByUserId = getTagsByUserId;
    function getMemoTags(memoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT t.id id, t.text text FROM tags t, memo_tag mt WHERE mt.memo_id=? AND t.id=mt.tag_id`;
            const data = yield DBHelper_1.default.all(sql, [memoId]);
            return data;
        });
    }
    TagModel.getMemoTags = getMemoTags;
    function getTagById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM tags WHERE id=?`;
            const data = yield DBHelper_1.default.get(sql, [id]);
            return data;
        });
    }
    TagModel.getTagById = getTagById;
    function updateTagText(id, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE tags SET text=? WHERE id=?`;
            yield DBHelper_1.default.run(sql, [text, id]);
            return true;
        });
    }
    TagModel.updateTagText = updateTagText;
    function checkExist(userId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM tags WHERE user_id=? AND text=?`;
            const data = yield DBHelper_1.default.get(sql, [userId, text]);
            return data;
        });
    }
    TagModel.checkExist = checkExist;
    function deleteMemoTag(memoId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM memo_tag WHERE memo_id=? AND tag_id=?`;
            yield DBHelper_1.default.run(sql, [memoId, tagId]);
            return true;
        });
    }
    TagModel.deleteMemoTag = deleteMemoTag;
    function deleteMemoTagByMemoId(memoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM memo_tag WHERE memo_id=?`;
            yield DBHelper_1.default.run(sql, [memoId]);
            return true;
        });
    }
    TagModel.deleteMemoTagByMemoId = deleteMemoTagByMemoId;
    function deleteMemoTagByTagId(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM memo_tag WHERE tag_id=?`;
            yield DBHelper_1.default.run(sql, [tagId]);
            return true;
        });
    }
    TagModel.deleteMemoTagByTagId = deleteMemoTagByTagId;
    function deleteTagById(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM tags WHERE id=?`;
            yield DBHelper_1.default.run(sql, [tagId]);
            return true;
        });
    }
    TagModel.deleteTagById = deleteTagById;
})(TagModel = exports.TagModel || (exports.TagModel = {}));
