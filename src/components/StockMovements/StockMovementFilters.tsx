'use client';

import { Flex, Select, Input, useColorModeValue, IconButton } from '@chakra-ui/react';
import { VscDebugRestart } from 'react-icons/vsc';
import { useGetWarehouses } from '@/hooks/warehouse';
import { useEffect, useState } from 'react';

type StockMovementFiltersProps = {
  filterWarehouseId: string;
  setFilterWarehouseId: (value: string) => void;
  filterShelveId: string;
  setFilterShelveId: (value: string) => void;
  filterFrom: string;
  setFilterFrom: (value: string) => void;
  filterTo: string;
  setFilterTo: (value: string) => void;
};

export const StockMovementFilters = ({
  filterWarehouseId,
  setFilterWarehouseId,
  filterShelveId,
  setFilterShelveId,
  filterFrom,
  setFilterFrom,
  filterTo,
  setFilterTo,
}: StockMovementFiltersProps) => {
  const bgInput = useColorModeValue('#f2f2f2', 'gray.700');
  const borderInput = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverResetBg = useColorModeValue('#e0dede', 'gray.600');

  const { data: warehouses } = useGetWarehouses();
  const [shelves, setShelves] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (filterWarehouseId && warehouses) {
      const wh = warehouses.find((w) => w.id === parseInt(filterWarehouseId));
      if (wh) {
        setShelves(wh.shelves);
      }
    } else {
      setShelves([]);
    }
  }, [filterWarehouseId, warehouses]);

  const handleResetLocationFilters = () => {
    setFilterWarehouseId('');
    setFilterShelveId('');
  };

  const hasActiveLocationFilters = filterWarehouseId !== '' || filterShelveId !== '';

  return (
    <Flex gap="1rem" flexDir={{ base: 'column', md: 'row' }} w="100%" alignItems="center" flexWrap="wrap">
      <Input
        placeholder="Desde"
        type="date"
        value={filterFrom}
        onChange={(e) => setFilterFrom(e.target.value)}
        bg={bgInput}
        borderColor={borderInput}
        color={textColor}
        w={{ base: '100%', md: 'auto' }}
      />

      <Input
        placeholder="Hasta"
        type="date"
        value={filterTo}
        onChange={(e) => setFilterTo(e.target.value)}
        bg={bgInput}
        borderColor={borderInput}
        color={textColor}
        w={{ base: '100%', md: 'auto' }}
      />

      <Select
        placeholder="Filtrar por almacén"
        value={filterWarehouseId}
        onChange={(e) => {
          setFilterWarehouseId(e.target.value);
          setFilterShelveId('');
        }}
        bg={bgInput}
        borderColor={borderInput}
        color={textColor}
        w={{ base: '100%', md: 'auto' }}
      >
        {warehouses?.map((wh) => (
          <option key={wh.id} value={wh.id}>
            {wh.name}
          </option>
        ))}
      </Select>

      <Select
        placeholder="Filtrar por estantería"
        value={filterShelveId}
        onChange={(e) => setFilterShelveId(e.target.value)}
        bg={bgInput}
        borderColor={borderInput}
        color={textColor}
        w={{ base: '100%', md: 'auto' }}
        isDisabled={!filterWarehouseId}
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
        />
      )}
    </Flex>
  );
};
