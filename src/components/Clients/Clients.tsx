'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ClientFilters } from './ClientFilters';
import { ClientAdd } from './ClientAdd';
import { ClientList } from './ClientList';
import { Client } from '@/entities/client';
import { useGetClients } from '@/hooks/client';

type SearchParam = 'name' | 'razonSocial' | 'contactName';

export const Clients = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  // TODO: Cuando esté lista la API, este hook debería recibir los filtros como parámetros
  // const { data, isLoading, error } = useGetClients({
  //   search: filterName,
  //   searchParam,
  //   zoneId: filterZone
  // });
  const { data, isLoading, error } = useGetClients();
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    if (data) setClients(data);
  }, [data]);

  const [filterName, setFilterName] = useState<string>('');
  const [filterZone, setFilterZone] = useState<string>('');
  const [searchParam, setSearchParam] = useState<SearchParam>('name');

  // TODO: Cuando esté lista la API, remover este filtrado del lado del cliente
  // La API debería devolver los resultados ya filtrados
  const filteredClients = useMemo(() => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return clients.filter((client) => {
      // Filtro por búsqueda según el parámetro seleccionado
      let matchSearch = true;
      if (filterName) {
        const searchValue = normalize(filterName);
        switch (searchParam) {
          case 'name':
            matchSearch = normalize(client.name).includes(searchValue);
            break;
          case 'razonSocial':
            matchSearch = normalize(client.razonSocial || '').includes(searchValue);
            break;
          case 'contactName':
            matchSearch = normalize(client.contactName || '').includes(searchValue);
            break;
        }
      }

      // Filtro por zona
      const matchZone = filterZone ? client.zone.id.toString() === filterZone : true;

      return matchSearch && matchZone;
    });
  }, [clients, filterName, filterZone, searchParam]);

  // TODO: Cuando esté lista la API, agregar useEffect para hacer llamadas cuando cambien los filtros
  // useEffect(() => {
  //   // Debounce la búsqueda para evitar demasiadas llamadas a la API
  //   const timeoutId = setTimeout(() => {
  //     if (filterName || filterZone) {
  //       // Hacer nueva llamada a la API con los filtros
  //       refetch({ search: filterName, searchParam, zoneId: filterZone });
  //     }
  //   }, 500);
  //
  //   return () => clearTimeout(timeoutId);
  // }, [filterName, filterZone, searchParam]);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Clientes
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ClientFilters
          filterName={filterName}
          setFilterName={setFilterName}
          filterZone={filterZone}
          setFilterZone={setFilterZone}
          searchParam={searchParam}
          setSearchParam={setSearchParam}
        />
        {isMobile && <Divider />}
        <ClientAdd setClients={setClients} />
      </Flex>
      <ClientList clients={filteredClients} isLoading={isLoading} error={error} setClients={setClients} />
    </>
  );
};
