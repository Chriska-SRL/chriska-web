'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { VehicleList } from './VehicleList';
import { VehicleAdd } from './VehicleAdd';
import { VehicleFilters } from './VehicleFilters';
import { Vehicle } from '@/entities/vehicle';
import { useGetVehicles } from '@/hooks/vehicle';

export const Vehicles = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filterPlate, setFilterPlate] = useState<string>('');
  const [filterBrand, setFilterBrand] = useState<string>('');
  const [filterModel, setFilterModel] = useState<string>('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const { data, isLoading, error } = useGetVehicles(page, pageSize, {
    plate: filterPlate,
    brand: filterBrand,
    model: filterModel,
  });

  useEffect(() => {
    if (data) {
      setVehicles(data);
      setHasNextPage(data.length === pageSize);
      setIsFilterLoading(false);
    }
  }, [data, pageSize]);

  useEffect(() => {
    setPage(1);
    setIsFilterLoading(true);
  }, [filterPlate, filterBrand, filterModel]);

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
          filterBrand={filterBrand}
          setFilterBrand={setFilterBrand}
          filterModel={filterModel}
          setFilterModel={setFilterModel}
        />
        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <VehicleAdd isLoading={isLoading} setVehicles={setVehicles} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <VehicleList
        vehicles={isFilterLoading ? [] : vehicles}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setVehicles={setVehicles}
        currentPage={page}
        pageSize={pageSize}
        hasNextPage={hasNextPage}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </>
  );
};
