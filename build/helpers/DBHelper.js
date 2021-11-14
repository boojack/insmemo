"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const sqlite3_1 = __importDefault(require("sqlite3"));
const utils_1 = require("./utils");
// JUST FOR DEV
const devDbFile = "/Users/sli4/Downloads/resources/memos.db";
const userDbFile = process.env.NODE_ENV === "dev" ? devDbFile : "/data/memos.db";
function getDbInstance() {
    let temp;
    try {
        (0, fs_1.accessSync)(userDbFile);
        temp = new sqlite3_1.default.Database(userDbFile, (err) => {
            if (err) {
                console.error(err.message);
            }
            else {
                console.log("Connected to the user database.");
            }
        });
    }
    catch (error) {
        console.log("/data/memo.db file not exist");
        throw "/data/memo.db file not exist";
    }
    return temp;
}
let db = getDbInstance();
function parseResult(result) {
    if (result instanceof Array) {
        const parsedResult = [];
        for (const data of result) {
            parsedResult.push(parseResult(data));
        }
        return parsedResult;
    }
    else if (result instanceof Object) {
        const keys = Object.keys(result).map((k) => utils_1.utils.snakeToCamelCase(k));
        const vals = Object.values(result);
        const d = {};
        for (let i = 0; i < keys.length; ++i) {
            d[keys[i]] = vals[i];
        }
        return d;
    }
    else {
        return null;
    }
}
exports.default = {
    run: (sql, parms) => {
        if (!db) {
            db = getDbInstance();
        }
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run(sql, parms, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        });
    },
    all: (sql, parms) => {
        if (!db) {
            db = getDbInstance();
        }
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all(sql, parms, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(parseResult(rows));
                    }
                });
            });
        });
    },
    get: (sql, parms) => {
        if (!db) {
            db = getDbInstance();
        }
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.get(sql, parms, (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(parseResult(row));
                    }
                });
            });
        });
    },
};
