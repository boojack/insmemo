import { Connection, createConnection } from "mysql2";
import { utils } from "./utils";

const connectionConfig = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "insmemo",
};

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
}
