import { DB } from "../helpers/DBHelper";
import { utils } from "../helpers/utils";

interface UserType {
  id: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export namespace UserModel {
  /**
   * create user
   * @param username
   * @param password
   */
  export function createUser(username: string, password: string): Promise<UserType> {
    const sql = `INSERT INTO users (id, username, password, created_at, updated_at) VALUES (?)`;
    const nowTime = utils.getNowTimeString();
    const user: UserType = {
      id: utils.genUUID(),
      username,
      password,
      createdAt: nowTime,
      updatedAt: nowTime,
    };

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [Object.values(user)], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  export function checkUsernameUsable(username: string): Promise<boolean> {
    const sql = `SELECT * FROM users WHERE username=?`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [username], (err, result) => {
        if (err) {
          reject(err);
        } else {
          result = DB.parseResult(result);
          if (result && result.length > 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        }
      });
    });
  }

  export function validSigninInfo(username: string, password: string): Promise<boolean> {
    const sql = `SELECT * FROM users WHERE username=? AND password=?`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [username, password], (err, result) => {
        if (err) {
          reject(err);
        } else {
          result = DB.parseResult(result);
          if (result && result.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  }
}

// const createSql = `
// CREATE TABLE users (
//   id VARCHAR(36) NOT NULL,
//   username VARCHAR(32) NOT NULL,
//   password VARCHAR(32) NOT NULL,
//   created_at TIMESTAMP NOT NULL,
//   updated_at TIMESTAMP NOT NULL,
//   PRIMARY KEY(id)
// )
// `;
