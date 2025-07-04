'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { VehicleList } from './VehicleList';
import { VehicleAdd } from './VehicleAdd';
import { VehicleFilters } from './VehicleFilters';
import { Vehicle } from '@/entities/vehicle';
import { useGetVehicles } from '@/hooks/vehicle';

export const Vehicles = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const { data, isLoading, error } = useGetVehicles();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    if (data) setVehicles(data);
  }, [data]);

  const [filterPlate, setFilterPlate] = useState<string>('');

  const availableBrands = useMemo(() => [...new Set(vehicles.map((v) => v.brand))], [vehicles]);
  const availableModels = useMemo(() => [...new Set(vehicles.map((v) => v.model))], [vehicles]);

  const filteredVehicles = useMemo(() => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return vehicles.filter((v) => {
      const matchPlate = filterPlate ? normalize(v.plate).includes(normalize(filterPlate)) : true;
      return matchPlate;
    });
  }, [vehicles, filterPlate]);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Vehículos
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <VehicleFilters
          filterPlate={filterPlate}
          setFilterPlate={setFilterPlate}
          availableBrands={availableBrands}
          availableModels={availableModels}
        />
        {isMobile && <Divider />}
        <VehicleAdd setVehicles={setVehicles} />
      </Flex>
      <VehicleList vehicles={filteredVehicles} isLoading={isLoading} error={error} setVehicles={setVehicles} />
    </>
  );
};
