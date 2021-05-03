import { hexlify } from '@ethersproject/bytes';
import { sign, utils, verify } from 'noble-ed25519';

import type { JsonRPCRequest } from '@types';
import { stripHexPrefix } from '@utils';

export const hashRequest = async (data: JsonRPCRequest) => {
  const encoded = Buffer.from(JSON.stringify(data), 'utf-8');
  const buffer = await utils.sha512(encoded);
  return stripHexPrefix(hexlify(buffer));
};

export const signRequest = async (data: JsonRPCRequest, privateKey: string) => {
  const hash = await hashRequest(data);
  return sign(hash, privateKey);
};

export const verifyRequest = async (sig: string, data: JsonRPCRequest, publicKey: string) => {
  const hash = await hashRequest(data);
  return verify(sig, hash, publicKey);
};