import { Body, Box, Flex, Image } from '@mycrypto/ui';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { useTheme } from 'styled-components';

import info from '@assets/icons/alert-grey.svg';
import error from '@assets/icons/alert-red.svg';
import caret from '@assets/icons/caret.svg';
import success from '@assets/icons/circle-checkmark.svg';
import warning from '@assets/icons/circle-warning.svg';
import action from '@assets/icons/queue-waiting.svg';
import type { theme } from '@theme';

type BannerType = keyof typeof theme.variants.banner;

interface BannerProps {
  type: BannerType;
  label: string;
  banner?: string;
  extended?: boolean;
}

const icons: { [key in BannerType]: string } = {
  success,
  info,
  action,
  warning,
  error
};

export const InnerBanner = ({ type, children }: PropsWithChildren<Pick<BannerProps, 'type'>>) => {
  const theme = useTheme();

  return (
    <Box backgroundColor={theme.variants.banner[type].color} sx={{ borderRadius: 'banner' }}>
      <Body
        fontSize="12px"
        fontWeight="bold"
        color="white"
        sx={{ textTransform: 'uppercase' }}
        px="6px"
      >
        {children}
      </Body>
    </Box>
  );
};

export const Banner = ({
  type,
  label,
  banner,
  extended,
  children
}: PropsWithChildren<BannerProps>) => {
  const [isExtended, setExtended] = useState(extended);

  const handleToggle = () => setExtended((value) => !value);

  return (
    <Box mb="2" variant={`banner.${type}`} sx={{ borderRadius: 'banner' }}>
      <Flex
        variant="horizontal-start"
        p="2"
        justifyContent="space-between"
        onClick={children && handleToggle}
        sx={{ cursor: children && 'pointer' }}
        data-testid="banner-toggle"
      >
        <Flex variant="horizontal-start">
          <Image src={icons[type]} alt="type" width="20px" minWidth="20px" height="20px" mr="2" />
          <Body
            color="inherit"
            fontSize="12px"
            fontWeight="bold"
            sx={{ textTransform: 'uppercase', wordBreak: 'break-word' }}
          >
            {label}
          </Body>
        </Flex>
        <Flex variant="horizontal-start" minWidth="10px">
          {banner && <InnerBanner type={type}>{banner}</InnerBanner>}
          {children && (
            <Image
              src={caret}
              alt="Caret"
              ml="2"
              width="10px"
              minWidth="10px"
              sx={{ userSelect: 'none', transform: isExtended && 'rotate(180deg)' }}
            />
          )}
        </Flex>
      </Flex>
      {children && isExtended && (
        <Body fontSize="14px" p="2" pt="0">
          {children}
        </Body>
      )}
    </Box>
  );
};
