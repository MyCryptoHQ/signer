import React, { FormEvent, ReactNode } from 'react';

import { useForm, yupValidator } from 'typed-react-form';
import { mixed, object, string } from 'yup';

import { Body, Box, FileBox, FormError, FormInput, Image } from '@app/components';
import warning from '@assets/icons/circle-warning.svg';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { translate, translateRaw } from '@translations';

const ADD_KEYSTORE_SCHEMA = object({
  keystore: mixed().test('Not empty', translateRaw('KEYSTORE_EMPTY'), (value) => value),
  password: string().required(translateRaw('PASSWORD_EMPTY'))
});

export const useKeystoreForm = () =>
  useForm(
    {
      keystore: undefined as File | undefined,
      password: '',
      persistent: true
    },
    yupValidator(ADD_KEYSTORE_SCHEMA),
    true
  );

export const KeystoreForm = ({
  onSubmit,
  form,
  children
}: {
  onSubmit(): void;
  form: ReturnType<typeof useKeystoreForm>;
  children: ReactNode;
}) => {
  const changeKeystore = (f: File) => form.setValue('keystore', f);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await form.validate();
    if (form.error) {
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box mb="150px">
        <FileBox my="2" onChange={changeKeystore} />
        <FormError name="keystore" form={form} />
        <Box mt="2">
          <label>
            {translateRaw('KEYSTORE_PASSWORD')}
            <FormInput
              name="password"
              id="password"
              form={form}
              type="text"
              placeholder={translateRaw('KEYSTORE_PASSWORD_PLACEHOLDER')}
              mt="2"
            />
            <FormError name="password" form={form} />
          </label>
        </Box>
        <Box mt="2" variant="rowAlign">
          <Image src={warning} width="20px" height="20px" minWidth="20px" alt="Warning" mr="2" />
          <Body>
            {translate('SECRET_WARNING', {
              $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP)
            })}
          </Body>
        </Box>
      </Box>
      {children}
    </form>
  );
};