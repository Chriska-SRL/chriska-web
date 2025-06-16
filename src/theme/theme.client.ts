'use client';

import { extendTheme, StyleFunctionProps } from '@chakra-ui/react';
import { chakraConfig } from './chakraConfig';

const theme = extendTheme({
  chakraConfig,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
      },
    }),
  },
  colors: {
    brand: {
      50: '#eef2ff',
      500: '#4C88D8',
      700: '#376bb0',
    },
  },
});

export default theme;
