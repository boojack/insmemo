import { Connection, createConnection } from "mysql2";
import { connectionConfig } from "./config";
import { utils } from "./utils";

export namespace DB {
  export let conn: Connection;

  export function connectToMySQL(): Promise<Connection> {
    return new Promise((resolve, reject) => {
      const conn = createConnection(connectionConfig);

      conn.connect((err) => {
        if (err) {
          reject(err);
        } else {
          DB.conn = conn;
          resolve(conn);
        }
      });
    });
  }

  /**
   * 解析执行结果，
   * @param result any 类型的数据结果
   * @returns
   */
  export function parseResult(result: any): BasicType {
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

  export function checkStatus(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      if (Boolean(conn)) {
        DB.conn.ping((err) => {
          if (err) {
            console.error(err);
            resolve(false);
          } else {
            resolve(true);
          }
        });
      }
      resolve(false);
    });
  }
}
