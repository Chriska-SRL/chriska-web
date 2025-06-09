import { UserHydrator } from '@/components/UserHydrator';
import { ChakraProvider } from '@chakra-ui/react';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
// import { Geist, Geist_Mono } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: 'Chriska SRL',
  description: 'Panel de control de Chriska SRL',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <UserHydrator />
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
