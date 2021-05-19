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
  export function getTimeString(d: Date | number | string = Date.now()): string {
    const time = new Date(d);

    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const hours = time.getHours();
    const mins = time.getMinutes();
    const secs = time.getSeconds();

    const monthStr = month < 10 ? "0" + month : month;
    const dateStr = date < 10 ? "0" + date : date;
    const hoursStr = hours < 10 ? "0" + hours : hours;
    const minsStr = mins < 10 ? "0" + mins : mins;
    const secsStr = secs < 10 ? "0" + secs : secs;

    return `${year}-${monthStr}-${dateStr} ${hoursStr}:${minsStr}:${secsStr}`;
  }

  export function isString(s: any): boolean {
    return typeof s === "string";
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
