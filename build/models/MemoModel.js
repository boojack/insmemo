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
exports.MemoModel = void 0;
const DBHelper_1 = __importDefault(require("../helpers/DBHelper"));
const utils_1 = require("../helpers/utils");
var MemoModel;
(function (MemoModel) {
    function createMemo(userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `INSERT INTO memos (id, content, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`;
            const nowTimeStr = utils_1.utils.getDateTimeString(Date.now());
            const memo = {
                id: utils_1.utils.genUUID(),
                content,
                userId,
                createdAt: nowTimeStr,
                updatedAt: nowTimeStr,
            };
            yield DBHelper_1.default.run(sql, Object.values(memo));
            return memo;
        });
    }
    MemoModel.createMemo = createMemo;
    function countMemosByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) as count FROM memos WHERE user_id=?`;
            const data = yield DBHelper_1.default.get(sql, [userId]);
            if (data === null) {
                return 0;
            }
            else {
                return data.count;
            }
        });
    }
    MemoModel.countMemosByUserId = countMemosByUserId;
    function getAllMemosByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT id, content, created_at, updated_at, deleted_at FROM memos WHERE user_id=? AND deleted_at IS NULL ORDER BY created_at DESC`;
            const data = yield DBHelper_1.default.all(sql, [userId]);
            return data;
        });
    }
    MemoModel.getAllMemosByUserId = getAllMemosByUserId;
    function getMemosByUserId(userId, offset, amount = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM memos WHERE user_id=? AND deleted_at IS NULL ORDER BY created_at DESC LIMIT ${amount} OFFSET ${offset}`;
            const data = yield DBHelper_1.default.all(sql, [userId]);
            return data;
        });
    }
    MemoModel.getMemosByUserId = getMemosByUserId;
    function getDeletedMemosByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM memos WHERE user_id=? AND deleted_at IS NOT NULL ORDER BY deleted_at DESC`;
            const data = yield DBHelper_1.default.all(sql, [userId]);
            return data;
        });
    }
    MemoModel.getDeletedMemosByUserId = getDeletedMemosByUserId;
    function getMemosWithDuration(userId, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
      SELECT * FROM memos 
      WHERE 
        user_id=?
        ${Boolean(from) ? "AND created_at > '" + utils_1.utils.getDateTimeString(from) + "'" : ""} 
        ${Boolean(to) ? "AND created_at < '" + utils_1.utils.getDateTimeString(to) + "'" : ""} 
      ORDER BY created_at 
      DESC 
    `;
            const data = yield DBHelper_1.default.all(sql, [userId]);
            return data;
        });
    }
    MemoModel.getMemosWithDuration = getMemosWithDuration;
    function getMemoById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM memos WHERE id=?`;
            const data = yield DBHelper_1.default.get(sql, [id]);
            return data;
        });
    }
    MemoModel.getMemoById = getMemoById;
    function getLinkedMemosById(userId, memoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM memos WHERE user_id=? AND content LIKE '%[@%](${memoId})%'`;
            const data = yield DBHelper_1.default.all(sql, [userId]);
            return data;
        });
    }
    MemoModel.getLinkedMemosById = getLinkedMemosById;
    function updateMemoContent(memoId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE memos SET content=?, updated_at=? WHERE id=?`;
            const nowTimeStr = utils_1.utils.getDateTimeString(Date.now());
            yield DBHelper_1.default.run(sql, [content, nowTimeStr, memoId]);
            return true;
        });
    }
    MemoModel.updateMemoContent = updateMemoContent;
    function deleteMemoByID(memoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM memos WHERE id=?`;
            yield DBHelper_1.default.run(sql, [memoId]);
            return true;
        });
    }
    MemoModel.deleteMemoByID = deleteMemoByID;
    function updateMemoDeletedAt(memoId, deletedAtStr) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE memos SET deleted_at=? WHERE id=?`;
            const data = yield DBHelper_1.default.all(sql, [deletedAtStr, memoId]);
            return data;
        });
    }
    MemoModel.updateMemoDeletedAt = updateMemoDeletedAt;
    function replaceMemoTagText(userId, prev, curr) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE memos SET content=REPLACE(content, ?, ?) WHERE user_id=?`;
            yield DBHelper_1.default.run(sql, ["# " + prev + " ", "# " + curr + " ", userId]);
            return true;
        });
    }
    MemoModel.replaceMemoTagText = replaceMemoTagText;
})(MemoModel = exports.MemoModel || (exports.MemoModel = {}));
