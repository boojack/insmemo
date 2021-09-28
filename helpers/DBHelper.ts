import { utils } from "./utils";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./db/memos.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the sqlite database.");
});

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
