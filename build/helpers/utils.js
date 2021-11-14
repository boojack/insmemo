"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
const crypto_1 = __importDefault(require("crypto"));
const short_uuid_1 = require("short-uuid");
var utils;
(function (utils) {
    /**
     * generate uuid
     * @returns uuid
     */
    function genUUID() {
        return (0, short_uuid_1.generate)();
    }
    utils.genUUID = genUUID;
    function getNowTimeStamp() {
        return Date.now();
    }
    utils.getNowTimeStamp = getNowTimeStamp;
    function getTimeStampByDate(t) {
        if (typeof t === "string") {
            t = t.replaceAll("-", "/");
        }
        const d = new Date(t);
        return d.getTime();
    }
    utils.getTimeStampByDate = getTimeStampByDate;
    function getDateStampByDate(t) {
        const d = new Date(getTimeStampByDate(t));
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    }
    utils.getDateStampByDate = getDateStampByDate;
    function getDateString(t) {
        const d = new Date(getTimeStampByDate(t));
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const date = d.getDate();
        return `${year}/${month}/${date}`;
    }
    utils.getDateString = getDateString;
    function getTimeString(t) {
        const d = new Date(getTimeStampByDate(t));
        const hours = d.getHours();
        const mins = d.getMinutes();
        const hoursStr = hours < 10 ? "0" + hours : hours;
        const minsStr = mins < 10 ? "0" + mins : mins;
        return `${hoursStr}:${minsStr}`;
    }
    utils.getTimeString = getTimeString;
    // For example: 2021-4-8 17:52:17
    function getDateTimeString(t) {
        const d = new Date(getTimeStampByDate(t));
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const date = d.getDate();
        const hours = d.getHours();
        const mins = d.getMinutes();
        const secs = d.getSeconds();
        const monthStr = month < 10 ? "0" + month : month;
        const dateStr = date < 10 ? "0" + date : date;
        const hoursStr = hours < 10 ? "0" + hours : hours;
        const minsStr = mins < 10 ? "0" + mins : mins;
        const secsStr = secs < 10 ? "0" + secs : secs;
        return `${year}/${monthStr}/${dateStr} ${hoursStr}:${minsStr}:${secsStr}`;
    }
    utils.getDateTimeString = getDateTimeString;
    function isString(s) {
        return typeof s === "string";
    }
    utils.isString = isString;
    function snakeToCamelCase(s) {
        const keys = s.split("_").map((k) => toFirstUpperCase(k));
        return toFirstLowerCase(keys.join(""));
    }
    utils.snakeToCamelCase = snakeToCamelCase;
    function toFirstUpperCase(s) {
        return s.replace(/^[a-z]/g, (c) => c.toUpperCase());
    }
    utils.toFirstUpperCase = toFirstUpperCase;
    function toFirstLowerCase(s) {
        return s.replace(/^[A-Z]/g, (c) => c.toLowerCase());
    }
    utils.toFirstLowerCase = toFirstLowerCase;
    function getInsecureSHA1ofStr(str) {
        return crypto_1.default.createHash("sha1").update(str).digest("hex");
    }
    utils.getInsecureSHA1ofStr = getInsecureSHA1ofStr;
})(utils = exports.utils || (exports.utils = {}));
