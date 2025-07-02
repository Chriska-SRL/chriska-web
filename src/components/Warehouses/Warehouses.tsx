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
      <Text fontSize="1.5rem" fontWeight="bold">
        Depósitos y estanterías
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="flex-end" gap="1rem" w="100%">
        <WarehouseFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <WarehouseAdd setWarehouses={setWarehouses} />
      </Flex>
      <WarehouseList
        warehouses={filteredWarehouses}
        isLoading={isLoading}
        error={error}
        setWarehouses={setWarehouses}
      />
    </>
  );
};
