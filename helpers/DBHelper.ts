import { accessSync } from "fs";
import sqlite3 from "sqlite3";
import { utils } from "./utils";

const defaultDbFile = "./db/memos.db";
const userDbFile = "/data/memos.db";

let temp: sqlite3.Database | null = null;

try {
  accessSync(userDbFile);
  temp = new sqlite3.Database(userDbFile, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the user database.");
  });
} catch (error) {
  console.log("User db file not exist");
  temp = new sqlite3.Database(defaultDbFile, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the default database.");
  });
}

const db = temp as sqlite3.Database;

function parseResult(result: any): BasicType {
  if (result instanceof Array) {
    const parsedResult = [];

    for (const data of result) {
      parsedResult.push(parseResult(data));
    }

    return parsedResult;
  } else if (result instanceof Object) {
    const keys = Object.keys(result).map((k) => utils.snakeToCamelCase(k));
    const vals = Object.values(result);
    const d: IterObject = {};

    for (let i = 0; i < keys.length; ++i) {
      d[keys[i]] = vals[i];
    }

    return d;
  } else {
    return null;
  }
}

export default {
  run: (sql: string, parms: any[]): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      db.run(sql, parms, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  },
  all: <T = any[]>(sql: string, parms: any[]): Promise<T> => {
    return new Promise((resolve, reject) => {
      db.all(sql, parms, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(parseResult(rows) as T);
        }
      });
    });
  },
  get: <T = any>(sql: string, parms: any[]): Promise<T | null> => {
    return new Promise((resolve, reject) => {
      db.get(sql, parms, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(parseResult(row) as T | null);
        }
      });
    });
  },
};
