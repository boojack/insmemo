import { createPool, Pool, PoolConnection } from "mysql";
import { connectionConfig } from "./config";
import { utils } from "./utils";

export namespace DB {
  let pool: Pool = createPool(connectionConfig);

  export function query<T = any[]>(sql: string, values: any): Promise<T> {
    return new Promise(async (resovle, reject) => {
      try {
        const conn = await getConnection();
        conn.query(sql, values, (err, result) => {
          conn.release();

          if (err) {
            reject(err);
          } else {
            resovle(parseResult(result) as T);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  function getConnection(): Promise<PoolConnection> {
    return new Promise((resolve, reject) => {
      if (!pool) {
        pool = createPool(connectionConfig);
      }

      pool.getConnection((err, conn) => {
        if (err) {
          reject(err);
        } else {
          resolve(conn);
        }
      });
    });
  }

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
}
