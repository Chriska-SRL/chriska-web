'use client';

import { NextPage } from 'next';
import { Login, ClientOnly } from '@/components';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    const user = useUserStore.getState().user;

    if (isLoggedIn && user?.needsPasswordChange) {
      // Si necesita cambiar contraseña, ir ahí primero
      router.push('/cambiar-contrasena');
    } else if (isLoggedIn) {
      // Si ya está logueado, ir al home (sin redirect params)
      router.push('/');
    }
  }, [isLoggedIn, isHydrated, router]);

  // Si ya está logueado y hidratado, no mostrar el login
  if (isHydrated && isLoggedIn) {
    return null;
  }

  return (
    <ClientOnly>
      <Login />
    </ClientOnly>
  );
};

export default LoginPage;
