'use client';

import { NextPage } from 'next';
import { ClientOnly } from '@/components/ClientOnly';
import { PasswordReset } from '@/components/PasswordReset';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);

  useEffect(() => {
    if (isHydrated && isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, isHydrated, router]);

  return (
    <ClientOnly>
      <PasswordReset />
    </ClientOnly>
  );
};

export default LoginPage;
