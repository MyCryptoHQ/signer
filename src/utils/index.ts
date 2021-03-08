export const addHexPrefix = (str: string) => (str.slice(0, 2) === '0x' ? str : `0x${str}`);

export const safeJSONParse = <T>(str: string): [null, T] | [Error, null] => {
  try {
    return [null, JSON.parse(str)];
  } catch (err) {
    return [err, null];
  }
};

export * from './generateUUID';
export { toChecksumAddress } from './toChecksumAddress';
export * from './truncate';
export * from './tx';
