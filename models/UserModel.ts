import { DB } from "../helpers/DBHelper";
import { utils } from "../helpers/utils";

interface UserType {
  id: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  githubName: string;
}

export namespace UserModel {
  /**
   * create user
   * @param username
   * @param password
   */
  export async function createUser(username: string, password: string, githubName: string = ""): Promise<UserType> {
    const nowTimeStr = utils.getTimeString();
    const user: UserType = {
      id: utils.genUUID(),
      username,
      password,
      createdAt: nowTimeStr,
      updatedAt: nowTimeStr,
      githubName,
    };
    const sql = "INSERT INTO users (id, username, password, created_at, updated_at, github_name) VALUES (?)";

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

  export async function updateGithubName(id: string, githubName: string): Promise<boolean> {
    const sql = `UPDATE users SET github_name=? WHERE id=?`;

    await DB.query(sql, [githubName, id]);
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

  export async function checkGithubnameUsable(githubName: string): Promise<boolean> {
    const sql = "SELECT * FROM users WHERE github_name=?";
    const data = await DB.query(sql, [githubName]);

    if (Array.isArray(data) && data.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  export async function validSigninInfo(username: string, password: string): Promise<UserType | null> {
    const sql = "SELECT * FROM users WHERE username=? AND password=?";

    const data = await DB.query(sql, [username, password]);

    if (Array.isArray(data)) {
      if (data.length > 0) {
        return data[0];
      } else {
        return null;
      }
    } else {
      return Promise.reject("Error in database.");
    }
  }

  export async function validPassword(userId: string, password: string): Promise<boolean> {
    const sql = "SELECT * FROM users WHERE id=? AND password=?";

    const data = await DB.query(sql, [userId, password]);

    if (Array.isArray(data) && data.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  export async function getUserByGhName(gbName: string): Promise<UserType | null> {
    const sql = "SELECT * FROM users WHERE github_name=?";

    const data = await DB.query<UserType[]>(sql, [gbName]);

    if (Array.isArray(data)) {
      if (data.length > 0) {
        return data[0];
      } else {
        return null;
      }
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
//   github_name VARCHAR(32),
//   PRIMARY KEY(id)
// )
// `;
