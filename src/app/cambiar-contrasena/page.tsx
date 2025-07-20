'use client';

import { NextPage } from 'next';
import { ClientOnly, PasswordReset } from '@/components';

const LoginPage: NextPage = () => {
  return (
    <ClientOnly>
      <PasswordReset />
    </ClientOnly>
  );
};

export default LoginPage;
