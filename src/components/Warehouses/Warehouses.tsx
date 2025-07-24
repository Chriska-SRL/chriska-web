'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { WarehouseList } from './WarehouseList';
import { WarehouseAdd } from './WarehouseAdd';
import { WarehouseFilters } from './WarehouseFilters';
import { Warehouse } from '@/entities/warehouse';
import { useGetWarehouses } from '@/hooks/warehouse';

export const Warehouses = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const { data, isLoading, error } = useGetWarehouses();
  const [categories, setWarehouses] = useState<Warehouse[]>([]);

  useEffect(() => {
    if (data) setWarehouses(data);
  }, [data]);

  const [filterName, setFilterName] = useState<string>('');

  const filteredWarehouses = useMemo(() => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return categories.filter((warehouse) => {
      const warehouseMatch = filterName ? normalize(warehouse.name).includes(normalize(filterName)) : true;

      const shelveMatch = warehouse.shelves?.some((shelve) => normalize(shelve.name).includes(normalize(filterName)));

      return warehouseMatch || shelveMatch;
    });
  }, [categories, filterName]);

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Depósitos y estanterías
        </Text>
        {isMobile && <WarehouseAdd setWarehouses={setWarehouses} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <WarehouseFilters filterName={filterName} setFilterName={setFilterName} />
        {!isMobile && <WarehouseAdd setWarehouses={setWarehouses} />}
      </Flex>

      {isMobile && <Divider />}

      <WarehouseList
        warehouses={filteredWarehouses}
        isLoading={isLoading}
        error={error}
        setWarehouses={setWarehouses}
      />
    </>
  );
};
