'use client';

import { NextPage } from 'next';
import { Login } from '@/components';
import { ClientOnly } from '@/components/ClientOnly';

const LoginPage: NextPage = () => {
  return (
    <ClientOnly>
      <Login />
    </ClientOnly>
  );
};

export default LoginPage;
