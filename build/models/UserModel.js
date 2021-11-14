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
exports.UserModel = void 0;
const DBHelper_1 = __importDefault(require("../helpers/DBHelper"));
const utils_1 = require("../helpers/utils");
var UserModel;
(function (UserModel) {
    function createUser(username, password, githubName = "", wxUserId = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const nowTimeStr = utils_1.utils.getDateTimeString(Date.now());
            const user = {
                id: utils_1.utils.genUUID(),
                username,
                password,
                createdAt: nowTimeStr,
                updatedAt: nowTimeStr,
                githubName,
                wxUserId,
            };
            const sql = "INSERT INTO users (id, username, password, created_at, updated_at, github_name, wx_user_id) VALUES (?, ?, ?, ?, ?, ?)";
            yield DBHelper_1.default.run(sql, Object.values(user));
            return user;
        });
    }
    UserModel.createUser = createUser;
    function updateUser(id, username, password, githubName, wxUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const nowTimeStr = utils_1.utils.getDateTimeString(Date.now());
            const sql = `UPDATE users SET ${username !== undefined ? "username='" + username + "' ," : ""} ${password !== undefined ? "password='" + password + "' ," : ""} ${githubName !== undefined ? "github_name='" + githubName + "' ," : ""} ${wxUserId !== undefined ? "wx_user_id='" + wxUserId + "' ," : ""} updated_at='${nowTimeStr}' WHERE id=?`;
            yield DBHelper_1.default.run(sql, [id]);
            return true;
        });
    }
    UserModel.updateUser = updateUser;
    function getUserInfoById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "SELECT * FROM users WHERE id=?";
            const data = yield DBHelper_1.default.get(sql, [userId]);
            return data;
        });
    }
    UserModel.getUserInfoById = getUserInfoById;
    function checkUsernameUsable(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "SELECT * FROM users WHERE username=?";
            const data = yield DBHelper_1.default.get(sql, [username]);
            if (data === null) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    UserModel.checkUsernameUsable = checkUsernameUsable;
    function checkGithubnameUsable(githubName) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "SELECT * FROM users WHERE github_name=?";
            const data = yield DBHelper_1.default.get(sql, [githubName]);
            if (data === null) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    UserModel.checkGithubnameUsable = checkGithubnameUsable;
    function validSigninInfo(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "SELECT * FROM users WHERE username=? AND password=?";
            const data = yield DBHelper_1.default.get(sql, [username, password]);
            return data;
        });
    }
    UserModel.validSigninInfo = validSigninInfo;
    function validPassword(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "SELECT * FROM users WHERE id=? AND password=?";
            const data = yield DBHelper_1.default.get(sql, [userId, password]);
            if (data === null) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    UserModel.validPassword = validPassword;
    function getUserByGhName(gbName) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "SELECT * FROM users WHERE github_name=?";
            const data = yield DBHelper_1.default.get(sql, [gbName]);
            return data;
        });
    }
    UserModel.getUserByGhName = getUserByGhName;
    function getUserByWxUserId(wxUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "SELECT * FROM users WHERE wx_user_id=?";
            const data = yield DBHelper_1.default.get(sql, [wxUserId]);
            return data;
        });
    }
    UserModel.getUserByWxUserId = getUserByWxUserId;
})(UserModel = exports.UserModel || (exports.UserModel = {}));
