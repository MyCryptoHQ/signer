import React from 'react';

import { DeepPartial, EnhancedStore } from '@reduxjs/toolkit';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { ApplicationState, denyCurrentTransaction, sign } from '@app/store';
import {
  fAccount,
  fAccounts,
  fKeystore,
  fKeystorePassword,
  fMnemonicPhrase,
  fPrivateKey,
  fTxRequest,
  getTransactionRequest
} from '@fixtures';
import { IAccount, WalletType } from '@types';
import { makeQueueTx, makeTx } from '@utils';

import { SignTransaction } from '../SignTransaction';

const createMockStore = configureStore<DeepPartial<ApplicationState>>();

function getComponent(store: EnhancedStore<DeepPartial<ApplicationState>>) {
  return render(
    <Router>
      <Provider store={store}>
        <SignTransaction />
      </Provider>
    </Router>
  );
}

const getComponentWithStore = (account: IAccount = fAccount) => {
  const transactionRequest = makeQueueTx(getTransactionRequest(account.address));
  const mockStore = createMockStore({
    accounts: {
      // @ts-expect-error Brand bug with DeepPartial
      accounts: [account]
    },
    transactions: {
      // @ts-expect-error Brand bug with DeepPartial
      queue: [transactionRequest],
      // @ts-expect-error Brand bug with DeepPartial
      currentTransaction: transactionRequest
    }
  });

  const component = getComponent(mockStore);
  return { component, mockStore };
};

describe('SignTransaction', () => {
  it('renders', async () => {
    const {
      component: { getByText }
    } = getComponentWithStore();
    expect(getByText('Approve Transaction').textContent).toBeDefined();
  });

  it('can accept tx with private key', async () => {
    const {
      component: { getByText, getByLabelText },
      mockStore
    } = getComponentWithStore();
    await waitFor(() => expect(getByText('Approve Transaction')?.textContent).toBeDefined());

    const privkeyInput = getByLabelText('Private Key');
    expect(privkeyInput).toBeDefined();
    fireEvent.change(privkeyInput, { target: { value: fPrivateKey } });

    const acceptButton = getByText('Approve Transaction');
    fireEvent.click(acceptButton);

    expect(mockStore.getActions()).toContainEqual(
      sign({
        wallet: {
          walletType: WalletType.PRIVATE_KEY,
          privateKey: fPrivateKey
        },
        tx: makeTx(fTxRequest)
      })
    );
  });

  it('can accept tx with keystore', async () => {
    const {
      component: { getByText, getByLabelText },
      mockStore
    } = getComponentWithStore(fAccounts[3]);
    await waitFor(() => expect(getByText('Approve Transaction')?.textContent).toBeDefined());

    const keystoreFile = new Blob([fKeystore], { type: 'application/json' });
    keystoreFile.text = async () => fKeystore;

    const keystoreInput = getByLabelText('Keystore');
    expect(keystoreInput).toBeDefined();
    fireEvent.change(keystoreInput, { target: { files: [keystoreFile] } });

    const passwordInput = getByLabelText('Password');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: fKeystorePassword } });

    const acceptButton = getByText('Approve Transaction');
    await waitFor(() => fireEvent.click(acceptButton));

    expect(mockStore.getActions()).toContainEqual(
      sign({
        wallet: {
          walletType: WalletType.KEYSTORE,
          keystore: fKeystore,
          password: fKeystorePassword
        },
        tx: makeTx(fTxRequest)
      })
    );
  });

  it('can accept tx with mnemonic', async () => {
    const {
      component: { getByText, getByLabelText },
      mockStore
    } = getComponentWithStore(fAccounts[1]);
    const acceptButton = getByText('Approve Transaction');
    expect(acceptButton.textContent).toBeDefined();

    const mnemonicInput = getByLabelText('Mnemonic Phrase');
    expect(mnemonicInput).toBeDefined();
    fireEvent.change(mnemonicInput, { target: { value: fMnemonicPhrase } });

    const passwordInput = getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    fireEvent.click(acceptButton);

    const transactionRequest = getTransactionRequest(fAccounts[1].address);
    expect(mockStore.getActions()).toContainEqual(
      sign({
        wallet: {
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: fMnemonicPhrase,
          passphrase: 'password',
          path: fAccounts[1].dPath
        },
        tx: makeTx(transactionRequest.request)
      })
    );
  });

  it('can deny tx', async () => {
    const {
      component: { getByText },
      mockStore
    } = getComponentWithStore();
    const denyButton = getByText('Deny Transaction');
    expect(denyButton.textContent).toBeDefined();

    fireEvent.click(denyButton);

    expect(mockStore.getActions()).toContainEqual(denyCurrentTransaction());
  });
});
