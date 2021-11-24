import crypto from "crypto";
import { generate } from "short-uuid";

namespace utils {
  /**
   * generate uuid
   * @returns uuid
   */
  export function genUUID(): string {
    return generate();
  }

  export function getNowTimeStamp(): TimeStamp {
    return Date.now();
  }

  export function getTimeStampByDate(t: Date | number | string): number {
    if (typeof t === "string") {
      t = t.replaceAll("-", "/");
    }
    const d = new Date(t);

    return d.getTime();
  }

  export function getDateStampByDate(t: Date | number | string): number {
    const d = new Date(getTimeStampByDate(t));

    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }

  export function getDateString(t: Date | number | string): string {
    const d = new Date(getTimeStampByDate(t));

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();

    return `${year}/${month}/${date}`;
  }

  export function getTimeString(t: Date | number | string): string {
    const d = new Date(getTimeStampByDate(t));

    const hours = d.getHours();
    const mins = d.getMinutes();

    const hoursStr = hours < 10 ? "0" + hours : hours;
    const minsStr = mins < 10 ? "0" + mins : mins;

    return `${hoursStr}:${minsStr}`;
  }

  // For example: 2021-4-8 17:52:17
  export function getDateTimeString(t: Date | number | string): string {
    const d = new Date(getTimeStampByDate(t));

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();
    const hours = d.getHours();
    const mins = d.getMinutes();
    const secs = d.getSeconds();

    const monthStr = month < 10 ? "0" + month : month;
    const dateStr = date < 10 ? "0" + date : date;
    const hoursStr = hours < 10 ? "0" + hours : hours;
    const minsStr = mins < 10 ? "0" + mins : mins;
    const secsStr = secs < 10 ? "0" + secs : secs;

    return `${year}/${monthStr}/${dateStr} ${hoursStr}:${minsStr}:${secsStr}`;
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

  export function getInsecureSHA1ofStr(str: string) {
    return crypto.createHash("sha1").update(str).digest("hex");
  }
}

export default utils;
