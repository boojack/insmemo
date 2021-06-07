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
  export async function createUser(username: string, password: string): Promise<UserType> {
    const nowTimeStr = utils.getTimeString();
    const user: UserType = {
      id: utils.genUUID(),
      username,
      password,
      createdAt: nowTimeStr,
      updatedAt: nowTimeStr,
    };
    const sql = "INSERT INTO users (id, username, password, created_at, updated_at) VALUES (?)";

    await DB.query(sql, [Object.values(user)]);
    return user;
  }

  export async function updateUser(id: string, username: string, password: string): Promise<boolean> {
    const nowTimeStr = utils.getTimeString();

    const sql = `UPDATE users SET ${username ? "username='" + username + "' ," : ""} ${
      password ? "password='" + password + "' ," : ""
    } updated_at='${nowTimeStr}' WHERE id=?`;

    await DB.query(sql, [id]);
    return true;
  }

  export async function getUserInfoById(userId: string): Promise<UserType> {
    const sql = "SELECT * FROM users WHERE id=?";

    const data = await DB.query<UserType[]>(sql, [userId]);
    if (Array.isArray(data)) {
      return data[0];
    } else {
      return Promise.reject("Error in database.");
    }
  }

  export async function checkUsernameUsable(username: string): Promise<boolean> {
    const sql = "SELECT * FROM users WHERE username=?";

    const data = await DB.query(sql, [username]);

    if (Array.isArray(data) && data.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  export async function validSigninInfo(username: string, password: string): Promise<UserType> {
    const sql = "SELECT * FROM users WHERE username=? AND password=?";

    const data = await DB.query(sql, [username, password]);

    if (Array.isArray(data)) {
      return data[0];
    } else {
      return Promise.reject("Error in database.");
    }
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
