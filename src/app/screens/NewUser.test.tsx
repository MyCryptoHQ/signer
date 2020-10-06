import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { init } from '@app/services/DatabaseService';
import { createStore } from '@app/store';

import { NewUser } from '.';

jest.mock('@app/services/DatabaseService', () => ({
  init: jest.fn()
}));

function getComponent() {
  return render(
    <Provider store={createStore()}>
      <NewUser />
    </Provider>
  );
}

describe('NewUser', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText('Create').textContent).toBeDefined();
  });

  it('can login', async () => {
    const { getByLabelText, getByText } = getComponent();
    const passwordInput = getByLabelText('Enter a new master password');
    expect(passwordInput).toBeDefined();
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    const loginButton = getByText('Create');
    expect(loginButton).toBeDefined();
    fireEvent.click(loginButton);
    expect(init).toHaveBeenCalledWith('password');
  });
});