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
exports.TagController = void 0;
const utils_1 = require("../helpers/utils");
const MemoModel_1 = require("../models/MemoModel");
const TagModel_1 = require("../models/TagModel");
var TagController;
(function (TagController) {
    // create tag
    function createTag(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ctx.cookies.get("user_id");
            const { text } = ctx.request.body;
            if (!utils_1.utils.isString(text)) {
                throw new Error("30001");
            }
            let tag = yield TagModel_1.TagModel.checkExist(userId, text);
            if (!tag) {
                tag = yield TagModel_1.TagModel.createTag(userId, text);
            }
            else {
                yield TagModel_1.TagModel.polishTagLevel(tag.id);
            }
            ctx.body = {
                succeed: true,
                data: tag,
            };
        });
    }
    TagController.createTag = createTag;
    // polish tag
    function polishTag(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tagId } = ctx.request.body;
            if (!utils_1.utils.isString(tagId)) {
                throw new Error("30001");
            }
            const result = yield TagModel_1.TagModel.polishTagLevel(tagId);
            ctx.body = {
                succeed: true,
                data: result,
            };
        });
    }
    TagController.polishTag = polishTag;
    function pinTag(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tagId } = ctx.request.body;
            if (!utils_1.utils.isString(tagId)) {
                throw new Error("30001");
            }
            const result = yield TagModel_1.TagModel.pinTag(tagId);
            ctx.body = {
                succeed: true,
                data: result,
            };
        });
    }
    TagController.pinTag = pinTag;
    function unpinTag(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tagId } = ctx.request.body;
            if (!utils_1.utils.isString(tagId)) {
                throw new Error("30001");
            }
            const result = yield TagModel_1.TagModel.unpinTag(tagId);
            ctx.body = {
                succeed: true,
                data: result,
            };
        });
    }
    TagController.unpinTag = unpinTag;
    // update tag
    function updateTag(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ctx.cookies.get("user_id");
            const { id, text } = ctx.request.body;
            if (!utils_1.utils.isString(text)) {
                throw new Error("30001");
            }
            const tag = yield TagModel_1.TagModel.getTagById(id);
            if (!tag) {
                // do nth
            }
            else {
                yield TagModel_1.TagModel.updateTagText(id, text);
                yield MemoModel_1.MemoModel.replaceMemoTagText(userId, tag.text, text);
            }
            ctx.body = {
                succeed: true,
                data: null,
            };
        });
    }
    TagController.updateTag = updateTag;
    // connect memo with tag
    function linkMemoTag(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { memoId, tagId } = ctx.request.body;
            if (!utils_1.utils.isString(memoId) || !utils_1.utils.isString(tagId)) {
                throw new Error("30001");
            }
            yield TagModel_1.TagModel.deleteMemoTag(memoId, tagId);
            const memoTag = yield TagModel_1.TagModel.createMemoTag(memoId, tagId);
            ctx.body = {
                succeed: true,
                data: memoTag,
            };
        });
    }
    TagController.linkMemoTag = linkMemoTag;
    // remove memo with tag
    function deleteMemoTagLink(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { memoId, tagId } = ctx.request.body;
            if (!utils_1.utils.isString(memoId) || !utils_1.utils.isString(tagId)) {
                throw new Error("30001");
            }
            yield TagModel_1.TagModel.deleteMemoTag(memoId, tagId);
            ctx.body = {
                succeed: true,
                data: true,
            };
        });
    }
    TagController.deleteMemoTagLink = deleteMemoTagLink;
    // get memo tags
    function getTagsByMemoId(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: memoId } = ctx.query;
            if (!utils_1.utils.isString(memoId)) {
                throw new Error("30001");
            }
            const tags = yield TagModel_1.TagModel.getMemoTags(memoId);
            ctx.body = {
                succeed: true,
                data: tags,
            };
        });
    }
    TagController.getTagsByMemoId = getTagsByMemoId;
    // get my tags
    function getMyTags(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = ctx.cookies.get("user_id");
            const tags = yield TagModel_1.TagModel.getTagsByUserId(userId);
            ctx.body = {
                succeed: true,
                data: tags,
            };
        });
    }
    TagController.getMyTags = getMyTags;
    // delete tag
    function deleteTagById(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tagId } = ctx.request.body;
            if (!utils_1.utils.isString(tagId)) {
                throw new Error("30001");
            }
            yield TagModel_1.TagModel.deleteMemoTagByTagId(tagId);
            yield TagModel_1.TagModel.deleteTagById(tagId);
            ctx.body = {
                succeed: true,
                data: true,
            };
        });
    }
    TagController.deleteTagById = deleteTagById;
})(TagController = exports.TagController || (exports.TagController = {}));
