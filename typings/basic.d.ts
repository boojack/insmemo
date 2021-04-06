/**
 * type and interface definations
 */
type BasicType = undefined | null | boolean | number | string | Object | Array<BasicType>;
type TimeStamp = number;
type FunctionType = (...args: any) => any;

interface LooseObject {
  [key: string]: any;
}
