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
exports.QueryController = void 0;
const utils_1 = require("../helpers/utils");
const QueryModel_1 = require("../models/QueryModel");
var QueryController;
(function (QueryController) {
    // create query
    function createQuery(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ctx.cookies.get("user_id");
            const { querystring, title } = ctx.request.body;
            if (!utils_1.utils.isString(querystring) || !utils_1.utils.isString(title)) {
                throw new Error("30001");
            }
            if (title === "" || querystring === "") {
                throw new Error("30001");
            }
            let query = yield QueryModel_1.QueryModel.getQueryByText(userId, querystring);
            if (!query) {
                query = yield QueryModel_1.QueryModel.createQuery(userId, title, querystring);
            }
            ctx.body = {
                succeed: true,
                data: query,
            };
        });
    }
    QueryController.createQuery = createQuery;
    function pinQuery(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { queryId } = ctx.request.body;
            if (!utils_1.utils.isString(queryId)) {
                throw new Error("30001");
            }
            const result = yield QueryModel_1.QueryModel.pinQuery(queryId);
            ctx.body = {
                succeed: true,
                data: result,
            };
        });
    }
    QueryController.pinQuery = pinQuery;
    function unpinQuery(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { queryId } = ctx.request.body;
            if (!utils_1.utils.isString(queryId)) {
                throw new Error("30001");
            }
            const result = yield QueryModel_1.QueryModel.unpinQuery(queryId);
            ctx.body = {
                succeed: true,
                data: result,
            };
        });
    }
    QueryController.unpinQuery = unpinQuery;
    // update query
    function updateQuery(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { queryId, querystring, title } = ctx.request.body;
            if (!utils_1.utils.isString(queryId) || !utils_1.utils.isString(querystring) || !utils_1.utils.isString(title)) {
                throw new Error("30001");
            }
            if (queryId === "" || title === "" || querystring === "") {
                throw new Error("30001");
            }
            yield QueryModel_1.QueryModel.updateQuery(queryId, title, querystring);
            const query = yield QueryModel_1.QueryModel.getQueryById(queryId);
            ctx.body = {
                succeed: true,
                data: query,
            };
        });
    }
    QueryController.updateQuery = updateQuery;
    // get my queries
    function getMyQueries(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ctx.cookies.get("user_id");
            const queries = yield QueryModel_1.QueryModel.getQueriesByUserId(userId);
            ctx.body = {
                succeed: true,
                data: queries,
            };
        });
    }
    QueryController.getMyQueries = getMyQueries;
    // delete query
    function deleteQueryById(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { queryId } = ctx.request.body;
            if (!utils_1.utils.isString(queryId)) {
                throw new Error("30001");
            }
            yield QueryModel_1.QueryModel.deleteQueryById(queryId);
            ctx.body = {
                succeed: true,
                data: true,
            };
        });
    }
    QueryController.deleteQueryById = deleteQueryById;
})(QueryController = exports.QueryController || (exports.QueryController = {}));
