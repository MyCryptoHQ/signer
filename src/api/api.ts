import { ipcMain, WebContents } from 'electron';

import { IPC_CHANNELS, JsonRPCRequest, JsonRPCResponse, SUPPORTED_METHODS } from '@types';
import { safeJSONParse } from '@utils';

import { isValidRequest } from './validators';

const toJsonRpcResponse = (response: Omit<JsonRPCResponse, 'jsonrpc'>) => {
  return { jsonrpc: '2.0', ...response };
};

const requestSigning = (
  request: JsonRPCRequest,
  webContents: WebContents
): Promise<JsonRPCResponse> => {
  // @todo Cleaner way of doing this?
  // @todo Reject?
  return new Promise((resolve, _reject) => {
    webContents.send(IPC_CHANNELS.API, request);

    ipcMain.on(IPC_CHANNELS.API, function _listener(_event, arg) {
      const response = arg as JsonRPCResponse;
      if (response.id === request.id) {
        // Resolve promise and remove listener if response matches request
        // Since it is then the actual result of the JSON RPC request in question
        resolve(response);
        ipcMain.removeListener(IPC_CHANNELS.API, _listener);
      }
    });
  });
};

// Replies follow: https://www.jsonrpc.org/specification
export const handleRequest = async (
  data: string,
  webContents: WebContents
): Promise<JsonRPCResponse> => {
  // @todo: Further sanitation?
  const [valid, parsed] = safeJSONParse(data);
  if (valid !== null) {
    return toJsonRpcResponse({
      id: null,
      error: { code: '-32700', message: 'Parse error' }
    });
  }
  const request = parsed as JsonRPCRequest;
  if (!Object.values(SUPPORTED_METHODS).includes(request.method)) {
    return toJsonRpcResponse({
      id: request.id,
      error: { code: '-32601', message: 'Unsupported method' }
    });
  }
  if (!isValidRequest(request)) {
    return toJsonRpcResponse({
      id: null,
      error: { code: '-32600', message: 'Invalid Request' }
    });
  }
  switch (request.method) {
    case SUPPORTED_METHODS.SIGN_TRANSACTION:
      return requestSigning(request, webContents);
    // @todo Actual account handling
    case SUPPORTED_METHODS.ACCOUNTS:
      return toJsonRpcResponse({
        id: request.id,
        result: ['0x82D69476357A03415E92B5780C89e5E9e972Ce75']
      });
    default:
      return Promise.reject(new Error('Unexpected error'));
  }
};
