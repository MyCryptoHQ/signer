import { TransactionRequest } from '@ethersproject/abstract-provider';
import { Transaction } from '@ethersproject/transactions';

import { JsonRPCRequest, TSignTransaction, TxHistoryEntry, TxQueueEntry, TxResult } from '@types';

export const makeTx = (request: JsonRPCRequest): TransactionRequest => request.params[0];

export const makeQueueTx = (payload: JsonRPCRequest<TSignTransaction>): TxQueueEntry => ({
  id: payload.id,
  tx: makeTx(payload),
  signedTx: undefined,
  result: TxResult.WAITING,
  timestamp: Date.now()
});

export const makeHistoryTx = (
  prev: TxQueueEntry,
  result: TxResult,
  signedTx?: Transaction
): TxHistoryEntry => ({
  tx: prev.tx,
  signedTx,
  result,
  timestamp: Date.now()
});