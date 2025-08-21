'use client';

import { extendTheme, StyleFunctionProps } from '@chakra-ui/react';
import { chakraConfig } from './chakraConfig';

const theme = extendTheme({
  chakraConfig,
  fonts: {
    heading: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    body: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
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
  semanticTokens: {
    colors: {
      textColor: {
        default: 'gray.600',
        _dark: 'gray.300',
      },
      iconColor: {
        default: 'gray.500',
        _dark: 'gray.300',
      },
      bgButton: {
        default: 'gray.100',
        _dark: 'gray.700',
      },
      bgHover: {
        default: 'gray.200',
        _dark: 'gray.600',
      },
      buttonHover: {
        default: '#e0dede',
        _dark: 'gray.600',
      },
      borderBox: {
        default: '#f2f2f2',
        _dark: 'gray.600',
      },
      inputBg: {
        default: '#f2f2f2',
        _dark: 'gray.700',
      },
      borderColor: {
        default: 'gray.200',
        _dark: 'gray.700',
      },
      outerBg: {
        default: 'gray.100',
        _dark: 'gray.800',
      },
      innerBg: {
        default: 'white',
        _dark: 'gray.900',
      },
      activeBg: {
        default: 'gray.100',
        _dark: 'gray.700',
      },
      hoverBg: {
        default: 'gray.200',
        _dark: 'gray.600',
      },
      activeColor: {
        default: 'black',
        _dark: 'white',
      },
      defaultColor: {
        default: 'gray.600',
        _dark: 'gray.300',
      },
      hoverColor: {
        default: 'black',
        _dark: 'white',
      },
      textPrimary: {
        default: 'black',
        _dark: 'white',
      },
    },
  },
});

export default theme;
