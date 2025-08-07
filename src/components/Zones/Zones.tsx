'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ZoneFilters } from './ZoneFilters';
import { ZoneAdd } from './ZoneAdd';
import { ZoneList } from './ZoneList';
import { Zone } from '@/entities/zone';
import { useGetZones } from '@/hooks/zone';
import { Day } from '@/enums/day.enum';
import { useSearchParams, useRouter } from 'next/navigation';

export const Zones = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterName, setFilterName] = useState<string>('');
  const [filterPedidoDay, setFilterPedidoDay] = useState<Day | ''>('');
  const [filterEntregaDay, setFilterEntregaDay] = useState<Day | ''>('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const { data, isLoading, error } = useGetZones(currentPage, pageSize, filterName, filterPedidoDay, filterEntregaDay);
  const [zones, setZones] = useState<Zone[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [zoneToOpenModal, setZoneToOpenModal] = useState<number | null>(null);

  const zoneToOpen = searchParams.get('open');

  useEffect(() => {
    if (zoneToOpen && zones.length > 0) {
      const zone = zones.find((z) => z.id.toString() === zoneToOpen);
      if (zone) {
        setZoneToOpenModal(zone.id);
        router.replace('/zonas', { scroll: false });
      }
    }
  }, [zoneToOpen, zones, router]);

  useEffect(() => {
    if (data) {
      setZones(data);
      setIsFilterLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
    if (filterName !== '' || filterPedidoDay || filterEntregaDay) {
      setIsFilterLoading(true);
    }
  }, [filterName, filterPedidoDay, filterEntregaDay]);

  // Server-side filtering is now handled by the API
  const filteredZones = zones;

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
          Zonas
        </Text>
        {isMobile && <ZoneAdd isLoading={isLoading} setZones={setZones} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ZoneFilters
          isLoading={isLoading}
          filterName={filterName}
          setFilterName={setFilterName}
          filterPedidoDay={filterPedidoDay}
          setFilterPedidoDay={setFilterPedidoDay}
          filterEntregaDay={filterEntregaDay}
          setFilterEntregaDay={setFilterEntregaDay}
        />
        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <ZoneAdd isLoading={isLoading} setZones={setZones} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <ZoneList
        zones={filteredZones}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setZones={setZones}
        zoneToOpenModal={zoneToOpenModal}
        setZoneToOpenModal={setZoneToOpenModal}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
