import { app, ipcMain } from 'electron';
import Store from 'electron-store';
import fs from 'fs';
import path from 'path';

import { AccountsState } from '@app/store/account';
import { IPC_CHANNELS } from '@config';
import { DBRequest, DBRequestType, DBResponse } from '@types';

let store: Store;

export const init = (password: string) => {
  try {
    store = new Store({ encryptionKey: password, clearInvalidConfig: true });
    // Clear in case the store already contains data
    store.clear();
    // Write something to the store to actually create the file
    store.set('accounts', {});
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

const login = (password: string) => {
  try {
    store = new Store({ encryptionKey: password, clearInvalidConfig: false });
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

const storeExists = async () => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  // Is new user if config file doesn't exist
  return !!(await fs.promises.stat(configPath).catch(() => false));
};

const isLoggedIn = () => store !== undefined;

export const getAccounts = () => {
  return store.get('accounts') as AccountsState;
};

const setAccounts = (accounts: AccountsState) => {
  return store.set('accounts', accounts);
};

export const handleRequest = async (request: DBRequest): Promise<DBResponse> => {
  switch (request.type) {
    case DBRequestType.INIT:
      return Promise.resolve(init(request.password));
    case DBRequestType.LOGIN:
      return Promise.resolve(login(request.password));
    case DBRequestType.IS_LOGGED_IN:
      return Promise.resolve(isLoggedIn());
    case DBRequestType.IS_NEW_USER:
      return !(await storeExists());
    case DBRequestType.GET_ACCOUNTS:
      return Promise.resolve(getAccounts());
    case DBRequestType.SET_ACCOUNTS:
      return Promise.resolve(setAccounts(request.accounts));
    default:
      throw new Error('Undefined request type');
  }
};

export const runService = () => {
  ipcMain.handle(IPC_CHANNELS.DATABASE, (_e, request: DBRequest) => handleRequest(request));
};
