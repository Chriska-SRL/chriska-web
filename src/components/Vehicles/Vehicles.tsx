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
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Vehículos
        </Text>
        {isMobile && <VehicleAdd isLoading={isLoading} setVehicles={setVehicles} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <VehicleFilters
          isLoading={isLoading}
          filterPlate={filterPlate}
          setFilterPlate={setFilterPlate}
          availableBrands={availableBrands}
          availableModels={availableModels}
        />
        {!isMobile && <VehicleAdd isLoading={isLoading} setVehicles={setVehicles} />}
      </Flex>

      {isMobile && <Divider />}

      <VehicleList vehicles={filteredVehicles} isLoading={isLoading} error={error} setVehicles={setVehicles} />
    </>
  );
};
