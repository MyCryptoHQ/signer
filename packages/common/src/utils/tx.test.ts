import { fTxRequest } from '../__fixtures__';
import { JsonRPCMethod } from '../types';
import { makeTx } from './tx';

describe('makeTx', () => {
  it('extracts tx from json rpc request', () => {
    expect(
      makeTx({
        id: 1,
        jsonrpc: '2.0',
        method: JsonRPCMethod.SignTransaction,
        params: [fTxRequest]
      })
    ).toBe(fTxRequest);
  });
});
