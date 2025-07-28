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
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Proveedores
        </Text>
        {isMobile && <SupplierAdd isLoading={isLoading} setSuppliers={setSuppliers} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <SupplierFilters isLoading={isLoading} filterName={filterName} setFilterName={setFilterName} />
        {!isMobile && <SupplierAdd isLoading={isLoading} setSuppliers={setSuppliers} />}
      </Flex>

      {isMobile && <Divider />}

      <SupplierList suppliers={filteredSuppliers} isLoading={isLoading} error={error} setSuppliers={setSuppliers} />
    </>
  );
};
