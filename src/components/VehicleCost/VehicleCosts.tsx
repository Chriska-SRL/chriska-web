// VehicleCosts.tsx
'use client';

import { Divider, Flex, IconButton, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetVehicleCosts } from '@/hooks/vehicleCost';
import { VehicleCost } from '@/entities/vehicleCost';
import { VehicleCostList } from './VehicleCostsList';
import { VehicleCostAdd } from './VehicleCostsAdd';
import { VehicleCostFilters } from './VehicleCostsFilters';
import { MdArrowBackIosNew } from 'react-icons/md';

export const VehicleCosts = () => {
  const router = useRouter();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const { id } = useParams<{ id: string }>();
  const vehicleId = Number(id);

  const { data, isLoading, error } = useGetVehicleCosts(vehicleId);
  const [costs, setCosts] = useState<VehicleCost[]>([]);

  useEffect(() => {
    if (data) setCosts(data);
  }, [data]);

  const [filterType, setFilterType] = useState<string | undefined>();
  const [filterDescription, setFilterDescription] = useState<string>('');

  const availableTypes = useMemo(() => [...new Set(costs.map((c) => c.costType))], [costs]);

  const filteredCosts = useMemo(() => {
    const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    return costs.filter((c) => {
      const matchType = filterType ? normalize(c.costType) === normalize(filterType) : true;
      const matchDesc = filterDescription
        ? normalize(c.description ?? '').includes(normalize(filterDescription))
        : true;
      return matchType && matchDesc;
    });
  }, [costs, filterType, filterDescription]);

  return (
    <>
      <Flex alignItems="center" gap="1rem">
        <IconButton
          aria-label="Volver"
          icon={<MdArrowBackIosNew />}
          onClick={() => router.replace('/vehiculos')}
          variant="ghost"
          size="sm"
        />
        <Text fontSize="1.5rem" fontWeight="bold">
          Costos del Vehículo #{vehicleId}
        </Text>
      </Flex>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <VehicleCostFilters
          filterType={filterType}
          setFilterType={setFilterType}
          filterDescription={filterDescription}
          setFilterDescription={setFilterDescription}
          availableTypes={availableTypes}
        />
        {isMobile && <Divider />}
        <VehicleCostAdd vehicleId={vehicleId} setCosts={setCosts} />
      </Flex>
      <VehicleCostList costs={filteredCosts} setCosts={setCosts} isLoading={isLoading} error={error} />
    </>
  );
};
