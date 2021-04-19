import { createKeyPair } from '@common/store';

import { createStore } from './store';

const store = createStore({
  emit: process.send,
  on: (listener: any) => {
    process.on('message', listener);
    return () => {
      //process.removeListener('message', listener);
    };
  },
  handle: () => undefined
});
store.dispatch(createKeyPair());

process.send('I AM ALIVE');
