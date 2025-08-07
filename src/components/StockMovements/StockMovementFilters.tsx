'use client';

import { Flex, Select, useColorModeValue, IconButton, Spinner } from '@chakra-ui/react';
import { VscDebugRestart } from 'react-icons/vsc';
import { useGetWarehouses } from '@/hooks/warehouse';
import { useEffect, useState, useMemo } from 'react';

type StockMovementFilters = {
  warehouseId?: number;
  shelveId?: number;
};

type StockMovementFiltersProps = {
  filters: StockMovementFilters;
  onFiltersChange: (filters: StockMovementFilters) => void;
  isLoading: boolean;
};

export const StockMovementFilters = ({
  filters,
  onFiltersChange,
  isLoading,
}: StockMovementFiltersProps) => {
  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');

  const { data: warehouses } = useGetWarehouses(1, 100);
  const [shelves, setShelves] = useState<{ id: number; name: string }[]>([]);

  const selectedWarehouse = useMemo(() => {
    return warehouses?.items?.find((w) => w.id === filters.warehouseId);
  }, [warehouses, filters.warehouseId]);

  useEffect(() => {
    if (selectedWarehouse) {
      setShelves(selectedWarehouse.shelves || []);
    } else {
      setShelves([]);
    }
  }, [selectedWarehouse]);

  const handleResetLocationFilters = () => {
    onFiltersChange({
      ...filters,
      warehouseId: undefined,
      shelveId: undefined,
    });
  };


  const hasActiveLocationFilters = filters.warehouseId || filters.shelveId;

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} w="100%" alignItems="center" flexWrap="wrap">

      <Select
        placeholder="Filtrar por depósito"
        value={filters.warehouseId || ''}
        onChange={(e) => {
          const warehouseId = e.target.value ? Number(e.target.value) : undefined;
          onFiltersChange({
            ...filters,
            warehouseId,
            shelveId: undefined,
          });
        }}
        bg={bgInput}
        borderColor={borderInput}
        color={textColor}
        w={{ base: '100%', md: 'auto' }}
        disabled={isLoading}
      >
        {warehouses?.items?.map((wh) => (
          <option key={wh.id} value={wh.id}>
            {wh.name}
          </option>
        ))}
      </Select>

      <Select
        placeholder="Filtrar por estantería"
        value={filters.shelveId || ''}
        onChange={(e) => {
          const shelveId = e.target.value ? Number(e.target.value) : undefined;
          onFiltersChange({ ...filters, shelveId });
        }}
        bg={bgInput}
        borderColor={borderInput}
        color={textColor}
        w={{ base: '100%', md: 'auto' }}
        isDisabled={!filters.warehouseId || isLoading}
      >
        {shelves.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </Select>

      {hasActiveLocationFilters && (
        <IconButton
          aria-label="Reiniciar filtros de ubicación"
          icon={<VscDebugRestart />}
          bg={bgInput}
          _hover={{ bg: hoverResetBg }}
          onClick={handleResetLocationFilters}
          flexShrink={0}
          disabled={isLoading}
        />
      )}
      
      {isLoading && <Spinner size="sm" />}
    </Flex>
  );
};
