'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly } from '@/components';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Permission } from '@/enums/permission.enum';
import { ClientAccountStatements } from '@/components/ClientAccountStatements/ClientAccountStatements';
import { SupplierAccountStatements } from '@/components/SupplierAccountStatements/SupplierAccountStatements';
import { useGetClientById } from '@/hooks/client';
import { useGetSupplierById } from '@/hooks/supplier';

function EstadosDeCuentaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientId = searchParams.get('clientId');
  const supplierId = searchParams.get('supplierId');

  const {
    data: client,
    isLoading: clientLoading,
    error: clientError,
  } = useGetClientById(clientId ? parseInt(clientId) : undefined);
  const {
    data: supplier,
    isLoading: supplierLoading,
    error: supplierError,
  } = useGetSupplierById(supplierId ? parseInt(supplierId) : undefined);

  useEffect(() => {
    if (!clientId && !supplierId) {
      router.push('/clientes');
    }
  }, [clientId, supplierId, router]);

  if (!clientId && !supplierId) {
    return null;
  }

  const isLoading = clientLoading || supplierLoading;
  const error = clientError || supplierError;

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" h="100%" direction="column">
        <Text color="red.500" fontSize="lg" mb="1rem">
          Error al cargar {clientId ? 'el cliente' : 'el proveedor'}
        </Text>
        <Text color="gray.500">{error}</Text>
      </Flex>
    );
  }

  if (clientId && !client) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Text color="gray.500" fontSize="lg">
          Cliente no encontrado
        </Text>
      </Flex>
    );
  }

  if (supplierId && !supplier) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Text color="gray.500" fontSize="lg">
          Proveedor no encontrado
        </Text>
      </Flex>
    );
  }

  if (clientId && client) {
    return <ClientAccountStatements clientId={parseInt(clientId)} clientName={client.name} />;
  }

  if (supplierId && supplier) {
    return <SupplierAccountStatements supplierId={parseInt(supplierId)} supplierName={supplier.name} />;
  }

  return null;
}

const EstadosDeCuentaPage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewClients = useUserStore((s) => s.hasPermission(Permission.VIEW_CLIENTS));
  const canViewSuppliers = useUserStore((s) => s.hasPermission(Permission.VIEW_SUPPLIERS));

  useEffect(() => {
    if (isHydrated && !canViewClients && !canViewSuppliers) {
      router.push('/');
    }
  }, [isHydrated, canViewClients, canViewSuppliers, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage={canViewClients && canViewSuppliers ? '' : canViewClients ? 'clientes' : 'proveedores'} />
        <Content>
          <Suspense
            fallback={
              <Flex justify="center" align="center" h="100%">
                <Spinner size="xl" />
              </Flex>
            }
          >
            <EstadosDeCuentaContent />
          </Suspense>
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default EstadosDeCuentaPage;
