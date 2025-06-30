'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ClientFilters } from './ClientFilters';
import { ClientAdd } from './ClientAdd';
import { ClientList } from './ClientList';
import { Client } from '@/entities/client';
import { useGetClients } from '@/hooks/client';

export const Clients = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const { data, isLoading, error } = useGetClients();
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (data) setClients(data);
  }, [data]);

  const [filterName, setFilterName] = useState<string>('');

  const filteredClients = useMemo(() => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return clients.filter((client) => {
      const matchName = filterName ? normalize(client.name).includes(normalize(filterName)) : true;
      return matchName;
    });
  }, [clients, filterName]);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Clientes
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ClientFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <ClientAdd setClients={setClients} />
      </Flex>
      <ClientList clients={filteredClients} isLoading={isLoading} error={error} setClients={setClients} />
    </>
  );
};
