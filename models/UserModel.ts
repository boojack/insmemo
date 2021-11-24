import DB from "../helpers/DBHelper";
import utils from "../helpers/utils";

interface UserType {
  id: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  githubName: string;
  wxUserId: string;
}

export namespace UserModel {
  export async function createUser(username: string, password: string, githubName = "", wxUserId = ""): Promise<UserType> {
    const nowTimeStr = utils.getDateTimeString(Date.now());
    const user: UserType = {
      id: utils.genUUID(),
      username,
      password,
      createdAt: nowTimeStr,
      updatedAt: nowTimeStr,
      githubName,
      wxUserId,
    };
    const sql = "INSERT INTO users (id, username, password, created_at, updated_at, github_name, wx_user_id) VALUES (?, ?, ?, ?, ?, ?)";
    await DB.run(sql, Object.values(user));
    return user;
  }

  export async function updateUser(
    id: string,
    username?: string,
    password?: string,
    githubName?: string,
    wxUserId?: string
  ): Promise<boolean> {
    const nowTimeStr = utils.getDateTimeString(Date.now());
    const sql = `UPDATE users SET ${username !== undefined ? "username='" + username + "' ," : ""} ${
      password !== undefined ? "password='" + password + "' ," : ""
    } ${githubName !== undefined ? "github_name='" + githubName + "' ," : ""} ${
      wxUserId !== undefined ? "wx_user_id='" + wxUserId + "' ," : ""
    } updated_at='${nowTimeStr}' WHERE id=?`;
    await DB.run(sql, [id]);
    return true;
  }

  export async function getUserInfoById(userId: string): Promise<UserType | null> {
    const sql = "SELECT * FROM users WHERE id=?";
    const data = await DB.get<UserType>(sql, [userId]);
    return data;
  }

  export async function checkUsernameUsable(username: string): Promise<boolean> {
    const sql = "SELECT * FROM users WHERE username=?";
    const data = await DB.get(sql, [username]);
    if (data === null) {
      return true;
    } else {
      return false;
    }
  }

  export async function checkGithubnameUsable(githubName: string): Promise<boolean> {
    const sql = "SELECT * FROM users WHERE github_name=?";
    const data = await DB.get(sql, [githubName]);
    if (data === null) {
      return true;
    } else {
      return false;
    }
  }

  export async function validSigninInfo(username: string, password: string): Promise<UserType | null> {
    const sql = "SELECT * FROM users WHERE username=? AND password=?";
    const data = await DB.get(sql, [username, password]);
    return data;
  }

  export async function validPassword(userId: string, password: string): Promise<boolean> {
    const sql = "SELECT * FROM users WHERE id=? AND password=?";
    const data = await DB.get(sql, [userId, password]);
    if (data === null) {
      return false;
    } else {
      return true;
    }
  }

  export async function getUserByGhName(gbName: string): Promise<UserType | null> {
    const sql = "SELECT * FROM users WHERE github_name=?";
    const data = await DB.get<UserType>(sql, [gbName]);
    return data;
  }

  export async function getUserByWxUserId(wxUserId: string): Promise<UserType | null> {
    const sql = "SELECT * FROM users WHERE wx_user_id=?";
    const data = await DB.get<UserType>(sql, [wxUserId]);
    return data;
  }
}
