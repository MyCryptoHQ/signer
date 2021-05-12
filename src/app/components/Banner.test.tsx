import { fireEvent, render } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { ThemeProvider } from 'styled-components';

import { Banner } from '@components/Banner';
import { theme } from '@theme';

const getComponent = (props: ComponentProps<typeof Banner>) => {
  return render(
    <ThemeProvider theme={theme}>
      <Banner {...props} />
    </ThemeProvider>
  );
};

describe('Banner', () => {
  it('renders the label', () => {
    const { getByText } = getComponent({ type: 'info', label: 'Foo bar' });
    expect(() => getByText('Foo bar')).not.toThrow();
  });

  it('renders the children when extended', () => {
    const { getByText, getByTestId } = getComponent({
      type: 'info',
      label: 'Foo bar',
      children: 'Baz qux'
    });
    expect(() => getByText('Baz qux')).toThrow();

    const toggle = getByTestId('banner-toggle');
    fireEvent.click(toggle);

    expect(() => getByText('Baz qux')).not.toThrow();
  });

  it('renders the children when extended by default', () => {
    const { getByText } = getComponent({
      type: 'info',
      label: 'Foo bar',
      children: 'Baz qux',
      extended: true
    });
    expect(() => getByText('Baz qux')).not.toThrow();
  });

  it('renders an inner banner', () => {
    const { getByText } = getComponent({ type: 'info', label: 'Foo bar', banner: 'Baz qux' });
    expect(() => getByText('Baz qux')).not.toThrow();
  });
});
