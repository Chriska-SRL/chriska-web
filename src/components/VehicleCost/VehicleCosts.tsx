'use client';

import { Box, Text, Spinner, Flex, Heading, Button, useDisclosure, useToast } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { VehicleCost } from '@/entities/vehicleCost';
import { Vehicle } from '@/entities/vehicle';
import { useGetVehicleCostById } from '@/hooks/vehicleCost';
import { useGetVehicleById } from '@/hooks/vehicle';
// import { VehicleCostForm } from './VehicleCostForm'; // a crear

export const VehicleCosts = () => {
  const { id } = useParams<{ id: string }>();
  const vehicleId = Number(id);

  const { data: cost, isLoading: isLoadingCost, error: errorCost } = useGetVehicleCostById(vehicleId);
  const { data: vehicle, isLoading: isLoadingVehicle, error: errorVehicle } = useGetVehicleById(vehicleId);

  const [localCost, setLocalCost] = useState<VehicleCost | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (cost) setLocalCost(cost);
  }, [cost]);

  if (isLoadingCost || isLoadingVehicle || !vehicle) {
    return (
      <Flex justifyContent="center" alignItems="center" h="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (errorCost || errorVehicle) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error al cargar los datos: {errorCost || errorVehicle}</Text>
      </Box>
    );
  }

  if (!localCost) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" p="2rem">
        <Text fontSize="lg" mb="1rem">
          Este vehículo no tiene un costo cargado.
        </Text>
        <Button onClick={onOpen}>Agregar costo</Button>
        {/* <VehicleCostForm
          isOpen={isOpen}
          onClose={onClose}
          vehicleId={vehicleId}
          initialData={null}
          setCost={setLocalCost}
        /> */}
      </Flex>
    );
  }

  const { amount, type, description, date } = localCost;

  return (
    <Box p="2rem">
      <Heading size="lg" mb="1rem">
        Vehículo: {vehicle.plate}
      </Heading>
      <Text>Marca: {vehicle.brand}</Text>
      <Text>Modelo: {vehicle.model}</Text>
      <Text mb="1rem">Capacidad de cajones: {vehicle.crateCapacity}</Text>

      <Flex justifyContent="space-between" alignItems="center" mb="1rem">
        <Heading size="md">Costo asociado</Heading>
        <Button onClick={onOpen}>Editar costo</Button>
      </Flex>

      <Box border="1px solid #ccc" borderRadius="md" p="1rem" mb="2rem">
        <Text>
          <strong>Tipo:</strong> {type}
        </Text>
        <Text>
          <strong>Monto:</strong> ${amount}
        </Text>
        <Text>
          <strong>Fecha:</strong> {new Date(date).toLocaleDateString()}
        </Text>
        <Text>
          <strong>Descripción:</strong> {description}
        </Text>
      </Box>

      {/* <VehicleCostForm
        isOpen={isOpen}
        onClose={onClose}
        vehicleId={vehicleId}
        initialData={localCost}
        setCost={setLocalCost}
      /> */}
    </Box>
  );
};
