import { all } from 'redux-saga/effects';

import { handshakeSaga } from '@common/store';
import type { ReduxIPC } from '@types';

import { accountsSaga } from './accounts.sagas';
import { authSaga } from './auth.sagas';

export default function* rootSaga(ipc: ReduxIPC) {
  yield all([handshakeSaga(ipc), authSaga(), accountsSaga()]);
}
