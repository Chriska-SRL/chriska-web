'use client';

import { Divider, Flex, IconButton, Spinner, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
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

  const { data, isLoading, error } = useGetVehicleCosts(vehicleId);
  const [costs, setCosts] = useState<VehicleCost[]>([]);

  const { data: vehicleData, isLoading: isLoadingVehicle } = useGetVehicleById(vehicleId);
  const [vehicle, setVehice] = useState<Vehicle>();

  useEffect(() => {
    if (data) setCosts(data);
  }, [data]);

  useEffect(() => {
    if (vehicleData) setVehice(vehicleData);
  }, [vehicleData]);

  const [filterType, setFilterType] = useState<string | undefined>();
  const [filterDescription, setFilterDescription] = useState<string>('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const availableTypes = useMemo(() => [...new Set(costs.map((c) => c.type))], [costs]);

  const filteredCosts = useMemo(() => {
    const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    return costs.filter((c) => {
      const matchType = filterType ? normalize(c.type) === normalize(filterType) : true;
      const matchDesc = filterDescription
        ? normalize(c.description ?? '').includes(normalize(filterDescription))
        : true;
      const matchFrom = from ? new Date(c.date) >= new Date(from) : true;
      const matchTo = to ? new Date(c.date) <= new Date(to) : true;

      return matchType && matchDesc && matchFrom && matchTo;
    });
  }, [costs, filterType, filterDescription, from, to]);

  return (
    <>
      <Flex alignItems="center" gap="1rem">
        <IconButton
          aria-label="Volver"
          icon={<MdArrowBackIosNew />}
          onClick={() => router.replace('/vehiculos')}
          variant="ghost"
          size="sm"
        />
        <Flex gap="0.5rem" alignItems="baseline">
          <Text fontSize="1.5rem" fontWeight="bold">
            Costos del vehículo:
          </Text>
          {isLoadingVehicle ? (
            <Spinner size="sm" ml="2rem" />
          ) : (
            <Text fontSize="1.5rem" fontWeight="bold">
              {vehicle?.plate}
            </Text>
          )}
        </Flex>
      </Flex>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <VehicleCostFilters
          filterType={filterType}
          setFilterType={setFilterType}
          filterDescription={filterDescription}
          setFilterDescription={setFilterDescription}
          from={from}
          to={to}
          setFrom={setFrom}
          setTo={setTo}
          availableTypes={availableTypes}
        />
        {isMobile && <Divider />}
        <VehicleCostAdd vehicleId={vehicleId} setCosts={setCosts} />
      </Flex>
      <VehicleCostList costs={filteredCosts} setCosts={setCosts} isLoading={isLoading} error={error} />
    </>
  );
};
