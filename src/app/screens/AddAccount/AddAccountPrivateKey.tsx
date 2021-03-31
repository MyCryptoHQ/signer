import React, { useEffect } from 'react';

import { fetchAccounts, getAccountError, useDispatch, useSelector } from '@app/store';
import {
  Body,
  Box,
  Button,
  Container,
  FormCheckbox,
  PanelBottom,
  WalletTypeSelector,
  Wrapper
} from '@components';
import { translateRaw } from '@translations';
import { WalletType } from '@types';

import { PrivateKeyForm, usePrivateKeyForm } from '../forms/PrivateKeyForm';

interface Props {
  setWalletType(walletType: WalletType): void;
}

export const AddAccountPrivateKey = ({ setWalletType }: Props) => {
  const form = usePrivateKeyForm();

  return <AddAccountPrivateKeyForm form={form} setWalletType={setWalletType} />;
};

const AddAccountPrivateKeyForm = ({
  form,
  setWalletType
}: { form: ReturnType<typeof usePrivateKeyForm> } & Props) => {
  const dispatch = useDispatch();
  const error: string = useSelector(getAccountError);

  useEffect(() => {
    if (form.errorMap['privateKey'] !== error) {
      form.setError('privateKey', error);
    }
  }, [error]);

  const handleSubmit = () => {
    dispatch(
      fetchAccounts([
        {
          walletType: WalletType.PRIVATE_KEY,
          privateKey: form.values.privateKey,
          persistent: form.values.persistent
        }
      ])
    );
  };

  return (
    <>
      <Wrapper>
        <Container>
          <WalletTypeSelector walletType={WalletType.PRIVATE_KEY} setWalletType={setWalletType} />
          <PrivateKeyForm form={form} onSubmit={handleSubmit} />
        </Container>
      </Wrapper>
      <PanelBottom pb="24px">
        <Button type="submit" form="private-key-form">
          {translateRaw('SUBMIT')}
        </Button>
        <Box pt="2" variant="rowAlign">
          <FormCheckbox name="persistent" form={form} data-testid="toggle-persistence" />
          <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
        </Box>
      </PanelBottom>
    </>
  );
};
