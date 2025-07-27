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

  const { data, isLoading, error } = useGetZones();
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
    if (data) setZones(data);
  }, [data]);

  const [filterName, setFilterName] = useState<string>('');
  const [filterPedidoDay, setFilterPedidoDay] = useState<Day | ''>('');
  const [filterEntregaDay, setFilterEntregaDay] = useState<Day | ''>('');

  const filteredZones = useMemo(() => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return zones.filter((zone) => {
      const matchName = filterName ? normalize(zone.name).includes(normalize(filterName)) : true;

      const matchDiaPedido = filterPedidoDay
        ? Array.isArray(zone.requestDays) && zone.requestDays.includes(filterPedidoDay)
        : true;

      const matchDiaEntrega = filterEntregaDay
        ? Array.isArray(zone.deliveryDays) && zone.deliveryDays.includes(filterEntregaDay)
        : true;

      return matchName && matchDiaPedido && matchDiaEntrega;
    });
  }, [zones, filterName, filterPedidoDay, filterEntregaDay]);

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Zonas
        </Text>
        {isMobile && <ZoneAdd setZones={setZones} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ZoneFilters
          isLoadingZones={isLoading}
          filterName={filterName}
          setFilterName={setFilterName}
          filterPedidoDay={filterPedidoDay}
          setFilterPedidoDay={setFilterPedidoDay}
          filterEntregaDay={filterEntregaDay}
          setFilterEntregaDay={setFilterEntregaDay}
        />
        {!isMobile && <ZoneAdd setZones={setZones} />}
      </Flex>

      {isMobile && <Divider />}

      <ZoneList
        zones={filteredZones}
        isLoading={isLoading}
        error={error}
        setZones={setZones}
        zoneToOpenModal={zoneToOpenModal}
        setZoneToOpenModal={setZoneToOpenModal}
      />
    </>
  );
};
