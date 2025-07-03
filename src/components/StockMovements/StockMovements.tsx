'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { StockMovementList } from './StockMovementList';
import { StockMovement } from '@/entities/stockMovement';
import {
  useGetStockMovements,
  useGetStockMovementsByShelveId,
  useGetStockMovementsByWarehouseId,
} from '@/hooks/stockMovement';
import { subDays, formatISO } from 'date-fns';
import { StockMovementAdd } from './StockMovementAdd';
import { StockMovementFilters } from './StockMovementFilters';

export const StockMovements = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const today = formatISO(new Date(), { representation: 'date' });
  const weekAgo = formatISO(subDays(new Date(), 7), { representation: 'date' });

  const [filterWarehouseId, setFilterWarehouseId] = useState('');
  const [filterShelveId, setFilterShelveId] = useState('');
  const [filterFrom, setFilterFrom] = useState(weekAgo);
  const [filterTo, setFilterTo] = useState(today);

  const warehouseId = filterWarehouseId ? parseInt(filterWarehouseId) : -1;
  const shelveId = filterShelveId ? parseInt(filterShelveId) : -1;

  // Call hooks with primitive values - no object recreation!
  const allMovements = useGetStockMovements(filterFrom, filterTo);
  const warehouseMovements = useGetStockMovementsByWarehouseId(warehouseId, filterFrom, filterTo);
  const shelveMovements = useGetStockMovementsByShelveId(shelveId, filterFrom, filterTo);

  // Select which data to use based on active filters
  const activeResult = (() => {
    if (filterShelveId) {
      return shelveMovements;
    } else if (filterWarehouseId) {
      return warehouseMovements;
    } else {
      return allMovements;
    }
  })();

  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  useEffect(() => {
    if (activeResult.data) {
      setStockMovements(activeResult.data);
    }
  }, [activeResult.data]);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Movimientos de stock
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <StockMovementFilters
          filterWarehouseId={filterWarehouseId}
          setFilterWarehouseId={setFilterWarehouseId}
          filterShelveId={filterShelveId}
          setFilterShelveId={setFilterShelveId}
          filterFrom={filterFrom}
          setFilterFrom={setFilterFrom}
          filterTo={filterTo}
          setFilterTo={setFilterTo}
        />
        {isMobile && <Divider />}
        <StockMovementAdd setStockMovements={setStockMovements} />
      </Flex>
      <StockMovementList
        stockMovements={stockMovements}
        isLoading={activeResult.isLoading}
        error={activeResult.error}
        setStockMovements={setStockMovements}
      />
    </>
  );
};
