import { ChakraProviders } from '@/components';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ColorModeScript } from '@chakra-ui/react';
import { chakraConfig } from '@/theme/chakraConfig';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Chriska SRL',
  description: 'Panel de control de Chriska SRL',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ColorModeScript initialColorMode={chakraConfig.initialColorMode} />
      </head>
      <body className={`${inter.className} ${inter.variable}`}>
        <ChakraProviders>{children}</ChakraProviders>
      </body>
    </html>
  );
}
