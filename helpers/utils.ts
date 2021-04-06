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

  export function getNowTimeString(): string {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
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
