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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoController = void 0;
const utils_1 = require("../helpers/utils");
const MemoModel_1 = require("../models/MemoModel");
var MemoController;
(function (MemoController) {
    // example: /api/memo/all
    function getAllMemos(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ctx.cookies.get("user_id");
            const memos = yield MemoModel_1.MemoModel.getAllMemosByUserId(userId);
            ctx.body = {
                succeed: true,
                data: memos,
            };
        });
    }
    MemoController.getAllMemos = getAllMemos;
    function getDeletedMemos(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ctx.cookies.get("user_id");
            const memos = yield MemoModel_1.MemoModel.getDeletedMemosByUserId(userId);
            ctx.body = {
                succeed: true,
                data: memos,
            };
        });
    }
    MemoController.getDeletedMemos = getDeletedMemos;
    // get memo by id
    function getMemoById(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = ctx.query;
            if (!utils_1.utils.isString(id)) {
                throw new Error("30001");
            }
            const memo = yield MemoModel_1.MemoModel.getMemoById(id);
            ctx.body = {
                succeed: true,
                data: memo,
            };
        });
    }
    MemoController.getMemoById = getMemoById;
    // get linked memos
    function getLinkedMemosById(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ctx.cookies.get("user_id");
            const { memoId } = ctx.query;
            if (!utils_1.utils.isString(memoId)) {
                throw new Error("30001");
            }
            const memos = yield MemoModel_1.MemoModel.getLinkedMemosById(userId, memoId);
            ctx.body = {
                succeed: true,
                data: memos,
            };
        });
    }
    MemoController.getLinkedMemosById = getLinkedMemosById;
    // create memo
    function createMemo(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ctx.cookies.get("user_id");
            const { content } = ctx.request.body;
            if (!utils_1.utils.isString(content)) {
                throw new Error("30001");
            }
            const memo = yield MemoModel_1.MemoModel.createMemo(userId, content);
            ctx.body = {
                succeed: true,
                data: memo,
            };
        });
    }
    MemoController.createMemo = createMemo;
    function hideMemo(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { memoId } = ctx.request.body;
            if (!utils_1.utils.isString(memoId)) {
                throw new Error("30001");
            }
            try {
                const nowTimeStr = utils_1.utils.getDateTimeString(Date.now());
                yield MemoModel_1.MemoModel.updateMemoDeletedAt(memoId, nowTimeStr);
            }
            catch (error) {
                throw new Error("50002");
            }
            ctx.body = {
                succeed: true,
                message: "delete memo succeed",
            };
        });
    }
    MemoController.hideMemo = hideMemo;
    function restoreMemo(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { memoId } = ctx.request.body;
            if (!utils_1.utils.isString(memoId)) {
                throw new Error("30001");
            }
            try {
                yield MemoModel_1.MemoModel.updateMemoDeletedAt(memoId, null);
            }
            catch (error) {
                throw new Error("50002");
            }
            ctx.body = {
                succeed: true,
                message: "delete memo succeed",
            };
        });
    }
    MemoController.restoreMemo = restoreMemo;
    function deleteMemo(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { memoId } = ctx.request.body;
            if (!utils_1.utils.isString(memoId)) {
                throw new Error("30001");
            }
            try {
                yield MemoModel_1.MemoModel.deleteMemoByID(memoId);
            }
            catch (error) {
                throw new Error("50002");
            }
            ctx.body = {
                succeed: true,
                message: "delete memo succeed",
            };
        });
    }
    MemoController.deleteMemo = deleteMemo;
    function updateMemo(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { memoId, content } = ctx.request.body;
            if (!utils_1.utils.isString(memoId) || !utils_1.utils.isString(content)) {
                throw new Error("30001");
            }
            const result = yield MemoModel_1.MemoModel.updateMemoContent(memoId, content);
            if (!result) {
                throw new Error("50002");
            }
            const data = {
                id: memoId,
                content,
            };
            ctx.body = {
                succeed: true,
                message: "update memo content succeed",
                data,
            };
        });
    }
    MemoController.updateMemo = updateMemo;
})(MemoController = exports.MemoController || (exports.MemoController = {}));
