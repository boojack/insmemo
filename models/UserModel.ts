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
    const nowTimeStr = utils.getNowTimeString();
    const user: UserType = {
      id: utils.genUUID(),
      username,
      password,
      createdAt: nowTimeStr,
      updatedAt: nowTimeStr,
    };
    const sql = "INSERT INTO users (id, username, password, created_at, updated_at) VALUES (?)";

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [Object.values(user)], (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(user);
      });
    });
  }

  export function getUserInfoById(userId: string): Promise<UserType> {
    const sql = "SELECT * FROM users WHERE id=?";

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [userId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        const data = DB.parseResult(results) as UserType[];
        if (Array.isArray(data) && data.length > 0) {
          resolve(data[0]);
        } else {
          reject("Error in database.");
        }
      });
    });
  }

  export function checkUsernameUsable(username: string): Promise<boolean> {
    const sql = "SELECT * FROM users WHERE username=?";

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [username], (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        const data = DB.parseResult(results);

        if (Array.isArray(data) && data.length > 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  export function validSigninInfo(username: string, password: string): Promise<UserType> {
    const sql = "SELECT * FROM users WHERE username=? AND password=?";

    return new Promise((resolve, reject) => {
      DB.conn.query(sql, [username, password], (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        const data = DB.parseResult(results) as UserType[];
        if (Array.isArray(data) && data.length > 0) {
          resolve(data[0]);
        } else {
          reject("Error in database.");
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
//   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY(id)
// )
// `;
