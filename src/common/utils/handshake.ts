import { PrivateKey } from 'eciesjs';

import { HandshakeKeyPair } from '@types';

export const createHandshakeKeyPair = async (): Promise<HandshakeKeyPair> => {
  const privateKey = new PrivateKey();
  const publicKey = privateKey.publicKey;

  return { privateKey: privateKey.toHex(), publicKey: publicKey.toHex() };
};
