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
    const nowTimeStr = utils.getTimeString();
    const user: UserType = {
      id: utils.genUUID(),
      username,
      password,
      createdAt: nowTimeStr,
      updatedAt: nowTimeStr,
    };
    const sql = `INSERT INTO users (id, username, password, created_at, updated_at) VALUES (?)`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [Object.values(user)], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  export function getUserInfoById(userId: string): Promise<UserType> {
    const sql = `SELECT * FROM users WHERE id=?`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve((DB.parseResult(result) as UserType[])[0]);
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

  export function validSigninInfo(username: string, password: string): Promise<UserType> {
    const sql = `SELECT * FROM users WHERE username=? AND password=?`;

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [username, password], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve((DB.parseResult(result) as UserType[])[0]);
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
