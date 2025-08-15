'use client';

import { Divider, Flex, IconButton, Text, useMediaQuery, Box, Skeleton } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetVehicleCosts } from '@/hooks/vehicleCost';
import { VehicleCost } from '@/entities/vehicleCost';
import { VehicleCostList } from './VehicleCostList';
import { VehicleCostAdd } from './VehicleCostAdd';
import { VehicleCostFilters } from './VehicleCostFilters';
import { MdArrowBackIosNew } from 'react-icons/md';
import { useGetVehicleById } from '@/hooks/vehicle';
import { Vehicle } from '@/entities/vehicle';

export const VehicleCosts = () => {
  const router = useRouter();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const { id } = useParams<{ id: string }>();
  const vehicleId = Number(id);

  const [costs, setCosts] = useState<VehicleCost[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filterType, setFilterType] = useState<string>('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const { data, isLoading, error } = useGetVehicleCosts(vehicleId, page, pageSize, {
    type: filterType,
    from,
    to,
  });

  const { data: vehicleData, isLoading: isLoadingVehicle } = useGetVehicleById(vehicleId);
  const [vehicle, setVehice] = useState<Vehicle>();

  useEffect(() => {
    if (data) {
      setCosts(data);
      setHasNextPage(data.length === pageSize);
      setIsFilterLoading(false);
    }
  }, [data, pageSize]);

  useEffect(() => {
    if (vehicleData) setVehice(vehicleData);
  }, [vehicleData]);

  useEffect(() => {
    setPage(1);
    setIsFilterLoading(true);
  }, [filterType, from, to]);

  return (
    <Flex direction="column" h="100%" gap="1rem">
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center" gap="0.5rem">
            <IconButton
              aria-label="Volver"
              icon={<MdArrowBackIosNew />}
              onClick={() => router.replace('/vehiculos')}
              variant="ghost"
              size="sm"
            />
            <Flex gap={{ base: '0', md: '0.5rem' }} alignItems={{ base: 'start', md: 'baseline' }}>
              {!isMobile && (
                <Text fontSize="1.5rem" fontWeight="bold">
                  Costos del vehiculo:&nbsp;
                </Text>
              )}
              {/* <Spinner size="md" ml="2rem" mt={{ base: '0.5rem', md: 0 }} /> */}
              <Skeleton w="7.5rem" h="2.25rem" isLoaded={!isLoadingVehicle}>
                <Text fontSize="1.5rem" fontWeight="bold">
                  {vehicle?.plate}
                </Text>{' '}
              </Skeleton>
            </Flex>
          </Flex>
          {isMobile && <VehicleCostAdd vehicleId={vehicleId} setCosts={setCosts} isLoading={isLoading} />}
        </Flex>
      </Box>

      <Box flexShrink="0">
        <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
          <VehicleCostFilters
            isLoading={isLoading || isFilterLoading}
            filterType={filterType}
            setFilterType={setFilterType}
            from={from}
            to={to}
            setFrom={setFrom}
            setTo={setTo}
          />
          {!isMobile && (
            <>
              <Divider orientation="vertical" />
              <VehicleCostAdd vehicleId={vehicleId} setCosts={setCosts} isLoading={isLoading} />
            </>
          )}
        </Flex>
      </Box>

      <VehicleCostList
        costs={isFilterLoading ? [] : costs}
        setCosts={setCosts}
        isLoading={isLoading || isFilterLoading}
        error={error}
        currentPage={page}
        pageSize={pageSize}
        hasNextPage={hasNextPage}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Flex>
  );
};
