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
exports.QueryModel = void 0;
const DBHelper_1 = __importDefault(require("../helpers/DBHelper"));
const utils_1 = require("../helpers/utils");
var QueryModel;
(function (QueryModel) {
    /**
     * create query
     * @param userId
     * @param text
     */
    function createQuery(userId, title, querystring) {
        return __awaiter(this, void 0, void 0, function* () {
            const nowTimeStr = utils_1.utils.getDateTimeString(Date.now());
            const query = {
                id: utils_1.utils.genUUID(),
                userId,
                title,
                querystring,
                createdAt: nowTimeStr,
                updatedAt: nowTimeStr,
            };
            const sql = `INSERT INTO queries (id, user_id, title, querystring, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`;
            yield DBHelper_1.default.run(sql, Object.values(query));
            return query;
        });
    }
    QueryModel.createQuery = createQuery;
    function pinQuery(queryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const nowTimeStr = utils_1.utils.getDateTimeString(Date.now());
            const sql = `UPDATE queries SET pinned_at=? WHERE id=?`;
            yield DBHelper_1.default.run(sql, [nowTimeStr, queryId]);
            return true;
        });
    }
    QueryModel.pinQuery = pinQuery;
    function unpinQuery(queryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `UPDATE queries SET pinned_at=NULL WHERE id=?`;
            yield DBHelper_1.default.run(sql, [queryId]);
            return true;
        });
    }
    QueryModel.unpinQuery = unpinQuery;
    function getQueriesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT id, title, querystring, created_at, pinned_at FROM queries WHERE user_id=?`;
            const data = yield DBHelper_1.default.all(sql, [userId]);
            return data;
        });
    }
    QueryModel.getQueriesByUserId = getQueriesByUserId;
    function getQueryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM queries WHERE id=?`;
            const data = yield DBHelper_1.default.get(sql, [id]);
            return data;
        });
    }
    QueryModel.getQueryById = getQueryById;
    function getQueryByText(userId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM queries WHERE user_id=? AND querystring=?`;
            const data = yield DBHelper_1.default.get(sql, [userId, text]);
            return data;
        });
    }
    QueryModel.getQueryByText = getQueryByText;
    function updateQuery(id, title, querystring) {
        return __awaiter(this, void 0, void 0, function* () {
            const nowTimeStr = utils_1.utils.getDateTimeString(Date.now());
            const sql = `UPDATE queries SET title=?, querystring=?, updated_at=? WHERE id=?`;
            yield DBHelper_1.default.run(sql, [title, querystring, nowTimeStr, id]);
            return true;
        });
    }
    QueryModel.updateQuery = updateQuery;
    function deleteQueryById(queryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM queries WHERE id=?`;
            yield DBHelper_1.default.run(sql, [queryId]);
            return true;
        });
    }
    QueryModel.deleteQueryById = deleteQueryById;
})(QueryModel = exports.QueryModel || (exports.QueryModel = {}));
