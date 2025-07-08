'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ZoneFilters } from './ZoneFilters';
import { ZoneAdd } from './ZoneAdd';
import { ZoneList } from './ZoneList';
import { Zone } from '@/entities/zone';
import { useGetZones } from '@/hooks/zone';
import { useUserStore } from '@/stores/useUserStore';
import { PermissionId } from '@/entities/permissions/permissionId';

export const Zones = () => {
  const canViewZones = useUserStore((s) => s.hasPermission(PermissionId.VIEW_ZONES));

  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const { data, isLoading, error } = useGetZones();
  const [zones, setZones] = useState<Zone[]>([]);

  useEffect(() => {
    if (data) setZones(data);
  }, [data]);

  const [filterName, setFilterName] = useState<string>('');

  const filteredZones = useMemo(() => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return zones.filter((zone) => {
      const matchName = filterName ? normalize(zone.name).includes(normalize(filterName)) : true;
      return matchName;
    });
  }, [zones, filterName]);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Zonas
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ZoneFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <ZoneAdd setZones={setZones} />
      </Flex>
      <ZoneList zones={filteredZones} isLoading={isLoading} error={error} setZones={setZones} />
    </>
  );
};
