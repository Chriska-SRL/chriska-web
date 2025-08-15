'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState, useMemo } from 'react';
import { ClientFilters } from './ClientFilters';
import { ClientAdd } from './ClientAdd';
import { ClientList } from './ClientList';
import { Client } from '@/entities/client';
import { useGetClients } from '@/hooks/client';
import { useSearchParams, useRouter } from 'next/navigation';

type SearchParam = 'name' | 'rut' | 'razonSocial' | 'contactName';

export const Clients = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterName, setFilterName] = useState<string>('');
  const [searchParam, setSearchParam] = useState<SearchParam>('name');
  const [filterQualification, setFilterQualification] = useState<string>('');
  const [filterZoneId, setFilterZoneId] = useState<string>('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const filters = useMemo(() => {
    const result: {
      name?: string;
      rut?: string;
      razonSocial?: string;
      contactName?: string;
      qualification?: string;
      zoneId?: number;
    } = {};

    if (filterName) {
      switch (searchParam) {
        case 'name':
          result.name = filterName;
          break;
        case 'rut':
          result.rut = filterName;
          break;
        case 'razonSocial':
          result.razonSocial = filterName;
          break;
        case 'contactName':
          result.contactName = filterName;
          break;
      }
    }

    if (filterQualification) result.qualification = filterQualification;
    if (filterZoneId) result.zoneId = parseInt(filterZoneId);

    return Object.keys(result).length > 0 ? result : {};
  }, [filterName, searchParam, filterQualification, filterZoneId]);

  const { data, isLoading, error } = useGetClients(currentPage, pageSize, filters);
  const [clients, setClients] = useState<Client[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [clientToOpenModal, setClientToOpenModal] = useState<number | null>(null);

  const clientToOpen = searchParams.get('open');

  useEffect(() => {
    if (clientToOpen && clients.length > 0) {
      const client = clients.find((c) => c.id.toString() === clientToOpen);
      if (client) {
        setClientToOpenModal(client.id);
        router.replace('/clientes', { scroll: false });
      }
    }
  }, [clientToOpen, clients, router]);

  useEffect(() => {
    if (data) {
      setClients(data);
      setIsFilterLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
    if (filterName !== '' || filterQualification !== '' || filterZoneId !== '') {
      setIsFilterLoading(true);
    }
  }, [filterName, searchParam, filterQualification, filterZoneId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Clientes
        </Text>
        {isMobile && <ClientAdd isLoading={isLoading} setClients={setClients} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ClientFilters
          isLoading={isLoading || isFilterLoading}
          filterName={filterName}
          setFilterName={setFilterName}
          searchParam={searchParam}
          setSearchParam={setSearchParam}
          filterQualification={filterQualification}
          setFilterQualification={setFilterQualification}
          filterZoneId={filterZoneId}
          setFilterZoneId={setFilterZoneId}
        />

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <ClientAdd isLoading={isLoading} setClients={setClients} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <ClientList
        clients={clients}
        isLoading={isLoading}
        error={error}
        setClients={setClients}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        clientToOpenModal={clientToOpenModal}
        setClientToOpenModal={setClientToOpenModal}
      />
    </>
  );
};
