'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { SupplierFilters } from './SupplierFilters';
import { SupplierAdd } from './SupplierAdd';
import { SupplierList } from './SupplierList';
import { Supplier } from '@/entities/supplier';
import { useGetSuppliers } from '@/hooks/supplier';

export const Suppliers = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const { data, isLoading, error } = useGetSuppliers();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    if (data) setSuppliers(data);
  }, [data]);

  const [filterName, setFilterName] = useState<string>('');

  const filteredSuppliers = useMemo(() => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return suppliers.filter((supplier) => {
      const matchName = filterName ? normalize(supplier.name).includes(normalize(filterName)) : true;
      return matchName;
    });
  }, [suppliers, filterName]);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Proveedores
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <SupplierFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <SupplierAdd setSuppliers={setSuppliers} />
      </Flex>
      <SupplierList suppliers={filteredSuppliers} isLoading={isLoading} error={error} setSuppliers={setSuppliers} />
    </>
  );
};
