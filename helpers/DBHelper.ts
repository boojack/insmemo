import { accessSync } from "fs";
import sqlite3 from "sqlite3";
import { utils } from "./utils";

const defaultDbFile = "./data/memos.db";
// JUST FOR DEV
const devDbFile = "/Users/sli4/Downloads/data/memos.db";
const userDbFile = process.env.NODE_ENV === "dev" ? devDbFile : "/data/memos.db";

function getDbInstance() {
  let temp: sqlite3.Database;

  try {
    accessSync(userDbFile);
    temp = new sqlite3.Database(userDbFile, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Connected to the user database.");
      }
    });
  } catch (error) {
    console.log("User db file not exist");
    temp = new sqlite3.Database(defaultDbFile, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Connected to the default database.");
      }
    });
  }

  return temp;
}

let db = getDbInstance();

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
    if (!db) {
      db = getDbInstance();
    }
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(sql, parms, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      });
    });
  },
  all: <T = any[]>(sql: string, parms: any[]): Promise<T> => {
    if (!db) {
      db = getDbInstance();
    }
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(sql, parms, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(parseResult(rows) as T);
          }
        });
      });
    });
  },
  get: <T = any>(sql: string, parms: any[]): Promise<T | null> => {
    if (!db) {
      db = getDbInstance();
    }
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.get(sql, parms, (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(parseResult(row) as T | null);
          }
        });
      });
    });
  },
};
