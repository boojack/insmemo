import { v4 as uuidv4 } from "uuid";

export namespace utils {
  /**
   * generate uuid
   * @returns uuid
   */
  export function genUUID(): string {
    return uuidv4();
  }

  export function getNowTimeStamp(): TimeStamp {
    return Date.now();
  }

  // For example: 2021-4-8 17:52:17
  export function getNowTimeString(): string {
    const date = new Date();

    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  export function snakeToCamelCase(s: string): string {
    const keys = s.split("_").map((k) => toFirstUpperCase(k));

    return toFirstLowerCase(keys.join(""));
  }

  export function toFirstUpperCase(s: string): string {
    return s.replace(/^[a-z]/g, (c) => c.toUpperCase());
  }

  export function toFirstLowerCase(s: string): string {
    return s.replace(/^[A-Z]/g, (c) => c.toLowerCase());
  }
}
