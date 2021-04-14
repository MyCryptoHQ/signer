import React from 'react';

import { Blockie, Body, Box, Checkbox } from '@app/components';
import { GetAddressesResult } from '@types';

import { Divider } from './Divider';

export const MnemonicAddressList = ({
  addresses,
  selectedAccounts,
  toggleSelectedAccount
}: {
  addresses: GetAddressesResult[];
  selectedAccounts: number[];
  toggleSelectedAccount(account: GetAddressesResult): void;
}) => (
  <>
    {addresses.map((address) => {
      const toggle = () => toggleSelectedAccount(address);
      return (
        <React.Fragment key={address.dPath}>
          <Box variant="rowAlign" py="3" onClick={toggle}>
            <Checkbox
              mr="3"
              checked={selectedAccounts.find((index) => index === address.index) !== undefined}
              data-testid={`checkbox-${address.address}`}
            />
            <Body mr="3">{address.index + 1}</Body>
            <Blockie mr="3" width="30px" height="30px" address={address.address} />
            <Body maxWidth="70%" sx={{ overflowWrap: 'anywhere' }}>
              {address.address}
            </Body>
          </Box>
          <Divider />
        </React.Fragment>
      );
    })}
  </>
);
